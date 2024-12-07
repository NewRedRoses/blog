import { Router } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../app.js";
import apicache from "apicache";
export const posts = Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const cache = apicache.options({ debug: true }).middleware;

//  /Posts

posts.get("/", cache("3 minutes"), async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        date_published: "desc",
      },
      where: {
        NOT: {
          date_published: null,
        },
      },
      select: {
        id: true,
        title: true,
        date_published: true,
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

posts.get("/:postId", cache("3 minutes"), async (req, res) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: parseInt(req.params.postId),
      },
      select: {
        title: true,
        date_published: true,
        content: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (post === null) {
      return res.status(404).json({ error: 404, message: "Post not found" });
    }
    if (post.date_published != null) {
      res.json(post);
    } else {
      error404(res);
    }
  } catch (error) {
    console.log(error);
  }
});

/* Error code explanations for front-end comms
      0 : error
      1 : published successfully
      2 : unpublished successfully

  */

posts.patch("/:postId", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    const publish = parseBoolean(req.query.publish);

    if (publish) {
      try {
        await prisma.post.update({
          where: {
            id: parseInt(req.params.postId),
          },
          data: {
            date_published: req.body.date_published,
          },
        });
        return res.json({
          code: 1,
          message: "Post was successfully published",
        });
      } catch (error) {
        console.log("ERROR: Unable to update post status", error);
        return res
          .status(400)
          .json({ code: 0, error: "Post was unable to be published" });
      }
    } else if (publish == false) {
      try {
        await prisma.post.update({
          where: {
            id: parseInt(req.params.postId),
          },
          data: {
            date_published: null,
          },
        });
        return res.json({ code: 2, message: "Post successfully unpublished" });
      } catch (error) {
        console.log("ERROR: Unable to update post status", error);
        return res
          .status(400)
          .json({ code: 0, error: "Post was unable to be unpublished" });
      }
    }
    res.json({ message: "no partial changes made to post" });
  });
});

// /Posts/:postId/comments

posts.get("/:postId/comments", cache("3 minutes"), async (req, res) => {
  const comments = await prisma.postComments.findMany({
    orderBy: {
      date_created: "desc",
    },
    where: {
      postId: parseInt(req.params.postId),
    },
    select: {
      id: true,
      text: true,
      username: true,
      date_created: true,
    },
  });
  res.json(comments);
});

posts.post("/:postId/comments", async (req, res) => {
  try {
    await prisma.postComments.create({
      data: {
        text: req.body.message,
        username: req.body.username,
        postId: parseInt(req.params.postId),
      },
    });
    res.status(200).json({ message: "comment added successfully" });
  } catch (error) {
    console.log(error);
  }
});

// /Posts/:postId/comments/:commentId

posts.delete("/:postId/comments/:commentId", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
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
});

function error404(res) {
  return res.status(404).json({
    title: "404 - Missing or Unpublished page",
    content: "You don't have the right, O you don't have the right...",
  });
}
function parseBoolean(booleanString) {
  return booleanString === "true"
    ? true
    : booleanString === "false"
    ? false
    : undefined;
}
