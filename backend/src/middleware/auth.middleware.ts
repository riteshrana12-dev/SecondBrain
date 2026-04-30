import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
dotenv.config({ path: "./config/.env" });

interface jwt extends JwtPayload {
  id: Types.ObjectId;
}
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const Token = req.cookies?.userToken;
  if (!Token) {
    return res.status(403).json({
      success: false,
      message: "Incorrect Creddentials",
    });
  }

  try {
    const decoded = jwt.verify(Token, process.env.JWT_SECRET!) as jwt;
    req.user_id = decoded.id;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authentication failed retry",
    });
  }
};

export default authMiddleware;
