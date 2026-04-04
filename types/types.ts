

export type MessageRole = "user" | "assistant";

export interface ChatRequest {
  question: string;
  chatId: string;
}

export interface MatchDocument {
  id: number;
  content: string;
  file_name: string;
  similarity: number;
}

export interface ChatResponse {
  reply: string;
  context?: string;
}