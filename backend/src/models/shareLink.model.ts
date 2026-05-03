import { Schema, model, Document, Types } from "mongoose";

interface Ilink extends Document {
  hash: string;
  userId: Types.ObjectId;
}

const linkSchema = new Schema<Ilink>({
  hash: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: "user", required: true, unique: true },
});

const linkModel = model<Ilink>("link", linkSchema);
export default linkModel;
