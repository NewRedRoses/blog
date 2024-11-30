import { Router } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../app.js";
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

posts.post("/", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
      if (err) {
        res.sendStatus(403); // code may need to change
      } else {
        const { title, content, userId } = req.body;

        await prisma.post.create({
          data: {
            title,
            content,
            userId: parseInt(userId),
          },
        });
        console.log(authData);
        res.redirect("/posts");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// /Post/:postId

posts.get("/:postId", async (req, res) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: parseInt(req.params.postId),
      },
    });
    if (post === null) {
      return res.status(404).json({ error: 404, message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.log(error);
  }
});

posts.put("/:postId", (req, res) => {
  res.json({
    message: "update the post's content",
    postId: req.params.postId,
  });
});
// Unpublish post
posts.delete("/:postId", verifyToken, (req, res) => {
  try {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
      if (err) {
        res.status(403);
      } else {
        await prisma.post.update({
          where: {
            id: parseInt(req.params.postId),
          },
          data: {
            date_published: null,
          },
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

// /Posts/:postId/comments

posts.post("/:postId/comments", async (req, res) => {
  try {
    await prisma.postComments.create({
      data: {
        text: req.body.text,
        userId: parseInt(req.body.userId),
        postId: parseInt(req.params.postId),
      },
    });
    res.status(200).json({ message: "comment added successfully" });
  } catch (error) {
    console.log(error);
  }
});

// /Posts/:postId/comments/:commentId

posts.delete("/:postId/comments/:commentId", async (req, res) => {
  try {
    await prisma.postComments.delete({
      where: {
        id: parseInt(req.params.commentId),
      },
    });
    res.status(200).json({ message: "comment deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});
