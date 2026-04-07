"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress("Uploading PDF...");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setProgress("Upload failed. Try again.");
      setUploading(false);
      return;
    }

    setProgress("Processing chunks...");

    await new Promise((r) => setTimeout(r, 800));

    onClose();
    router.push(`/dashboard/chat/${data.chatId}`);
    router.refresh(); 
  };

 return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">
    <div className="bg-white rounded-2xl p-5 md:p-6 w-full max-w-sm flex flex-col gap-5 shadow-xl">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-900">Upload a PDF</h2>
        <p className="text-xs text-gray-400">Ready to chat with your document</p>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 md:p-8 text-center cursor-pointer hover:bg-gray-50"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#9ca3af" strokeWidth="2" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">
            {file ? file.name : "Select a PDF"}
          </p>
        </div>
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">Cancel</button>
        <button onClick={handleUpload} className="px-4 py-2 text-sm text-white bg-black rounded-lg">Upload</button>
      </div>
    </div>
  </div>
);
}