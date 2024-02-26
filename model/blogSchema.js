import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  Hashtag: {
    type: [String],
  },
  createdAt: {
    type: Date,
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  user: {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
});
const Blogpost = mongoose.model("Blogpost", blogSchema);

export default Blogpost;
