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
    minLength: 8,
    maxLength: 8,
    default: "",
  },
  password: {
    type: String,
    minLength: 8,
    default: null,
  },
  googleId: { type: String, default: null },
});

export const UserModel = mongoose.model("User", userSchema);
