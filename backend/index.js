import express, { json } from "express";
import cors from "cors";
import { userRouter } from "./routes/user.js";
import { config } from "dotenv";
import { connectMongoDB } from "./connectDB.js";
import { authRouter } from "./routes/auth.js";

config();
const app = express();
const PORT = process.env.PORT;

connectMongoDB();

app.use(cors());
app.use(json());

app.use("/user", userRouter);
app.use("/login", authRouter);
app.use("/", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
