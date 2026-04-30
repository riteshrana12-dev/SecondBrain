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
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error,
    });
  }
};

export default { getTags };
