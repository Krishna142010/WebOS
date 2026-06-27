import { useState, useEffect, useCallback, useMemo } from "react";
import "./Explorer.css";

// Initial fallback disk image if localStorage is completely clear
const DEFAULT_DISK_IMAGE = {
  "root": { id: "root", name: "Aura Drive (C:)", type: "folder", parent: null, children: ["desktop", "documents", "downloads", "projects", "images"] },
  "desktop": { id: "desktop", name: "Desktop", type: "folder", parent: "root", children: ["readme.txt"] },
  "documents": { id: "documents", name: "Documents", type: "folder", parent: "root", children: [] },
  "downloads": { id: "downloads", name: "Downloads", type: "folder", parent: "root", children: [] },
  "projects": { id: "projects", name: "Projects", type: "folder", parent: "root", children: [] },
  "images": { id: "images", name: "Images", type: "folder", parent: "root", children: [] },
  "readme.txt": { id: "readme.txt", name: "readme.txt", type: "text", parent: "desktop", content: "Welcome to Aura OS. Deep space telemetry systems operational.", size: 58, created: Date.now(), modified: Date.now() }
};

const FAVORITES = [
  { id: "desktop", name: "Desktop", icon: "💻" },
  { id: "documents", name: "Documents", icon: "📁" },
  { id: "downloads", name: "Downloads", icon: "📥" },
  { id: "projects", name: "Projects", icon: "🛠️" },
  { id: "images", name: "Images", icon: "🖼️" },
];

