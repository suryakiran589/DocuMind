"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function MobileNav({ chats }: { chats: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center px-4 z-30">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="ml-2 font-semibold text-sm text-gray-900">DocuMind</span>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out md:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* We reuse the Sidebar component, and pass a close handler to links if needed */}
        <Sidebar chats={chats} />
      </div>
    </>
  );
}