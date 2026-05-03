import supabase from "../config/supabase";
import axios from "axios";
import { Types } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParseLib = require("pdf-parse");
const pdfParse = pdfParseLib.default || pdfParseLib;

export async function uploadFile(
  file: Express.Multer.File,
  userId: Types.ObjectId,
): Promise<string> {
  const fileName = `${userId.toString()}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("SecondBrain")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from("SecondBrain").getPublicUrl(fileName);

  return data.publicUrl;
}

export async function extractPdfText(fileUrl: string): Promise<string> {
  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });
    const data = await pdfParse(Buffer.from(response.data));
    return data.text.slice(0, 8000);
  } catch (err) {
    console.error("PDF extraction failed:", err);
    return "";
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const path = fileUrl.split("/secondbrain/")[1];
  if (!path) return;

  const { error } = await supabase.storage.from("SecondBrain").remove([path]);

  if (error) console.error("File delete failed:", error.message);
}
