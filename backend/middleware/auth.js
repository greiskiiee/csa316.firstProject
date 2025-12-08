import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();
const SECRET_KEY = process.env.SECRET_KEY;

export const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header)
      res.send({
        success: false,
        message: "token not found",
      });
    const token = header.split(" ")[1];

    const decode = jwt.verify(token, SECRET_KEY);
    if (!decode._doc._id) {
      res.status(401).send({ success: false, message: "unauthorized" });
    }
    console.log(decode, "decode");
    next();
  } catch (error) {
    console.error(error);
    res.send({ error: error });
  }
};
