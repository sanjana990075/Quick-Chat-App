import express from "express";
import {
  getMessages,
  getUsersForSidebar,
  markMessagesAsSeen,
  sendMessage
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

// ORDER MATTERS: specific routes FIRST
router.get("/sidebar", protectRoute, getUsersForSidebar);

router.get("/:id", protectRoute, getMessages);

router.put("/mark-seen/:id", protectRoute, markMessagesAsSeen);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
