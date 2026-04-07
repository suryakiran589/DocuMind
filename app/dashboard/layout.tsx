import { getSupabaseServer } from "@/utils/supabaseServer";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

import MobileNav from "@/components/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase =await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();


  if (!user) redirect("/");

  const { data: chats } = await supabase
    .from("chats")
    .select("id, file_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

 return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Desktop Sidebar: Visible only on md (768px) and up */}
      <div className="hidden md:flex md:w-64 md:flex-col h-full">
        <Sidebar chats={chats ?? []} />
      </div>

      {/* Mobile Nav: Client Component to handle toggle state */}
      <MobileNav chats={chats ?? []} />

      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Adds padding at top on mobile to account for the fixed header */}
        <div className="flex-1 h-full pt-14 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}