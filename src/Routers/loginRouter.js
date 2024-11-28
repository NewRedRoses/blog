import { Router } from "express";
import { verifyToken } from "../app.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
export const login = Router();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      // compared hashed psswrd to user passwrd in db
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

login.post("/", passport.authenticate("local"));
