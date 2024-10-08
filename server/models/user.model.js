import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vlog",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
