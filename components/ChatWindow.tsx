"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: string; content: string };

export default function ChatWindow({
  chatId,
  fileName,
  initialMessages,
}: {
  chatId: string;
  fileName: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!question.trim() || loading) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, chatId }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply },
    ]);
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
      }}>
        {fileName}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.length === 0 && (
          <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "40px" }}>
            Ask anything about this PDF
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "70%",
              padding: "12px 16px",
              borderRadius: "12px",
              background: msg.role === "user" ? "#000" : "#f3f4f6",
              color: msg.role === "user" ? "#fff" : "#111",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: "flex-start",
            padding: "12px 16px",
            borderRadius: "12px",
            background: "#f3f4f6",
            color: "#9ca3af",
            fontSize: "14px",
          }}>
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "16px 24px",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        gap: "8px",
      }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a question about the PDF..."
          style={{
            flex: 1,
            padding: "10px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!question.trim() || loading}
          style={{
            padding: "10px 20px",
            background: question.trim() && !loading ? "#000" : "#d1d5db",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: question.trim() && !loading ? "pointer" : "not-allowed",
            fontSize: "14px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}