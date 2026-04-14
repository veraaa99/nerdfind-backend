import express from "express";
import {
  registerUser,
  getUsers,
  loginUser,
  getUserById,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verification.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", getUsers);
router.get("/:id", verifyToken, getUserById);

export default router;
