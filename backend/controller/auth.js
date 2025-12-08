import { UserModel } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { sendMail } from "../utils/sendmail.js";
import { OTP } from "../model/otp.js";

const otpGenerator = require("otp-generator");

config();

const SECRET_KEY = process.env.SECRET_KEY;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    const decryptedPass = await bcrypt.compare(password, user.password);
    if (!decryptedPass) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid email or password" })
        .end();
    }

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid email or password" })
        .end();
    }

    const token = jwt.sign({ ...user }, SECRET_KEY, { expiresIn: 60 * 1000 });

    return res
      .status(200)
      .send({ success: true, message: "success", token })
      .end();
  } catch (err) {
    console.error(err);
    return res.status(400).send({ success: false, error: err }).end();
  }
};

export const sendmailer = async (req, res) => {
  const { email, subject, text } = req.body;
  try {
    const response = await sendMail(email, subject, text);
    res.status(200).send({ succes: true, data: response }).end();
  } catch (err) {
    res.status(500).send({ succes: false, error: err }).end();
  }
};

export const otpgenerate = async () => {
  const { email } = req.body;

  const otp = otpGenerator.generate(4, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  try {
    await OTP.create({ email, otp });
    const response = await sendMail(
      email,
      "OTP Verification",
      `Your OTP for verification is: ${otp}`
    );
    res.status(200).send({ succes: true, data: response }).end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending OTP");
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp }).exec();

    if (otpRecord) {
      res.status(200).send("OTP verified successfully");
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying OTP");
  }
};
