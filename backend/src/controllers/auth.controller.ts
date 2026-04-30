import { Request, Response } from "express";
import userModel from "../models/user.model";
import jwt from "jsonwebtoken";
import z from "zod";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

const signUp = async (req: Request, res: Response) => {
  const zodValidationCheck = z.object({
    username: z.string().min(2, { message: "username required" }),
    email: z.string().email({ message: "Incorrect email format" }),
    password: z
      .string()
      .min(6, { message: "password must be at least 6 characters" }),
  });

  const parsedBody = zodValidationCheck.safeParse(req.body);

  if (!parsedBody.success) {
    const tree = z.treeifyError(parsedBody.error);
    return res.status(400).json({ errors: tree });
  }
  const { username, email, password } = parsedBody.data;

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(403).json({
        message: "User already exist",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedpassword,
    });

    return res.status(200).json({
      success: true,
      message: "SignUp successfull",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  const zodValidation = z.object({
    email: z.string().email({ message: "Incorrect email format" }),
    password: z
      .string()
      .min(6, { message: "password must be at least 6 characters" }),
  });

  const parsedBody = zodValidation.safeParse(req.body);

  if (!parsedBody.success) {
    const tree = z.treeifyError(parsedBody.error);
    return res.status(400).json({ errors: tree });
  }

  const { email, password } = parsedBody.data;

  try {
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashed = await bcrypt.compare(password, existingUser.password);

    if (!hashed) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const Token = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.cookie("userToken", Token);

    return res.status(200).json({ message: "Sign in successfull", Token });
  } catch (error) {}
};

const signOut = (req: Request, res: Response) => {
  res.clearCookie("userToken");

  return res.status(200).json({
    success: true,
    message: "Logout successfull",
  });
};

export default { signUp, signIn, signOut };
