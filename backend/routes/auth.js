import express from "express";
import { login, sendmailer } from "../controller/auth.js";

export const authRouter = express.Router();

authRouter.post("/", login).post("/mail", sendmailer);
