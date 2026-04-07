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
  <div className="flex flex-col h-full bg-white">
    {/* Header */}
    <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2v6h6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-700 truncate">{fileName || "Chat"}</span>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
          <p className="text-gray-400 text-sm">Ask anything about this PDF</p>
        </div>
      )}

      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${msg.role === "user"
                ? "bg-black text-white rounded-br-sm"
                : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}>
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>

    {/* Input */}
    <div className="px-4 md:px-6 py-4 border-t border-gray-100">
      <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-transparent text-sm text-gray-800 outline-none py-1"
        />
        <button onClick={sendMessage} className="p-1.5 rounded-lg bg-black text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
);
}