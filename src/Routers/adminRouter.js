import { Router } from "express";
import { verifyToken } from "../app.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const admin = Router();

admin.get("/posts/", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.json(403);
    } else {
      const posts = await prisma.post.findMany({});
      res.json(posts);
    }
  });
});
admin.post("/posts/", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.json(403);
    } else {
      await prisma.post.create({
        data: {
          userId: authData.id,
          title: req.body.title,
          content: req.body.content,
        },
      });
      res.json({ message: "Post created successfully" });
    }
  });
});
admin.get("/posts/:postId", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    const post = await prisma.post.findFirst({
      where: {
        id: parseInt(req.params.postId),
      },
    });
    res.json(post);
  });
});
admin.put("/posts/:postId", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.json(403);
    } else {
      try {
        await prisma.post.update({
          where: {
            id: parseInt(req.params.postId),
          },
          data: req.body,
        });
        res.status(200).json({ message: "post updated successfully" });
      } catch (error) {
        console.log(error);
        res.status(400);
      }
    }
  });
});

// Comments
admin.get("/comments/:commentId", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.status(403);
    } else {
      const comments = await prisma.postComments.findMany({
        where: {
          postId: parseInt(req.params.commentId),
        },
        orderBy: {
          date_created: "desc",
        },
        select: {
          id: true,
          text: true,
          date_created: true,
          username: true,
        },
      });
      res.json(comments);
    }
  });
});
admin.delete("/comments/:commentId", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.status(403);
    } else {
    }
    await prisma.postComments.delete({
      where: {
        id: parseInt(req.params.commentId),
      },
    });
    res.json({ message: "comment deleted successfully" });
  });
});
