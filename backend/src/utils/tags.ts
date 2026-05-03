// src/utils/tags.ts
import { Types } from "mongoose";
import tagModel from "../models/tag.model";

export async function resolveTagIds(tags: string[]): Promise<Types.ObjectId[]> {
  const tagIds: Types.ObjectId[] = [];

  for (let tag of tags) {
    if (Types.ObjectId.isValid(tag)) {
      tagIds.push(new Types.ObjectId(tag));
    } else {
      let existing = await tagModel.findOne({ tag });
      if (!existing) existing = await tagModel.create({ tag });
      tagIds.push(existing._id);
    }
  }

  return tagIds;
}