function Explorer() {
  // --- File System State & Persistence ---
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem("aura_vfs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_DISK_IMAGE;
  });

  useEffect(() => {
    localStorage.setItem("aura_vfs", JSON.stringify(fileSystem));
  }, [fileSystem]);

  // --- Navigation & UX UI States ---
  const [currentFolderId, setCurrentFolderId] = useState("desktop");
  const [history, setHistory] = useState(["desktop"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const currentFolder = fileSystem[currentFolderId] || fileSystem["root"];

  // --- Navigation Controls ---
  const navigateTo = useCallback((folderId) => {
    if (!fileSystem[folderId] || fileSystem[folderId].type !== "folder") return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolderId(folderId);
    setSelectedNodeId(null);
  }, [history, historyIndex, fileSystem]);

  const handleBack = useCallback(() => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      setHistoryIndex(targetIndex);
      setCurrentFolderId(history[targetIndex]);
      setSelectedNodeId(null);
    }
  }, [historyIndex, history]);

  const handleForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      setHistoryIndex(targetIndex);
      setCurrentFolderId(history[targetIndex]);
      setSelectedNodeId(null);
    }
  }, [historyIndex, history]);

  const handleUp = useCallback(() => {
    if (currentFolder && currentFolder.parent) {
      navigateTo(currentFolder.parent);
    }
  }, [currentFolder, navigateTo]);

  // --- Computed Node Resolution ---
  const currentItems = useMemo(() => {
    if (!currentFolder || !currentFolder.children) return [];
    const items = currentFolder.children
      .map(id => fileSystem[id])
      .filter(item => item !== undefined);

    if (!searchQuery.trim()) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentFolder, fileSystem, searchQuery]);

  const selectedNode = useMemo(() => {
    return selectedNodeId ? fileSystem[selectedNodeId] : null;
  }, [selectedNodeId, fileSystem]);

  // --- Disk Write Operations (Mutations) ---
  const createNode = useCallback((type, baseName) => {
    const id = `${type}_${Date.now()}`;
    const extension = type === "text" ? ".txt" : "";
    const name = `${baseName}${extension}`;
    
    const newNode = {
      id,
      name,
      type,
      parent: currentFolderId,
      created: Date.now(),
      modified: Date.now(),
      size: type === "text" ? 0 : 4096,
      ...(type === "folder" ? { children: [] } : { content: "" })
    };

    setFileSystem(prev => {
      const updated = { ...prev };
      updated[id] = newNode;
      updated[currentFolderId] = {
        ...updated[currentFolderId],
        children: [...(updated[currentFolderId].children || []), id]
      };
      return updated;
    });
    setSelectedNodeId(id);
  }, [currentFolderId]);

  const deleteNode = useCallback((nodeId) => {
    if (!nodeId || FAVORITES.some(f => f.id === nodeId) || nodeId === "root") return;
    
    setFileSystem(prev => {
      const updated = { ...prev };
      const target = updated[nodeId];
      if (!target) return prev;

      const parentId = target.parent;
      if (updated[parentId]) {
        updated[parentId] = {
          ...updated[parentId],
          children: updated[parentId].children.filter(id => id !== nodeId)
        };
      }
      delete updated[nodeId];
      return updated;
    });

    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }, [selectedNodeId]);

  return (
    <div className="explorer">
      {/* Sidebar Navigation */}
      <aside className="ex-sidebar">
        <div className="ex-sidebar-header">Quick Access</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
          {FAVORITES.map(fav => (
            <button 
              key={fav.id} 
              className={`ex-sidebar-item ${currentFolderId === fav.id ? "active" : ""}`}
              onClick={() => navigateTo(fav.id)}
              style={sidebarItemStyle(currentFolderId === fav.id)}
            >
              <span>{fav.icon}</span> {fav.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main File View Matrix */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Navigation Control Bar */}
        <header className="ex-toolbar" style={toolbarStyle}>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={handleBack} disabled={historyIndex === 0} style={navBtnStyle}>←</button>
            <button onClick={handleForward} disabled={historyIndex === history.length - 1} style={navBtnStyle}>→</button>
            <button onClick={handleUp} disabled={!currentFolder.parent} style={navBtnStyle}>↑</button>
          </div>
          <div style={breadcrumbStyle}>
            C:\ {currentFolder?.name}
          </div>
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchStyle}
          />
        </header>

        {/* Action Menu Strip */}
        <div style={actionBarStyle}>
          <button onClick={() => createNode("folder", "New Folder")} style={actionBtnStyle}>+ New Folder</button>
          <button onClick={() => createNode("text", "Document")} style={actionBtnStyle}>+ New Text File</button>
          <button 
            onClick={() => setViewMode(prev => prev === "grid" ? "list" : "grid")} 
            style={actionBtnStyle}
          >
            Layout: {viewMode.toUpperCase()}
          </button>
        </div>

        {/* Content Pane */}
        <main style={contentPaneStyle(viewMode)}>
          {currentItems.map(item => (
            <div 
              key={item.id}
              onClick={() => setSelectedNodeId(item.id)}
              onDoubleClick={() => item.type === "folder" && navigateTo(item.id)}
              style={itemCardStyle(selectedNodeId === item.id, viewMode)}
            >
              <div style={{ fontSize: viewMode === "grid" ? "24px" : "16px" }}>
                {item.type === "folder" ? "📁" : "📄"}
              </div>
              <div className="ex-truncate" style={{ fontWeight: "500" }}>{item.name}</div>
            </div>
          ))}
          {currentItems.length === 0 && (
            <div style={{ color: "rgba(255,255,255,0.3)", padding: "20px", width: "100%" }}>
              This directory is empty.
            </div>
          )}
        </main>
      </div>

      {/* Details Metadata Panel */}
      {selectedNode && (
        <aside style={detailsPanelStyle}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "6px" }}>Properties</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
            <div><strong>Name:</strong> {selectedNode.name}</div>
            <div><strong>Type:</strong> {selectedNode.type.toUpperCase()}</div>
            <div><strong>Size:</strong> {selectedNode.size} Bytes</div>
            <button 
              onClick={() => deleteNode(selectedNode.id)} 
              style={deleteBtnStyle}
            >
              Delete Item
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

// --- Scoped UI Utility Style Configurations ---
const toolbarStyle = { display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(20,24,36,0.2)" };
const navBtnStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "4px 10px", borderRadius: "4px", cursor: "pointer" };
const breadcrumbStyle = { flex: 1, padding: "6px 12px", background: "rgba(0,0,0,0.2)", borderRadius: "4px", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.04)" };
const searchStyle = { width: "180px", padding: "6px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" };
const actionBarStyle = { display: "flex", gap: "8px", padding: "8px 12px", background: "rgba(0,0,0,0.1)", borderBottom: "1px solid rgba(255,255,255,0.04)" };
const actionBtnStyle = { background: "transparent", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: "11px", padding: "4px 8px", borderRadius: "4px" };
const deleteBtnStyle = { marginTop: "12px", padding: "6px", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#ff8888", borderRadius: "4px", cursor: "pointer" };
const detailsPanelStyle = { width: "220px", borderLeft: "1px solid rgba(255,255,255,0.08)", padding: "16px", background: "rgba(10,14,26,0.2)" };

function sidebarItemStyle(isActive) {
  return { width: "100%", textAlign: "left", background: isActive ? "rgba(255,255,255,0.08)" : "transparent", border: "none", color: "#fff", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" };
}

function contentPaneStyle(viewMode) {
  return viewMode === "grid" 
    ? { flex: 1, overflowY: "auto", padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "16px", alignContent: "start" }
    : { flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "4px" };
}

function itemCardStyle(isSelected, viewMode) {
  const base = { display: "flex", flexDirection: viewMode === "grid" ? "column" : "row", alignItems: "center", gap: "8px", padding: "10px", borderRadius: "6px", cursor: "pointer", border: isSelected ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent", background: isSelected ? "rgba(255,255,255,0.06)" : "transparent" };
  if (viewMode === "grid") { base.textAlign = "center"; base.justifyContent = "center"; }
  return base;
}

export default Explorer;