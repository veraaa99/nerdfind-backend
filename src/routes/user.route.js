import express from "express";
import {
  registerUser,
  getUsers,
  loginUser,
  getUserById,
  checkToken,
  getUserProfile,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verification.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", getUsers);
router.get("/profile", verifyToken, getUserProfile);
router.get("/check", verifyToken, checkToken);
router.get("/:id", verifyToken, getUserById);

export default router;
