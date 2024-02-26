import User from "../model/Schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Blogpost from "../model/blogSchema.js";
import Notification from "../model/Notification.js";

//-------------------
//                                  |
// REGISTER USER ------------------\'/
//                                  '
//
//--------------------

export const registeruser = async (req, res) => {
  const { username, email, password } = req.body;
  const alreadtExist = await User.findOne({ email: email });
  if (alreadtExist) {
    return res.status(400).send("User already exists");
  }
  try {
    // Hash the password

    const hashedPassword = await bcrypt.hash(password, 10);
    const createDate = new Date();

    const user = new User({
      username,
      email,
      password: hashedPassword,
      blogs: [],
      avatar: "",
      follower: [],
      following: [],
      like: [],
      backImage: "",
      fullName: "",
      bio: "",
      createdAt: createDate,
      notifications: [],
    });

    await user.save();

    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Service error" });
  }
};
//-------------------
//                                  |
// SIGN IN USER -------------------\'/
//                                  '
//
//--------------------
export const siginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("Invalid username");

    //compare password
    const validPassword = await bcrypt.compare(password, user.password); // Await the result
    if (!validPassword)
      return res.status(400).send("Invalid username or password");

    //jwt
    const token = jwt.sign({ userId: user.id }, "your-secret-key");
    res
      .status(201)
      .send({ message: "Sign-in successful", token, userId: user.id });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};
//-------------------
//                                  |
// GET ALL USER -------------------\'/
//                                  '
//
//--------------------

export const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) {
      return res.status(404).send("No user found !");
    }
    res.status(200).send({ allUsers });
  } catch (e) {
    console.log("error :", e);
  }
};
//-------------------
//                                  |
// GET USER BY ID -----------------\'/
//                                  '
//
//--------------------

export const getUserbyId = async (req, res) => {
  const id = req.params.id;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidObjectId) {
      return res.status(400).send("Invalid user ID format");
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send({ user });
  } catch (err) {
    console.log("error : ", err);
    res.status(500).send("Internal service Error");
  }
};

//-------------------
//                                  |
// SAVE BLOG POST -----------------\'/
//                                  '
//
//--------------------

export const saveBlogpost = async (req, res) => {
  try {
    const { BlogId, userId } = req.body;
    const user = await User.findById(userId);
    const Blog = await Blogpost.findById(BlogId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const senderId = Blog.user.userId;
    const username = user.username;
    const avatar = user.avatar;

    const senderOfBlog = await User.findById(senderId);

    // Convert BlogId to ObjectId
    const blogObjectId = new mongoose.Types.ObjectId(BlogId);
    // Check if the blog post is already bookmarked by the user
    const isExistBlog = user.bookMarks.some((id) => id.equals(blogObjectId));

    if (isExistBlog) {
      // If the blog post is already bookmarked, remove it
      user.bookMarks = user.bookMarks.filter((id) => !id.equals(blogObjectId));
    } else {
      // If the blog post is not bookmarked, add it
      user.bookMarks.push(blogObjectId);

      const notify = new Notification({
        type: "bookMark",
        postId: BlogId,
        senderdetail: {
          id: userId,
          username: username,
          avatar: avatar,
        },
      });
      senderOfBlog.notifications.push(notify);
      await notify.save();
    }
    // Save the blog post ID to the user's bookmarks
    await user.save();
    await senderOfBlog.save();

    return res.status(201).json({ message: "Blog post saved successfully" });
  } catch (error) {
    console.error("Error saving blog post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
//-------------------
//                                  |
// LIKED PROFILE ------------------\'/
//                                  '
//
//--------------------

export const likePost = async (req, res) => {
  try {
    const { userId, BlogId, senderId } = req.body;
    // console.log(userId, BlogId);
    const user = await User.findById(userId);
    const senduser = await User.findById(senderId);
    const Blog = await Blogpost.findById(BlogId);

    if (!user || !senduser || !Blog) {
      return res.status(404).json({ error: "User not found" });
    }
    const sendUserUsername = user.username;
    const sendUserAvatar = user.avatar;

    // Convert BlogId to ObjectId
    const blogObjectId = new mongoose.Types.ObjectId(BlogId);
    const userobjectId = new mongoose.Types.ObjectId(userId);
    // Check if the blog post is already bookmarked by the user
    const isExistBlog = user.like.some((id) => id.equals(blogObjectId));

    console.log(isExistBlog);

    if (isExistBlog) {
      // If the blog post is already liked, remove it
      user.like = user.like.filter((id) => !id.equals(blogObjectId));
      Blog.likes = Blog.likes.filter((id) => !id.equals(userId));
    } else {
      // If the blog post is not liked, like it
      user.like.push(blogObjectId);
      Blog.likes.push(userobjectId);

      const notify = new Notification({
        type: "like",
        postId: BlogId,
        senderdetail: {
          id: userId,
          username: sendUserUsername,
          avatar: sendUserAvatar,
        },
      });
      senduser.notifications.push(notify);
      await notify.save();
    }
    await senduser.save();
    await user.save();
    await Blog.save();
  } catch (err) {
    console.error("Error saving blog post:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
//-------------------
//                                  |
// UPDATE PROFILE -----------------\'/
//                                  '
//
//--------------------

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { avatar, fullName, bio } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for updated fields and update only those fields
    if (fullName !== undefined && fullName !== user.fullName) {
      user.fullName = fullName;
    }
    if (bio !== undefined && bio !== user.bio) {
      user.bio = bio;
    }
    if (avatar !== undefined && avatar !== user.avatar) {
      user.avatar = avatar;
    }
    // Repeat this for other fields...

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//-------------------
//                                  |
// FOLLOW USER --------------------\'/
//                                  '
//
//--------------------

export const followUser = async (req, res) => {
  try {
    const { userId, followId } = req.body;
    const user = await User.findById(userId);
    const userTofollow = await User.findById(followId);

    if (!user || !userTofollow) {
      return res.status(404).json({ error: "User not found" });
    }
    const userobjectId = new mongoose.Types.ObjectId(userId);
    const tofollowId = new mongoose.Types.ObjectId(followId);

    const sendUserUsername = user.username;
    const sendUserAvatar = user.avatar;

    const ispresent = user.follower.some((id) => id.equals(userobjectId));

    if (ispresent) {
      user.following = user.following.filter((id) => !id.equals(tofollowId));
      userTofollow.follower = userTofollow.follower.filter(
        (id) => !id.equals(userobjectId)
      );
    } else {
      user.following.push(tofollowId);
      userTofollow.follower.push(userobjectId);

      const notify = new Notification({
        type: "follow",
        postId: followId,
        senderdetail: {
          id: userId,
          username: sendUserUsername,
          avatar: sendUserAvatar,
        },
      });
      userTofollow.notifications.push(notify);
      await notify.save();
    }
    await user.save();
    await userTofollow.save();
    res.status(200).send("followed success");
  } catch (err) {
    console.error("Error saving blog post:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
