import express from "express";
import { posts } from "./Routers/postsRouter.js";
import { login } from "./Routers/loginRouter.js";
import { admin } from "./Routers/adminRouter.js";
import "dotenv/config";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import jwt from "jsonwebtoken";

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
app.use("/admin", admin);

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];

  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    // Verify the token
    jwt.verify(bearerToken, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        // If verification fails, send 403 Forbidden
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      // If token is valid, attach the user data to the request
      req.user = authData;
      // Next middleware
      next();
    });
  } else {
    // Forbidden
    res.status(403).json({ error: "No token provided" });
  }
}

app.listen(port, () => {
  console.log(`Launched in port: ${port}`);
});

export { verifyToken };
