import { Schema, model, Document, Types } from "mongoose";

interface IContent extends Document {
  title: string;
  link: string;
  type: string;
  userId: Types.ObjectId;
  tags: Types.ObjectId[];
}

const contentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: {
    type: String,
    enum: ["article", "video", "image", "audio"],
    required: true,
  },
  userId: { type: Types.ObjectId, ref: "user", required: true },
  tags: [{ type: Types.ObjectId, ref: "tag" }],
});

const contentModel = model<IContent>("content", contentSchema);
export default contentModel;
