import { Request, Response } from "express";
import { chat } from "../services/chatService";

const chatController = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.user_id;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { answer, sources } = await chat(message, userId);

    return res.status(200).json({
      success: true,
      answer,
      sources,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

export default { chatController };
