import { embedText } from "./embedding";

 function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function findBestMatch(query, embeddedChunks) {
  const queryVector = await embedText(query);
  

  let bestScore = -Infinity;
  let bestChunk = "";

  for (const item of embeddedChunks) {
    const score = cosineSimilarity(queryVector, item.vector);

    if (score > bestScore) {
      bestScore = score;
      bestChunk = item.chunk;
    }
  }

  return bestChunk;
}