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
        className="chat-toggle-btn"
        style={{ display: isOpen ? "none" : "flex" }}
        aria-label="Open Digital Twin chat assistant"
      >
        <MessageSquare size={26} strokeWidth={1.5} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-status-dot" />
              <div>
                <h3>Digital Twin</h3>
                <span>AI Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chat-close-btn"
              aria-label="Close Digital Twin chat"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty-state">
                <div className="chat-bot-icon">
                  <Bot size={36} strokeWidth={1.5} />
                </div>
                <div className="chat-ready-text">System Ready</div>
                <div className="chat-hint-text">
                  Ask me about Gian's professional history, technical skills, or methodology.
                </div>
              </div>
            )}
            
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`chat-message-wrapper ${isUser ? 'user' : 'system'}`}
                >
                  <div className={`chat-bubble ${isUser ? 'user' : 'system'}`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="chat-loading-indicator">
                <div className="typing-dot dot-1" />
                <div className="typing-dot dot-2" />
                <div className="typing-dot dot-3" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="chat-input-area">
            <div className="chat-input-container">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Message Digital Twin..."
                className="chat-input-field"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="chat-submit-btn"
                aria-label="Send message"
              >
                <ArrowUp size={20} strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
