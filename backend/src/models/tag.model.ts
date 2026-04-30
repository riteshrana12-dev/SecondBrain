import { Schema, model, Document } from "mongoose";

interface ITag extends Document {
  tag: string;
}

const tagSchema = new Schema<ITag>({
  tag: { type: String, required: true, unique: true },
});

const tagModel = model<ITag>("tag", tagSchema);
export default tagModel;
