"use client";

import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input || !chatId) return;

    const newMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        question: input,
        chatId,
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply },
    ]);

    setInput("");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">DocuMind</h1>

      <div className="border p-4 h-[400px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <b>{msg.role}:</b> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-black text-white px-4">
          Send
        </button>
      </div>
    </div>
  );
}