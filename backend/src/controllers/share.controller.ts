import { Request, Response } from "express";
import linkModel from "../models/shareLink.model";
import random from "../utils/hash";
import contentModel from "../models/content.model";

const share = async (req: Request, res: Response) => {
  try {
    const { share } = req.body;
    const userId = req.user_id;

    if (share) {
      const existingLink = await linkModel.findOne({ userId });
      if (existingLink) {
        console.log("link already exist");
        return res.status(200).json({
          success: true,
          message: "Link already exists",
          hash: existingLink.hash,
          share: true,
        });
      }

      const newLink = await linkModel.create({ userId, hash: random(10) });

      return res.status(200).json({
        success: true,
        hash: newLink.hash,
        share: true,
      });
    } else {
      await linkModel.deleteOne({ userId });
      console.log("link deleted");
      return res.status(200).json({
        success: true,
        message: "Link deleted",
        share: false,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getShareStatus = async (req: Request, res: Response) => {
  try {
    const link = await linkModel.findOne({ userId: req.user_id });
    if (link) {
      return res.status(200).json({ share: true, hash: link.hash });
    }
    return res.status(400).json({ share: false });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const shareLink = async (req: Request, res: Response) => {
  try {
    const { shareLink } = req.params;

    const link = await linkModel
      .findOne({ hash: shareLink })
      .populate("userId", "username");

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    const content = await contentModel
      .find({ userId: link.userId._id })
      .populate("tags");

    return res.status(200).json({
      success: true,
      username: (link.userId as any).username,
      content,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export default { share, getShareStatus, shareLink };
