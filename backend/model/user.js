import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 8,
    default: "",
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    default: "",
  },
});

export const UserModel = mongoose.model("User", userSchema);
