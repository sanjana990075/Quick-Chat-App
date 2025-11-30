import express from "express";
import { signup, login, updateProfile, checkAuth } from "../controllers/usercontroller.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// protected routes INSIDE router
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
