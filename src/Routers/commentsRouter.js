import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const comments = Router();

comments.get("/:postId", async (req, res) => {
  const comments = await prisma.postComments.findMany({
    where: {
      postId: parseInt(req.params.postId),
    },
    orderBy: {
      date_created: "desc",
    },
    select: {
      id: true,
      text: true,
      date_created: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  res.json(comments);
});
