import { Schema, model, Document, Types } from "mongoose";

interface Ilink extends Document {
  hash: string;
  userId: Types.ObjectId;
}

const linkSchema = new Schema<Ilink>({
  hash: { type: String, reqired: true },
  userId: { type: Types.ObjectId, ref: "user", required: true },
});
const linkModel = model<Ilink>("link", linkSchema);
export default linkModel;
