import { Schema, model, Document, Types } from "mongoose";

interface IContent extends Document {
  title: string;
  link?: string;
  type: string;
  notes: string;
  fileUrl?: string;
  extractedText?: string;
  embedding?: number[];
  isEmbedded?: boolean;
  userId: Types.ObjectId;
  tags: Types.ObjectId[];
}

const contentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  link: { type: String },
  type: {
    type: String,
    enum: ["document", "youtube", "tweet", "link", "post"],
    required: true,
  },
  notes: { type: String, dafault: "" },
  fileUrl: { type: String, default: "" },
  extractedText: { type: String, default: "" },
  embedding: { type: [Number], default: [] },
  isEmbedded: { type: Boolean, default: false },
  userId: { type: Types.ObjectId, ref: "user", required: true },
  tags: [{ type: Types.ObjectId, ref: "tag" }],
});

const contentModel = model<IContent>("content", contentSchema);
export default contentModel;
