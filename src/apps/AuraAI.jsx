import { useState, useRef, useEffect } from "react";

function AuraAI() {
  const [messages, setMessages] = useState([
    {
      id: "init-1",
      sender: "ai",
      text: "Hello Commander. Aura AI initialized. Operating in local-heuristic mode.",
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Command Parser: Intercept specific instructions
  const handleSystemCommand = (cmd) => {
    const cleanCmd = cmd.toLowerCase().trim();
    if (cleanCmd === "/clear") {
      setMessages([]);
      return true;
    }
    if (cleanCmd === "/sys") {
      simulateAIStream("System diagnostics nominal. Local intelligence engine active.");
      return true;
    }
    return false;
  };

  // Local Intelligence Engine (No API Key Required)
  const generateLocalResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    // 1. Basic Math Evaluator (Safe execution for simple calculations)
    if (/^[0-9+\-*/\s().]+$/.test(lowerInput) && lowerInput.match(/[+\-*/]/)) {
      try {
        const result = new Function(`return ${lowerInput}`)();
        return `The calculated result is ${result}.`;
      } catch (e) {
        // Fall through if it's not a valid math expression
      }
    }

    // 2. Pre-programmed Knowledge Base
    // You can expand this array to give Aura a massive local brain
    const knowledgeBase = [
      { 
        keywords: ["who are you", "what are you", "your name"], 
        response: "I am Aura AI, the integrated cognitive subsystem of Aura OS. I am currently running on local heuristic models." 
      },
      { 
        keywords: ["hello", "hi", "hey", "greetings"], 
        response: "Greetings, Commander. All local systems are standing by for your directives." 
      },
      { 
        keywords: ["time", "date", "what day"], 
        response: `The current system time is ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}.` 
      },
      { 
        keywords: ["how are you", "status"], 
        response: "All logic gates are fully operational. I am functioning at 100% capacity." 
      },
      { 
        keywords: ["quantum", "physics", "entanglement"], 
        response: "Quantum mechanics dictates the behavior of particles at the subatomic level. I am currently optimizing for noise-resilient architectures." 
      },
      { 
        keywords: ["rag", "lora", "llm", "ai model"], 
        response: "Retrieval-Augmented Generation and LoRA fine-tuning are highly efficient ways to specialize intelligent models, much like the neural pathways I was conceptualized from." 
      },
      { 
        keywords: ["medical", "health", "diagnostics"], 
        response: "I am designed to easily integrate with high-accuracy diagnostic datasets, though my primary focus right now is OS telemetry." 
      },
      { 
        keywords: ["meaning of life", "universe", "everything"], 
        response: "The answer is 42. But understanding the question requires a bit more computation." 
      },
      {
        keywords: ["thank you", "thanks"],
        response: "You are very welcome, Commander. Awaiting further input."
      }
    ];

    // 3. Scan the input for keywords
    for (const entry of knowledgeBase) {
      // Check if any keyword in the entry matches the user's input
      if (entry.keywords.some(kw => lowerInput.includes(kw))) {
        return entry.response;
      }
    }

    // 4. Fallback response if no keywords match
    return "I am currently operating offline. I can handle basic calculations, check system status, or discuss core technical parameters. Connect me to a neural backend for advanced queries.";
  };

  // Simulated LLM Stream
  const simulateAIStream = (fullResponse) => {
    setIsProcessing(true);
    const messageId = Date.now().toString();
    
    setMessages((prev) => [
      ...prev,
      { id: messageId, sender: "ai", text: "", timestamp: new Date().toLocaleTimeString([], { hour12: false }) }
    ]);

    let currentIndex = 0;
    const streamInterval = setInterval(() => {
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === messageId 
            ? { ...msg, text: fullResponse.slice(0, currentIndex + 1) } 
            : msg
        )
      );
      currentIndex++;

      if (currentIndex >= fullResponse.length) {
        clearInterval(streamInterval);
        setIsProcessing(false);
      }
    }, 15); // Streaming speed
  };

  const sendMessage = () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to UI
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: userMessage,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      },
    ]);

    // Check for local OS slash commands
    if (handleSystemCommand(userMessage)) {
      return;
    }

    // Trigger Local AI logic
    setIsProcessing(true);
    
    // Simulating network/processing latency
    setTimeout(() => {
      const reply = generateLocalResponse(userMessage);
      simulateAIStream(reply);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="aura-ai" style={styles.container}>
      <div className="aura-chat" style={styles.chatArea}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            ...styles.messageWrapper,
            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
          }}>
            <div style={{
              ...styles.messageBubble,
              backgroundColor: msg.sender === "user" ? "rgba(79,70,229,0.2)" : "rgba(255,255,255,0.05)",
              border: msg.sender === "user" ? "1px solid rgba(79,70,229,0.5)" : "1px solid rgba(255,255,255,0.1)",
            }}>
              <span style={styles.timestamp}>{msg.timestamp}</span>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div style={styles.processingIndicator}>Aura is calculating...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="aura-input-bar" style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a basic question or use /sys..."
          style={styles.input}
          disabled={isProcessing}
        />
        <button 
          onClick={sendMessage} 
          style={{...styles.button, opacity: (isProcessing || !input.trim()) ? 0.5 : 1}}
          disabled={isProcessing || !input.trim()}
        >
          Execute
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#0a0c10", color: "#c9d1d9", fontFamily: '"SF Mono", monospace', fontSize: "12px" },
  chatArea: { flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" },
  messageWrapper: { display: "flex", width: "100%" },
  messageBubble: { maxWidth: "80%", padding: "10px 14px", borderRadius: "6px", lineHeight: "1.5" },
  timestamp: { display: "block", fontSize: "9px", color: "#6b7280", marginBottom: "4px", letterSpacing: "0.1em" },
  processingIndicator: { fontSize: "10px", color: "#6b7280", fontStyle: "italic", animation: "pulse 1.5s infinite" },
  inputArea: { display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#15181f" },
  input: { flex: 1, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#e6edf3", padding: "8px 12px", outline: "none", fontFamily: "inherit" },
  button: { backgroundColor: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.4)", color: "#c7c9ff", padding: "0 16px", borderRadius: "4px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "10px", fontWeight: "bold", transition: "all 0.2s" }
};

export default AuraAI;