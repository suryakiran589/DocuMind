import { getSupabaseServer } from "@/utils/supabaseServer";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

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
  <div className="flex h-screen bg-gray-50">
    <Sidebar chats={chats ?? []} />
    <main className="flex-1 overflow-hidden bg-white">
      {children}
    </main>
  </div>
);
}