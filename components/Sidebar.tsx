"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import UploadModal from "./UploadModal";
import { supabase } from "@/utils/supabase";

type Chat = {
  id: string;
  file_name: string;
  created_at: string;
};

export default function Sidebar({ chats }: { chats: Chat[] }) {
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();
  const params = useParams();
  const activeChatId = params?.chatId as string;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      <div style={{
        width: "260px",
        height: "100vh",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        gap: "8px",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontWeight: 600, fontSize: "16px" }}>PDF Chats</span>
          <button onClick={handleLogout} style={{ fontSize: "12px", color: "#6b7280" }}>
            Logout
          </button>
        </div>

        {/* New PDF button */}
        <button
          onClick={() => setShowUpload(true)}
          style={{
            width: "100%",
            padding: "10px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "8px",
          }}
        >
          + New PDF
        </button>

        {/* Chat list */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
          {chats.length === 0 && (
            <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", marginTop: "24px" }}>
              No chats yet. Upload a PDF to start.
            </p>
          )}
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: activeChatId === chat.id ? "#f3f4f6" : "transparent",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                color: "#111",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {chat.file_name}
            </button>
          ))}
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  );
}