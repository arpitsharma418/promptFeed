import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import { validate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", validate, getMe);
router.put("/profile", validate, updateProfile);

export default router;