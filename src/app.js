import express from "express";
import { posts } from "./Routers/postsRouter.js";
import "dotenv/config";

const app = express();
const port = process.env.port || 3000;

app.use("/posts", posts);

app.listen(port, () => {
  console.log(`Launched in port: ${port}`);
});
