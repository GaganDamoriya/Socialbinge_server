import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["like", "bookMark", "follow"],
    required: true,
  },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Blogpost" }, // Reference to the Blogpost model
  senderdetail: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
    },
    avatar: {
      type: String,
    },
  }, // Reference to the User model
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
