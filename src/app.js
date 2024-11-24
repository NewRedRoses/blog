import express from "express";
import { posts } from "./Routers/postsRouter.js";
import "dotenv/config";
import cors from "cors";

const app = express();
const port = process.env.port || 3000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/posts", posts);

app.listen(port, () => {
  console.log(`Launched in port: ${port}`);
});
