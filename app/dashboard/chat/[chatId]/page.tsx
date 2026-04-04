import { getSupabaseServer } from "@/utils/supabaseServer";
import { redirect } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const {chatId} = await params

  if (!user) redirect("/");

  // verify this chat belongs to this user
  const { data: chat } = await supabase
    .from("chats")
    .select("id, file_name")
    .eq("id", chatId)
    .eq("user_id", user.id)
    .single();

  if (!chat) redirect("/dashboard");

  // load existing messages
  const { data: messages } = await supabase
    .from("messages")
    .select("role, content")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  return (
    <ChatWindow
      chatId={chat.id}
      fileName={chat.file_name}
      initialMessages={messages ?? []}
    />
  );
}