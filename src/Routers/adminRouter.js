import { Router } from "express";
import { verifyToken } from "../app.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const admin = Router();

admin.get("/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.json(403);
    } else {
      const posts = await prisma.post.findMany({});
      res.json(posts);
    }
  });
});
