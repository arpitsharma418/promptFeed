// Prompt Controller - handles all prompt CRUD operations
const Prompt = require("../models/Prompt");
const User = require("../models/User");

// @desc    Get all prompts (with optional search/filter)
// @route   GET /api/prompts
// @access  Public
const getPrompts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    // Build filter object
    let filter = {};

    if (search) {
      // Search in title, content, and tags
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === "popular") sortOption = { likes: -1 };
    if (sort === "most-used") sortOption = { usageCount: -1 };

    const prompts = await Prompt.find(filter)
      .sort(sortOption)
      .populate("author", "username email") // Get author's username
      .limit(50); // Limit to 50 prompts at a time

    res.json(prompts);
  } catch (error) {
    console.error("Get prompts error:", error.message);
    res.status(500).json({ message: "Error fetching prompts" });
  }
};

// @desc    Get public overview stats
// @route   GET /api/prompts/stats/overview
// @access  Public
const getPromptStats = async (req, res) => {
  try {
    const [promptCount, userCount, categories] = await Promise.all([
      Prompt.countDocuments(),
      User.countDocuments(),
      Prompt.distinct("category"),
    ]);

    res.json({
      promptsShared: promptCount,
      categories: categories.filter(Boolean).length,
      users: userCount,
    });
  } catch (error) {
    console.error("Get prompt stats error:", error.message);
    res.status(500).json({ message: "Error fetching prompt stats" });
  }
};

// @desc    Get a single prompt by ID
// @route   GET /api/prompts/:id
// @access  Public
const getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id).populate(
      "author",
      "username bio"
    );

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prompt" });
  }
};

// @desc    Create a new prompt
// @route   POST /api/prompts
// @access  Private (requires login)
const createPrompt = async (req, res) => {
  const { title, content, description, category, tags } = req.body;

  // Basic validation
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    // Process tags - split by comma if string
    let processedTags = [];
    if (tags) {
      processedTags =
        typeof tags === "string"
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : tags;
    }

    const prompt = await Prompt.create({
      title,
      content,
      description,
      category: category || "Other",
      tags: processedTags,
      author: req.user._id, // req.user is set by protect middleware
    });

    // Populate author info before sending back
    await prompt.populate("author", "username");

    res.status(201).json(prompt);
  } catch (error) {
    console.error("Create prompt error:", error.message);
    res.status(500).json({ message: "Error creating prompt" });
  }
};

// @desc    Update a prompt
// @route   PUT /api/prompts/:id
// @access  Private (only author can update)
const updatePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // Check if logged-in user is the author
    if (prompt.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own prompts" });
    }

    const { title, content, description, category, tags } = req.body;

    // Update fields
    prompt.title = title || prompt.title;
    prompt.content = content || prompt.content;
    prompt.description = description ?? prompt.description;
    prompt.category = category || prompt.category;
    if (tags) {
      prompt.tags =
        typeof tags === "string"
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : tags;
    }

    const updated = await prompt.save();
    await updated.populate("author", "username");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating prompt" });
  }
};

// @desc    Delete a prompt
// @route   DELETE /api/prompts/:id
// @access  Private (only author can delete)
const deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // Check if logged-in user is the author
    if (prompt.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own prompts" });
    }

    await prompt.deleteOne();
    res.json({ message: "Prompt deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting prompt" });
  }
};

// @desc    Like or unlike a prompt
// @route   PUT /api/prompts/:id/like
// @access  Private
const likePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    const userId = req.user._id;
    const alreadyLiked = prompt.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike - remove user from likes array
      prompt.likes = prompt.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Like - add user to likes array
      prompt.likes.push(userId);
    }

    await prompt.save();
    res.json({ likes: prompt.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: "Error updating like" });
  }
};

// @desc    Increment usage count when user copies prompt
// @route   PUT /api/prompts/:id/use
// @access  Public
const usePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { $inc: { usageCount: 1 } },
      { new: true }
    );
    res.json({ usageCount: prompt.usageCount });
  } catch (error) {
    res.status(500).json({ message: "Error updating usage count" });
  }
};

// @desc    Get prompts by logged-in user
// @route   GET /api/prompts/my-prompts
// @access  Private
const getMyPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username");
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your prompts" });
  }
};

module.exports = {
  getPrompts,
  getPromptStats,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  likePrompt,
  usePrompt,
  getMyPrompts,
};
