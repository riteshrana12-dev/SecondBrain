import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import contentController from "../controllers/content.controller";

const contentRouter = Router();

contentRouter.post("/add", authMiddleware, contentController.addContent);
contentRouter.post("/delete", authMiddleware, contentController.deleteContent);
contentRouter.post(
  "/:contentId",
  authMiddleware,
  contentController.updateContent,
);
export default contentRouter;
