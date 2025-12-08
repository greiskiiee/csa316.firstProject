import express from "express";
import {
  login,
  otpgenerate,
  sendmailer,
  verifyOtp,
} from "../controller/auth.js";

export const authRouter = express.Router();

authRouter
  .post("/", login)
  .post("/mail", sendmailer)
  .post("/otp", otpgenerate)
  .post("/verify-otp", verifyOtp);
