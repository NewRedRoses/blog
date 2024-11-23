import { Router } from "express";
export const posts = Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//  /Posts

posts.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        NOT: {
          date_published: null,
        },
      },
      select: {
        id: true,
        title: true,
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

posts.post("/", async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    await prisma.post.create({
      data: {
        title,
        content,
        userId: parseInt(userId),
      },
    });
    res.redirect("/posts");
  } catch (error) {
    console.log(error);
  }
});

// /Post/:postId

posts.get("/:postId", (req, res) => {
  res.json({
    message: "retrieves specific post from id",
    postId: req.params.postId,
  });
});

posts.put("/:postId", (req, res) => {
  res.json({
    message: "update the post's content",
    postId: req.params.postId,
  });
});

posts.delete("/:postId", (req, res) => {
  res.json({
    message: "delete the post",
    postId: req.params.postId,
  });
});

// /Posts/:postId/comments

posts.post("/:postId/comments", (req, res) => {
  res.json({
    message: "Creates new comment on post",
    postId: req.params.postId,
  });
});

// /Posts/:postId/comments/:commentId

posts.delete("/:postId/comments/:commentId", (req, res) => {
  res.json({
    message: "Deletes the new comment on post",
    commentId: req.params.commentId,
    postId: req.params.postId,
  });
});
