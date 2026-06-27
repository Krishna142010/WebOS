import { useState, useEffect, useCallback } from "react";

function Notes() {
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem("aura_vfs");
    return saved ? JSON.parse(saved) : {};
  });

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Extract only text files from the VFS
  const textFiles = Object.values(fileSystem)
    .filter(node => node && node.type === "text")
    .sort((a, b) => b.modified - a.modified);

  // Auto-select the first file if none is selected
  useEffect(() => {
    if (!selectedId && textFiles.length > 0) {
      setSelectedId(textFiles[0].id);
    }
  }, [textFiles, selectedId]);

  // Sync back to VFS whenever fileSystem state changes
  useEffect(() => {
    localStorage.setItem("aura_vfs", JSON.stringify(fileSystem));
  }, [fileSystem]);

  const selectedNote = fileSystem[selectedId];

  const createNote = () => {
    const id = `text_${Date.now()}`;
    const newNote = {
      id,
      name: "Untitled.txt",
      type: "text",
      parent: "desktop", // Default save location
      content: "",
      size: 0,
      created: Date.now(),
      modified: Date.now(),
    };

    setFileSystem(prev => {
      const updated = { ...prev, [id]: newNote };
      // Link to desktop parent
      if (updated["desktop"]) {
        updated["desktop"] = {
          ...updated["desktop"],
          children: [...(updated["desktop"].children || []), id]
        };
      }
      return updated;
    });
    setSelectedId(id);
  };

  const deleteNote = () => {
    if (!selectedId) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      const target = updated[selectedId];
      if (target && updated[target.parent]) {
        updated[target.parent].children = updated[target.parent].children.filter(id => id !== selectedId);
      }
      delete updated[selectedId];
      return updated;
    });
    setSelectedId(null);
  };

  const updateContent = useCallback((value) => {
    if (!selectedId) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      if (updated[selectedId]) {
        const lines = value.split("\n");
        const autoName = lines[0].trim() ? `${lines[0].trim().substring(0, 20)}.txt` : "Untitled.txt";
        
        updated[selectedId] = {
          ...updated[selectedId],
          content: value,
          name: autoName,
          size: new Blob([value]).size,
          modified: Date.now(),
        };
      }
      return updated;
    });
  }, [selectedId]);

  const filteredNotes = textFiles.filter(note =>
    note.name.toLowerCase().includes(search.toLowerCase()) || 
    (note.content && note.content.toLowerCase().includes(search.toLowerCase()))
  );

  const words = selectedNote?.content?.trim()?.split(/\s+/)?.filter(Boolean).length || 0;
  const chars = selectedNote?.content?.length || 0;

  return (
    <div style={{ display: "flex", height: "100%", color: "#e8eef8", background: "transparent", fontFamily: '"Inter", sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: "260px", borderRight: "1px solid rgba(255,255,255,.08)", padding: "16px", display: "flex", flexDirection: "column", background: "rgba(10, 14, 26, 0.35)" }}>
        <button onClick={createNote} style={styles.newBtn}>+ New Document</button>
        <input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              style={{
                ...styles.noteListItem,
                background: selectedId === note.id ? "rgba(99, 102, 241, 0.2)" : "transparent",
                borderLeft: selectedId === note.id ? "3px solid #6366F1" : "3px solid transparent"
              }}
            >
              <div style={styles.noteTitle}>{note.name.replace(".txt", "")}</div>
              <div style={styles.noteMeta}>{new Date(note.modified).toLocaleDateString()}</div>
            </div>
          ))}
          {filteredNotes.length === 0 && <div style={styles.emptyText}>No text files found on disk.</div>}
        </div>
      </div>

      {/* EDITOR */}
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", background: "rgba(20, 24, 34, 0.6)" }}>
        {selectedNote ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "600" }}>{selectedNote.name}</h2>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                  C:\ {selectedNote.parent} \ {selectedNote.name} • Last modified: {new Date(selectedNote.modified).toLocaleTimeString()}
                </div>
              </div>
              <button onClick={deleteNote} style={styles.deleteBtn}>Delete</button>
            </div>

            <textarea
              value={selectedNote.content || ""}
              onChange={(e) => updateContent(e.target.value)}
              placeholder="Begin typing to write to disk..."
              style={styles.editorArea}
            />

            <div style={styles.statusBar}>
              <span>Size: {selectedNote.size} Bytes</span>
              <div style={{ display: "flex", gap: "16px" }}>
                <span>Words: {words}</span>
                <span>Chars: {chars}</span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)" }}>
            Select or create a document to begin.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  newBtn: { width: "100%", padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer", marginBottom: "16px", background: "#6366F1", color: "white", fontWeight: "600", fontSize: "12px", transition: "background 0.2s" },
  searchInput: { width: "100%", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", marginBottom: "16px", background: "rgba(255,255,255,.04)", color: "white", fontSize: "12px", outline: "none", boxSizing: "border-box" },
  noteListItem: { padding: "10px 12px", borderRadius: "0 6px 6px 0", cursor: "pointer", transition: "all 0.1s" },
  noteTitle: { fontSize: "13px", fontWeight: "500", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  noteMeta: { fontSize: "10px", color: "rgba(255,255,255,0.5)" },
  emptyText: { fontSize: "11px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "20px" },
  deleteBtn: { border: "1px solid rgba(239,68,68,0.4)", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", background: "rgba(239,68,68,0.1)", color: "#f87171", fontSize: "11px", transition: "all 0.2s" },
  editorArea: { flex: 1, resize: "none", border: "none", outline: "none", background: "transparent", color: "#e8eef8", fontSize: "14px", lineHeight: "1.6", fontFamily: '"Inter", sans-serif' },
  statusBar: { display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: '"SF Mono", monospace' }
};

export default Notes;