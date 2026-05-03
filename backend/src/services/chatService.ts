import Groq from "groq-sdk";
import contentModel from "../models/content.model";
import { getEmbedding } from "./embeddingService";
import { Types } from "mongoose";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ─── Find relevant docs from user's brain ──────────────────────────────────
async function findRelevantDocs(
  query: string,
  userId: Types.ObjectId,
  limit: number = 5,
) {
  const queryEmbedding = await getEmbedding(query);

  const results = await contentModel.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit,
        filter: {
          userId: new Types.ObjectId(userId),
        },
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    },
    {
      $project: {
        title: 1,
        type: 1,
        notes: 1,
        extractedText: 1,
        link: 1,
        tags: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results;
}

// ─── Build prompt from relevant docs ───────────────────────────────────────
function buildPrompt(query: string, docs: any[]): string {
  const context = docs
    .map((doc, idx) => {
      const content = doc.extractedText || doc.notes || "";
      const tags = doc.tags?.map((t: any) => t.tag).join(", ") || "";
      return `[Source ${idx + 1}] Title: "${doc.title}" | Type: ${doc.type} | Tags: ${tags}
Content: ${content.slice(0, 1000)}`;
    })
    .join("\n\n");

  return `You are a helpful AI assistant for a Second Brain app. 
The user has saved various content — notes, YouTube videos, documents, links, and tweets — in their personal knowledge base.

Here is the relevant content from the user's Second Brain that relates to their question:

${context}

Based ONLY on the content above from the user's Second Brain, answer the following question:
"${query}"

Guidelines:
- Answer based only on what's in the user's saved content
- If the content doesn't have enough information, say so honestly
- Reference specific sources by their title when relevant
- Be concise and helpful
- If the user asks to summarize, give a clear structured summary`;
}

// ─── Main chat function ─────────────────────────────────────────────────────
export async function chat(
  query: string,
  userId: Types.ObjectId,
): Promise<{ answer: string; sources: any[] }> {
  // Step 1: find relevant docs from user's brain
  const relevantDocs = await findRelevantDocs(query, userId);

  if (relevantDocs.length === 0) {
    return {
      answer:
        "I couldn't find any relevant content in your Second Brain for this question. Try adding more content first!",
      sources: [],
    };
  }

  // Step 2: build prompt with context
  const prompt = buildPrompt(query, relevantDocs);

  // Step 3: send to Groq LLM
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", // free, fast model
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const answer =
    completion.choices[0]?.message?.content || "No response generated";

  // Step 4: return answer + source documents
  const sources = relevantDocs.map((doc) => ({
    _id: doc._id,
    title: doc.title,
    type: doc.type,
    link: doc.link,
    score: doc.score,
    tags: doc.tags,
  }));

  return { answer, sources };
}
