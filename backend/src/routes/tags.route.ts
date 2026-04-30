import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import tagsController from "../controllers/tags.controller";
const tagsRouter = Router();

tagsRouter.get("/get", authMiddleware, tagsController.getTags);
tagsRouter.post("/add", authMiddleware, tagsController.addTag);

export default tagsRouter;
