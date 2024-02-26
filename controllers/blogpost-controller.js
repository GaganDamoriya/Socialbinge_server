import mongoose from "mongoose";
import User from "../model/Schema.js";
import Blogpost from "../model/blogSchema.js";
//get all blogpost---
export const getallblogs = async (req, res) => {
  let blogs;
  try {
    blogs = await Blogpost.find().sort({ createdAt: -1 });
  } catch (err) {
    res.status(400).send("Internal Service Error");
  }
  if (!blogs) {
    return res.status(404).send({ messagae: "No Blog Post !!" });
  }
  return res.status(200).json({ blogs });
};

//add a blogpost----

export const addBlog = async (req, res) => {
  const { caption, imageUrl, user, location, Hashtag, createdAt } = req.body;
  // const imglink = uploadImage(image);
  let validUser, username, avatar;
  try {
    //check validity of user to post a blog---
    validUser = await User.findById(user);
    if (validUser) {
      username = validUser.username;
      avatar = validUser.avatar;
    } else {
      return res
        .status(400)
        .json({ message: "Can't send because user does not exists" });
    }
  } catch (err) {
    console.log(err);
  }
  try {
    const blog = new Blogpost({
      caption,
      imageUrl,
      location,
      Hashtag,
      createdAt,
      user: { userId: user, username: username, avatar: avatar },
    });

    //session
    const session = await mongoose.startSession();
    session.startTransaction();

    await blog.save({ session });
    validUser.blogs.push(blog);
    await validUser.save({ session });

    await session.commitTransaction();

    res.status(200).json({ blog, message: "Successfully send the post" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ messagae: "Internal Service Error  :  ", err });
  }
};

//delete a blogpost----
export const deleteBlog = async (req, res) => {
  const blogPostId = req.params.id;
  try {
    const deletedBlogPost = await Blogpost.findByIdAndDelete(blogPostId);
    if (deletedBlogPost) {
      const user = await User.findById(deletedBlogPost.user.userId); // Find the user associated with the deleted blog post
      if (user) {
        user.blogs.pull(blogPostId); // Remove the ID of the deleted blog post from the user's blogs array
        await user.save(); // Save the user object to update the blogs array
      }
      res.status(204).end();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBlogById = async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blogpost.findById(id);
    if (!blog) {
      res.status(404).json({ messagae: "No Blog found of the following id" });
    }
    res.status(200).send({ blog });
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSearchBlog = async (req, res) => {
  const query = req.params.query.toString();
  try {
    //find quries
    const blog = await Blogpost.find({
      $or: [
        { "user.username": query },
        { caption: query },
        { location: query },
      ],
    });
    if (!blog) {
      res.status(400).json({ message: "No post found" });
    }
    res.status(200).send({ blog });
  } catch (e) {
    console.log("Error : ", e);
    res.status(500).json({ message: "Internal Service Error" });
  }
};
