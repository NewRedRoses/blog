import express from "express";
import { posts } from "./Routers/postsRouter.js";
import { login } from "./Routers/loginRouter.js";
import "dotenv/config";
import cors from "cors";
import session from "express-session";
import passport from "passport";

const app = express();
const port = process.env.port || 3000;
app.use(cors());

app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use("/posts", posts);
app.use("/login", login);

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(port, () => {
  console.log(`Launched in port: ${port}`);
});

export { verifyToken };
