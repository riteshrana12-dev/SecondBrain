import authController from "../controllers/auth.controller";
import { Router } from "express";
const authRouter = Router();

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.post("/signout", authController.signOut);

export default authRouter;
