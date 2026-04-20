import express from "express";
import { validate } from "../middleware/authMiddleware.js";
import {
  getPrompts,
  getPromptStats,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  likePrompt,
  usePrompt,
  getMyPrompts,
} from "../controllers/promptController.js";

const router = express.Router();

router.get("/", getPrompts);
router.get("/stats/overview", getPromptStats);
router.get("/:id", getPromptById);
router.put("/:id/use", usePrompt);
router.get("/user/my-prompts", validate, getMyPrompts);
router.post("/", validate, createPrompt);
router.put("/:id", validate, updatePrompt);
router.delete("/:id", validate, deletePrompt);
router.put("/:id/like", validate, likePrompt);

export default router;
