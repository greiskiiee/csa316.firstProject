import bcrypt from "bcrypt";
import { UserModel } from "../model/user.js";

export const createUser = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);
  console.log(password, hashedPass);

  try {
    const oldUser = await UserModel.find({ email: email });
    if (oldUser.length > 0) {
      return res
        .status(400)
        .send({ success: false, messsage: "email already taken" })
        .end();
    }

    const user = await UserModel.create({
      username: username,
      email: email,
      password: hashedPass,
      phoneNumber: phoneNumber,
    });

    return res.status(200).send({ success: true, user: user }).end();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error }).end();
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).send({ success: true, users: users }).end();
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error: error }).end();
  }
};

export const getUser = async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await UserModel.findById(_id);
    res.status(200).send({ success: true, user: user }).end();
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error: error }).end();
  }
};

export const updateUser = async (req, res) => {
  const { _id } = req.params; // Get userId from request params or body
  const { username, email, phoneNumber, password } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      _id, // Find user by ID
      { username, email, phoneNumber, password }, // The data to update
      { new: true, runValidators: true } // Ensure the new document is returned and validators are applied
    );

    if (!updatedUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error: error }).end();
  }
};
