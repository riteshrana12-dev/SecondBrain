import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import contentRouter from "./routes/content.route";
import tagsRouter from "./routes/tags.route";
import shareRouter from "./routes/share.route";
import searchRouter from "./routes/search.route";
import chatRouter from "./routes/chat.route";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/tags", tagsRouter);
app.use("/api/v1/brain", shareRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/chat", chatRouter);

export default app;
