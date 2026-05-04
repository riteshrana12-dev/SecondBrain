import { Request, Response } from "express";
import contentModel from "../models/content.model";
import { resolveTagIds } from "../utils/tags";
import { processEmbedding } from "../services/embeddingService";
import { uploadFile } from "../services/fileService";
const addContent = async (req: Request, res: Response) => {
  try {
    const { title, link, type, tags, notes } = req.body;
    const userId = req.user_id;

    // guard — should never happen if authMiddleware is working
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tagIds = await resolveTagIds(tags);

    let fileUrl = "";
    if (req.file) {
      fileUrl = await uploadFile(req.file, userId); // ← now TypeScript knows userId is defined
    }

    const content = await contentModel.create({
      title,
      link: link || "",
      type,
      notes: notes ?? "",
      fileUrl,
      userId,
      tags: tagIds,
    });

    res.status(200).json({ success: true, content });

    processEmbedding(
      content._id,
      type,
      link || "",
      title,
      notes ?? "",
      fileUrl,
    );
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const getContent = async (req: Request, res: Response) => {
  try {
    const userId = req.user_id;
    const content = await contentModel.find({ userId }).populate("tags");

    if (!content) {
      return res
        .status(404)
        .json({ success: false, message: "No content available" });
    }

    return res.status(200).json({ success: true, content });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user_id;

    const deleted = await contentModel.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found or unauthorized" });
    }

    return res.status(200).json({ success: true, message: "Content deleted" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const updateContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, link, type, tags, notes } = req.body; // ← add notes

    const tagIds = await resolveTagIds(tags);

    const updated = await contentModel.findOneAndUpdate(
      { _id: id, userId: req.user_id },
      { title, link, type, notes, tags: tagIds }, // ← add notes
      { new: true },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Content updated", updated }); // ← respond first

    // re-embed on update since content changed
    processEmbedding(updated._id, type, link, title, notes ?? "");
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

export default { addContent, getContent, deleteContent, updateContent };
