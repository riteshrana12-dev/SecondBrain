import { Router } from "express";
import shareController from "../controllers/share.controller";
import authMiddleware from "../middleware/auth.middleware";
const shareRouter = Router();

shareRouter.post("/share", authMiddleware, shareController.share);
shareRouter.get("/:shareLink", shareController.shareLink);

export default shareRouter;
