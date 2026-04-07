export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2v6h6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8M16 17H8M10 9H8" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-gray-700 font-medium">No PDF selected</p>
        <p className="text-gray-400 text-sm max-w-[240px] md:max-w-none">
          Upload a new PDF or select a chat from the sidebar to begin.
        </p>
      </div>
    </div>
  );
}