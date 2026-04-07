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
    <div className="w-64 h-full bg-gray-50 border-r border-gray-100 flex flex-col p-4 gap-2">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold text-sm text-gray-900">PDF Chat</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* New PDF button */}
      <button
        onClick={() => setShowUpload(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        New PDF
      </button>

      {/* Section label */}
      <p className="text-xs text-gray-400 font-medium px-1 mt-2">Recent chats</p>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1">
        {chats.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
            No chats yet.<br/>Upload a PDF to start.
          </p>
        )}
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors group
              ${activeChatId === chat.id
                ? "bg-white shadow-sm border border-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-white hover:text-gray-900"
              }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs truncate">{chat.file_name}</span>
          </button>
        ))}
      </div>

    </div>

    {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
  </>
);
}