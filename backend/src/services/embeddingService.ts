import contentModel from "../models/content.model";
import { Types } from "mongoose";
import * as cheerio from "cheerio";
import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParseLib = require("pdf-parse");
const pdfParse = pdfParseLib.default || pdfParseLib;
// ─── 1. GET EMBEDDING FROM JINA ────────────────────────────────────────────
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.jina.ai/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.JINA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "jina-embeddings-v3",
      input: [text.slice(0, 8000)],
      task: "text-matching",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Jina API error:", JSON.stringify(errorBody, null, 2));
    throw new Error(`Jina embedding API failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding as number[];
}

// ─── 2. FETCH CONTENT BY TYPE ──────────────────────────────────────────────
async function fetchContent(
  type: string,
  link: string,
  notes: string,
  fileUrl?: string,
): Promise<string> {
  switch (type) {
    case "document": {
      if (fileUrl) {
        try {
          const response = await axios.get(fileUrl, {
            responseType: "arraybuffer",
          });
          const data = await pdfParse(Buffer.from(response.data));
          return data.text.slice(0, 8000) || notes;
        } catch (err: any) {
          console.error("PDF parse error:", err.message);
          return notes;
        }
      }
      // fallback scrape link
      if (link) {
        try {
          const { data: html } = await axios.get(link, {
            timeout: 8000,
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; SecondBrain/1.0)",
            },
          });
          const $ = cheerio.load(html);
          $("script, style, nav, footer, header, aside").remove();
          return (
            $("article, main, .content, p")
              .text()
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 8000) || notes
          );
        } catch {
          return notes;
        }
      }
      return notes;
    }

    case "youtube": {
      try {
        const videoId = new URL(link).searchParams.get("v");
        if (!videoId) return notes;
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        return transcript.map((t) => t.text).join(" ");
      } catch {
        return notes;
      }
    }

    case "link": {
      try {
        const { data: html } = await axios.get(link, {
          timeout: 8000,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; SecondBrain/1.0)",
          },
        });
        const $ = cheerio.load(html);
        $("script, style, nav, footer, header, aside").remove();
        return (
          $("article, main, .content, p")
            .text()
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 8000) || notes
        );
      } catch {
        return notes;
      }
    }

    case "tweet":
    case "post":
    default:
      return notes;
  }
}

// ─── 3. BUILD THE TEXT TO EMBED ────────────────────────────────────────────
function buildEmbedInput(
  title: string,
  notes: string,
  extractedText: string,
): string {
  return `${title}. ${notes}. ${extractedText}`.trim();
}

// ─── 4. MAIN ENTRY POINT ───────────────────────────────────────────────────
export async function processEmbedding(
  contentId: Types.ObjectId,
  type: string,
  link: string,
  title: string,
  notes: string,
  fileUrl?: string,
): Promise<void> {
  try {
    const extractedText = await fetchContent(type, link, notes, fileUrl);
    const embedInput = buildEmbedInput(title, notes, extractedText);
    const embedding = await getEmbedding(embedInput);

    await contentModel.findByIdAndUpdate(contentId, {
      extractedText,
      embedding,
      isEmbedded: true,
    });
  } catch (error: any) {
    console.error(`Embedding failed for ${contentId}:`, error.message);
  }
}
