"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { MessageSquare, X, ArrowUp, Bot } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "64px",
          height: "64px",
          borderRadius: "50%", // Perfectly round futuristic button
          backgroundColor: "var(--text-primary)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: isOpen ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          zIndex: 9999,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05) translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(255, 51, 0, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
        }}
      >
        <MessageSquare size={26} strokeWidth={1.5} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            width: "400px",
            height: "650px",
            maxHeight: "85vh",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)", // Futuristic glassmorphism
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "28px", // Sleek, rounded futuristic edges
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1.5rem 2rem",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "var(--accent-orange)",
                  borderRadius: "50%",
                  boxShadow: "0 0 12px var(--accent-orange)",
                  animation: "pulse 2s infinite",
                }}
              />
              <div>
                <h3 style={{ fontSize: "1.05rem", margin: 0, fontFamily: "var(--font-heading)", letterSpacing: "0.5px" }}>Digital Twin</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>AI Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                transition: "color 0.2s ease",
                padding: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "2rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              backgroundColor: "transparent",
            }}
          >
            {messages.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", opacity: 0.7 }}>
                <div style={{ padding: "1.5rem", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.03)", marginBottom: "1rem" }}>
                  <Bot size={36} strokeWidth={1.5} color="var(--text-primary)" />
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "0.5px" }}>System Ready</div>
                <div style={{ fontSize: "0.85rem", marginTop: "0.5rem", textAlign: "center", maxWidth: "80%", lineHeight: 1.5 }}>
                  Ask me about Gian's professional history, technical skills, or methodology.
                </div>
              </div>
            )}
            
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isUser ? "var(--text-primary)" : "#f4f4f5",
                      color: isUser ? "#fff" : "var(--text-primary)",
                      padding: "1rem 1.25rem",
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      maxWidth: "85%",
                      borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px", // Futuristic sleek bubble
                      boxShadow: isUser ? "0 4px 15px rgba(0,0,0,0.1)" : "none",
                      border: isUser ? "none" : "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div style={{ alignSelf: "flex-start", display: "flex", gap: "0.5rem", alignItems: "center", padding: "1rem 1.25rem", backgroundColor: "#f4f4f5", borderRadius: "20px 20px 20px 4px" }}>
                <div className="typing-dot" style={{ width: "6px", height: "6px", backgroundColor: "var(--accent-orange)", borderRadius: "50%", animation: "blink 1.4s infinite 0s" }} />
                <div className="typing-dot" style={{ width: "6px", height: "6px", backgroundColor: "var(--accent-orange)", borderRadius: "50%", animation: "blink 1.4s infinite 0.2s" }} />
                <div className="typing-dot" style={{ width: "6px", height: "6px", backgroundColor: "var(--accent-orange)", borderRadius: "50%", animation: "blink 1.4s infinite 0.4s" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "1rem 1.5rem 1.5rem",
              backgroundColor: "transparent",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f4f4f5",
                borderRadius: "30px", // Futuristic pill-shaped input
                padding: "0.5rem 0.5rem 0.5rem 1.5rem",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = "#f4f4f5";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Message Digital Twin..."
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  background: isLoading || !input.trim() ? "rgba(0,0,0,0.05)" : "var(--accent-orange)",
                  color: isLoading || !input.trim() ? "var(--text-muted)" : "#fff",
                  border: "none",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  marginLeft: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && input.trim()) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 51, 0, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && input.trim()) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <ArrowUp size={20} strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 51, 0, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(255, 51, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 51, 0, 0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}} />
    </>
  );
}
