import { Request, Response } from "express";
import tagModel from "../models/tag.model";

const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await tagModel.find();
    if (!tags) {
      return res.status(404).json({
        success: false,
        message: "no tags are available",
      });
    }

    return res.status(200).json({
      success: true,
      tags,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const addTag = async (req: Request, res: Response) => {
  try {
    const { tag } = req.body;
    if (!tag) {
      await tagModel.create({ tag });
    }

    return res.status(200).json({
      success: true,
      tag,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export default { getTags, addTag };
