import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const comments = Router();

comments.get("", async (req, res) => {
  const comments = await prisma.postComments.findMany({
    where: {
      postId: parseInt(req.params.postId),
    },
  });
  res.json(comments);
});
