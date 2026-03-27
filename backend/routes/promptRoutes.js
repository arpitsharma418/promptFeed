// Prompt Routes
const express = require("express");
const router = express.Router();
const {
  getPrompts,
  getPromptStats,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  likePrompt,
  usePrompt,
  getMyPrompts,
} = require("../controllers/promptController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getPrompts);
router.get("/stats/overview", getPromptStats);
router.get("/:id", getPromptById);
router.put("/:id/use", usePrompt);

// Protected routes (require login)
router.get("/user/my-prompts", protect, getMyPrompts);
router.post("/", protect, createPrompt);
router.put("/:id", protect, updatePrompt);
router.delete("/:id", protect, deletePrompt);
router.put("/:id/like", protect, likePrompt);

module.exports = router;
