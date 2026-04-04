export const runtime = "nodejs";
import { embedText } from "@/utils/embedding";
import { findBestMatch } from "@/utils/helpers";
import { store } from "@/utils/store";
import { supabase } from "@/utils/supabase";
import pdf from "pdf-parse";
function splitText(text: any, chunkSize = 50) {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}
export async function POST(req: any) {
  const formData = await req.formData();
  const file = formData.get("file");
const fileName = file.name; 
const { data: chatData, error: chatError } = await supabase
  .from("chats")
  .insert({
    file_name: file.name
  })
  .select()
  .single();

if (chatError) {
  return Response.json({ error: "Chat creation failed" }, { status: 500 });
}

const chatId = chatData.id;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const data = await pdf(buffer);

  const text = data.text;
  const chunks = splitText(text);
  // const embeddedChunks = [];

  for (const chunk of chunks) {
    const vector = await embedText(chunk);
    console.log(vector.length);

    await supabase.from("documents").insert({
    content: chunk,
    embedding: vector,
    file_name: fileName,
    chat_id: chatId 
  });
  }

  return Response.json({
    message: "File uploaded successfully",
    chatId
  });
}
