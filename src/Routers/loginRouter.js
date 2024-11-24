import { Router } from "express";
import { verifyToken } from "../app.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const login = Router();

// Protected route /Login (requires the token)

login.get("/", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "login succeeded...",
        authData,
      });
    }
  });
});

// Generates the token

login.post("/", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: 1,
      admin: {
        equals: true,
      },
    },
  });

  jwt.sign({ user }, process.env.SECRET_KEY, (err, token) => {
    if (err) {
      res.sendStatus(500).json({ message: "some kind of error" });
    }
    res.json({
      message: "login attempt made",
      token,
    });
  });
});
