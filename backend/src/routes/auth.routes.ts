import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User";

const router = Router();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const signToken = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
};

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    const token = signToken(user.id);

    return res.status(201).json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }

    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user.id);

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }

    return next(error);
  }
});

export default router;
