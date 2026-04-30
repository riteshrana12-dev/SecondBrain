import { Request, Response } from "express";
import contentModel from "../models/content.model";
import tagModel from "../models/tag.model";
import { Types } from "mongoose";

const addContent = async (req: Request, res: Response) => {
  try {
    const { title, link, type, tags } = req.body;
    const userId = req.user_id;

    let tagIds: Types.ObjectId[] = [];
    for (let tag of tags) {
      if (Types.ObjectId.isValid(tag)) {
        // selected tag from frontedn
        tagIds.push(new Types.ObjectId(tag));
      } else {
        // new tag created
        let existing = await tagModel.findOne({ tag });
        if (!existing) {
          existing = await tagModel.create({ tag });
        }
        tagIds.push(existing._id);
      }
    }

    const Content = await contentModel.create({
      title,
      link,
      type,
      userId,
      tags: tagIds,
    });

    return res.status(200).json({
      success: true,
      Content,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error,
    });
  }
};

const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user_id;

    await contentModel.findByIdAndDelete({ id, userId });

    return res.status(200).json({
      success: true,
      message: "Content deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error,
    });
  }
};

export default { addContent, deleteContent };
