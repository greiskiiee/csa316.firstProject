import { OAuth2Client } from "google-auth-library";
import { UserModel } from "../model/user.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { credential } = req.body; // Google token from frontend

  try {
    // 1. Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub: googleId } = ticket.getPayload();

    // 2. Find or create the user
    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        username: name,
        email,
        googleId, // add this field to your UserModel
        password: null, // no password for Google users
      });
    }

    // 3. Return your normal JWT — frontend handles it the same way
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
    );

    return res.status(200).send({ success: true, token });
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .send({ success: false, message: "Google auth failed" });
  }
};
