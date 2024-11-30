import { Router } from "express";
export const admin = Router();

admin.get("/posts", (req, res) => {
  res.json({ msg: "get all posts" });
});
