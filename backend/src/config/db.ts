import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: [
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "src/config/.env"),
  ],
});

async function connectToDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Add it to backend/.env");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}

export default connectToDB;
