import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user_id?: Types.ObjectId;
    }
  }
}
