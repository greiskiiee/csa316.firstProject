import { UserModel } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { sendMail } from "../utils/sendmail.js";
import { OTP } from "../model/otp.js";
import otpGenerator from "otp-generator";

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
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" } // 1 hour
    );

    return res.status(200).send({
      success: true,
      message: "success",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ success: false, error: err });
  }
};

export const sendmailer = async (req, res) => {
  const { email, subject, text } = req.body;
  try {
    const response = await sendMail(email, subject, text);
    res.status(200).send({ success: true, data: response });
  } catch (err) {
    res.status(500).send({ success: false, error: err });
  }
};

export const otpgenerate = async (req, res) => {
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

    res.status(200).send({ success: true, otp, data: response });
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
      return res.status(200).send("OTP verified successfully");
    } else {
      return res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying OTP");
  }
};
