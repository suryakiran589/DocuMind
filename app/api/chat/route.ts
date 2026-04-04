import { embedText } from "@/utils/embedding";
import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import { ChatRequest, MatchDocument } from "@/types/types";
import { getSupabaseServer } from "@/utils/supabaseServer";
import { console } from "inspector";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer();


  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question, chatId }: ChatRequest = await req.json();

  // 🔒 Ensure chat belongs to user
  const { data: chat } = await supabase
    .from("chats")
    .select("id")
    .eq("id", chatId)
    .eq("user_id", user.id)
    .single();

  if (!chat) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }


  await supabase.from("messages").insert({
    chat_id: chatId,
    role: "user",
    content: question,
    user_id:user.id
  });

  const queryVector = await embedText(question);
  console.log(queryVector)
  console.log(chatId)

  const response = await supabase.rpc("match_documents", {
    query_embedding: queryVector,
    match_count: 3,
    chat_id_input: chatId,
  });

  const { data }: { data: MatchDocument[] | null } = response;
  console.log(data)

  if (!data || data.length === 0) {
    await supabase.from("messages").insert({
    chat_id: chatId,
    role: "assistant",
    content: "No relevant information found in the document.",
    user_id:user.id
  });
    return Response.json({
      reply: "No relevant information found in the document.",
    });
  }

  const context = data
    .map((d) => d.content)
    .join("\n\n")
    .slice(0, 3000);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are a helpful assistant.
Answer ONLY from the provided context.
If the answer is not in the context, say "I don't know".
`,
      },
      {
        role: "user",
        content: `Context: ${context}\n\nQuestion: ${question}`,
      },
    ],
    temperature: 0.2,
  });

  const answer: string =
    completion.choices[0].message.content ?? "I don't know";


  await supabase.from("messages").insert({
    chat_id: chatId,
    role: "assistant",
    content: answer,
    user_id:user.id
  });

  return Response.json({
    reply: answer,
  });
}