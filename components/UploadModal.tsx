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
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5 shadow-xl">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-900">Upload a PDF</h2>
        <p className="text-xs text-gray-400">Your PDF will be processed and ready to chat</p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${file
            ? "border-black bg-gray-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center
            ${file ? "bg-black" : "bg-gray-100"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke={file ? "white" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6"
                stroke={file ? "white" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${file ? "text-gray-900" : "text-gray-400"}`}>
              {file ? file.name : "Click to select a PDF"}
            </p>
            {!file && <p className="text-xs text-gray-300 mt-0.5">PDF files only</p>}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* Progress */}
      {progress && (
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin flex-shrink-0">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
              stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p className="text-xs text-gray-500">{progress}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={onClose}
          disabled={uploading}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-4 py-2 text-sm text-white rounded-lg transition-colors
            ${file && !uploading
              ? "bg-black hover:bg-gray-800 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

    </div>
  </div>
);
}