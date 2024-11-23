import { Router } from "express";
export const posts = Router();

//  /Posts
posts.get("/", (req, res) => {
  res.json({
    message: "retrieves all posts",
  });
});

posts.post("/", (req, res) => {
  res.json({
    message: "creates new post",
  });
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
