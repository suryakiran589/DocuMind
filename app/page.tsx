import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-md flex flex-col items-center gap-6">
        
        {/* Icon */}
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8M16 17H8M10 9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">PDF Chat</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Upload any PDF and ask questions about it.<br />
            Get instant answers powered by AI.
          </p>
        </div>

        {/* Features */}
        <div className="w-full flex flex-col gap-2">
          {[
            "Upload any PDF document",
            "Ask questions in plain English",
            "AI answers from your document only",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100" />

        {/* Login */}
        <div className="w-full flex flex-col items-center gap-3">
          <LoginButton />
          <p className="text-xs text-gray-400">
            No account needed — just sign in with Google
          </p>
        </div>

      </div>
    </div>
  );
  
}
