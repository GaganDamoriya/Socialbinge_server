import express from "express";
const router = express.Router();

import {
  registeruser,
  siginUser,
  getAllUser,
  getUserbyId,
  saveBlogpost,
  likePost,
  updateUserProfile,
  followUser,
} from "../controllers/user-controller.js";
router.get("/", getAllUser);
router.post("/register", registeruser);
router.post("/signin", siginUser);
router.get("/:id", getUserbyId);
router.post("/save/:id", saveBlogpost);
router.post("/like/:id", likePost);
router.patch("/update/:id", updateUserProfile);
router.post("/follow/:id", followUser);

export default router;
