import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
} from "../controller/user.js";

export const userRouter = express.Router();

userRouter
  .post("/", createUser)
  .get("/", getUsers)
  .put("/:_id", updateUser)
  .get("/:_id", getUser);
