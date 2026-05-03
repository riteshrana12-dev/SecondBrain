import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import contentController from "../controllers/content.controller";
import upload from "../middleware/upload.middleware";
const contentRouter = Router();

contentRouter.post(
  "/add",
  authMiddleware,
  upload.single("file"),
  contentController.addContent,
);
contentRouter.delete("/:id", authMiddleware, contentController.deleteContent);
contentRouter.get("/get", authMiddleware, contentController.getContent);
contentRouter.put("/:id", authMiddleware, contentController.updateContent);
export default contentRouter;
