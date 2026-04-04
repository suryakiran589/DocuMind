import { embedText } from "@/utils/embedding";
import { getSupabaseServer } from "@/utils/supabaseServer";
import pdf from "pdf-parse";
import { NextRequest } from "next/server";

type PDFParseResult = {
  text: string;
};

function splitText(text: string, chunkSize = 50) {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}

export async function POST(req: NextRequest) {
  const supabase =await getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileName = file.name;


  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .insert({
      file_name: fileName,
      user_id: user.id, 
    })
    .select()
    .single();

  if (chatError || !chatData) {
    return Response.json({ error: "Chat creation failed" }, { status: 500 });
  }

  const chatId = chatData.id;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const data: PDFParseResult = await pdf(buffer);
  const text = data.text;

  const chunks = splitText(text);

  for (const chunk of chunks) {
    const vector = await embedText(chunk);

    await supabase.from("documents").insert({
      content: chunk,
      embedding: vector,
      file_name: fileName,
      chat_id: chatId,
      user_id: user.id,
    });
  }

  return Response.json({
    message: "File uploaded successfully",
    chatId,
  });
}