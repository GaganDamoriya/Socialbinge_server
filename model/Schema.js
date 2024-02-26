import mongoose from "mongoose";
import Notification from "./Notification.js";
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  blogs: [{ type: mongoose.Types.ObjectId, ref: "Blogpost", required: true }],
  bookMarks: [{ type: mongoose.Types.ObjectId, ref: "Blogpost" }],
  avatar: String,
  follower: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  like: [{ type: mongoose.Types.ObjectId, ref: "Blogpost" }],
  backImage: String,
  fullName: String,
  bio: String,
  createdAt: Date,
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
