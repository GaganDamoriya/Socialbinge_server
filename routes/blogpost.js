import express from "express";
import {
  addBlog,
  deleteBlog,
  getallblogs,
  getBlogById,
  getSearchBlog,
} from "../controllers/blogpost-controller.js";
const blogRouter = express.Router();

blogRouter.get("/", getallblogs);
blogRouter.post("/addBlog", addBlog);
blogRouter.get("/:id", getBlogById);
blogRouter.delete("/delete/:id", deleteBlog);
blogRouter.get("/search/:query", getSearchBlog);

export default blogRouter;
