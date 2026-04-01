import { UserModel } from "../model/user.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const googleAuth = async (req, res) => {
  const { access_token } = req.body;

  try {
    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const data = await googleRes.json();

    if (!googleRes.ok) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid Google token" });
    }

    const { email, name, sub: googleId } = data;

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        username: name,
        email,
        googleId,
        password: null,
      });
    }

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
