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

    // small delay so user sees the progress message
    await new Promise((r) => setTimeout(r, 800));

    onClose();
    router.push(`/dashboard/chat/${data.chatId}`);
    router.refresh(); 
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        width: "360px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
        <h2 style={{ margin: 0, fontSize: "18px" }}>Upload a PDF</h2>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: "2px dashed #d1d5db",
            borderRadius: "8px",
            padding: "32px",
            textAlign: "center",
            cursor: "pointer",
            color: file ? "#111" : "#9ca3af",
            fontSize: "14px",
          }}
        >
          {file ? file.name : "Click to select a PDF"}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Progress */}
        {progress && (
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            {progress}
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            disabled={uploading}
            style={{ padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "transparent", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              padding: "8px 16px",
              background: file && !uploading ? "#000" : "#d1d5db",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: file && !uploading ? "pointer" : "not-allowed",
            }}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}