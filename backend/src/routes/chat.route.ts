import { Router } from "express";
import chatController from "../controllers/chat.controller";
import authMiddleware from "../middleware/auth.middleware";
const chatRouter = Router();

chatRouter.post("/", authMiddleware, chatController.chatController);

export default chatRouter;
