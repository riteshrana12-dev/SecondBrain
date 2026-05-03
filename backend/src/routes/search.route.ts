import { Router } from "express";
import searchController from "../controllers/search.controller";
import authMiddleware from "../middleware/auth.middleware";
const searchRouter = Router();

searchRouter.get("/", authMiddleware, searchController.searchContent);

export default searchRouter;
