import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

interface JwtDecoded extends JwtPayload {
  id: Types.ObjectId;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token; // ← matches cookie name set in auth.controller.ts

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtDecoded;
    req.user_id = decoded.id;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
