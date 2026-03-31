import express from "express";
import { login, sendmailer } from "../controller/auth.js";
import { googleAuth } from "../controller/googleAuth.js";

export const authRouter = express.Router();

authRouter
  .post("/", login)
  .post("/mail", sendmailer)
  .post("/auth/google", googleAuth);
