import { embedText } from "@/utils/embedding";
import Groq from "groq-sdk";
import { supabase } from "@/utils/supabase";
import { NextRequest } from "next/server";
import { ChatRequest, MatchDocument } from "@/types/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});



export async function POST(req:NextRequest) {
  const { question, chatId }:ChatRequest = await req.json();
  await supabase.from("messages").insert({
  chat_id: chatId,
  role: "user",
  content: question
});

  const queryVector = await embedText(question);

const response = await supabase.rpc("match_documents", {
  query_embedding: queryVector,
  match_count: 3, 
  chat_id_input: chatId
});
const {data}: { data: MatchDocument[] | null } = response
if (!data || data.length === 0) {
  return Response.json({
    reply: "No relevant information found in the document."
  });
}
const context = data.map(d => d.content).join("\n\n").slice(0, 3000);

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
  await supabase.from("messages").insert({
  chat_id: chatId,
  role: "assistant",
  content: completion.choices[0].message.content
});

const answer:string = completion.choices[0].message.content ?? "I don't know";

  return Response.json({
    reply: answer,
    context
  });
}