"use client";

import { supabase } from "@/utils/supabase";

export default function LoginButton() {
  
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  return (
    <button onClick={handleLogin}>
      Login with Google
    </button>
  );
}