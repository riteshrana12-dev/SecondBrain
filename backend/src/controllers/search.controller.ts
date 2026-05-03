import { Request, Response } from "express";
import contentModel from "../models/content.model";
import { getEmbedding } from "../services/embeddingService";

import { Types } from "mongoose"; // ← add this import

const searchContent = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const userId = req.user_id;

    if (!query || typeof query !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "query param is required" });
    }

    const queryEmbedding = await getEmbedding(query);

    console.log("Searching for userId:", userId);
    console.log("Query embedding length:", queryEmbedding.length);

    const results = await contentModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 10,
          filter: {
            userId: new Types.ObjectId(userId),
          },
        },
      },
      // ← add this $lookup stage
      {
        $lookup: {
          from: "tags", // MongoDB collection name
          localField: "tags", // field in content document
          foreignField: "_id", // field in tags collection
          as: "tags", // overwrite tags array with populated data
        },
      },
      {
        $project: {
          title: 1,
          link: 1,
          type: 1,
          notes: 1,
          tags: 1,
          isEmbedded: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    return res
      .status(200)
      .json({ success: true, count: results.length, results });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

export default { searchContent };
