import express from "express";

const router = express.Router();
import { getNotification } from "../controllers/notification-controller.js";

router.get("/:id", getNotification);

export default router;
