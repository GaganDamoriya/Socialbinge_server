import mongoose from "mongoose";

const hashSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  avatar: {
    type: String,
  },
});

const Hashtag = mongoose.model("hashtag", hashSchema);

export default Hashtag;
