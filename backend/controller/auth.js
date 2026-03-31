import { UserModel } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { sendMail } from "../utils/sendmail.js";

config();

const SECRET_KEY = process.env.SECRET_KEY;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const decryptedPass = await bcrypt.compare(password, user.password);

    if (!decryptedPass) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    return res.status(200).send({
      success: true,
      message: "success",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      success: false,
      error: err.message,
    });
  }
};

export const sendmailer = async (req, res) => {
  const { email, subject, text } = req.body;

  try {
    const response = await sendMail(email, subject, text);
    return res.status(200).send({
      success: true,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};
