import Prompt from "../models/Prompt.js";
import User from "../models/User.js";

// Get all prompts
export const getPrompts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    let sortBy = { createdAt: -1 };
    if (sort === "popular") {
      sortBy = { likes: -1 };
    }
    if (sort === "most-used") {
      sortBy = { usageCount: -1 };
    }

    const prompts = await Prompt.find(filter)
      .sort(sortBy)
      .populate("author", "username")
      .skip(skip)
      .limit(limit);

    const total = await Prompt.countDocuments();

    res.json({
      data: prompts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log("Error in fetching prompts: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get stats about prompts
export const getPromptStats = async (req, res) => {
  try {
    const promptCount = await Prompt.countDocuments();

    const categories = await Prompt.distinct("category");

    const userCount = await User.countDocuments();

    res.json({
      promptsShared: promptCount,
      categories: categories.length,
      users: userCount,
    });
  } catch (err) {
    console.log("Error in getting stats: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single prompt by its ID
export const getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id)
      .populate("author", "-password");

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    res.json(prompt);
  } catch (err) {
    console.log("Error in getting prompt by its ID: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new prompt
export const createPrompt = async (req, res) => {
  const { title, content, description, category, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    let tagsArray = [];
    if (tags) {
      if (typeof tags === "string") {
        tagsArray = tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else {
        tagsArray = tags;
      }
    }

    // Create the prompt
    const newPrompt = await Prompt.create({
      title: title,
      content: content,
      description: description || "",
      category: category,
      tags: tagsArray,
      author: req.user._id,
    });

    await newPrompt.populate("author", "username", "-password");

    res.status(201).json(newPrompt);
  } catch (err) {
    console.log("Error in creating prompt: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a prompt
export const updatePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // Check if the user is the author
    if (prompt.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own prompts" });
    }

    // Update the fields
    if (req.body.title) {
      prompt.title = req.body.title;
    }
    if (req.body.content) {
      prompt.content = req.body.content;
    }
    if (req.body.description !== undefined) {
      prompt.description = req.body.description;
    }
    if (req.body.category) {
      prompt.category = req.body.category;
    }
    if (req.body.tags) {
      if (typeof req.body.tags === "string") {
        prompt.tags = req.body.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else {
        prompt.tags = req.body.tags;
      }
    }

    // Save the updated prompt
    const updated = await prompt.save();
    await updated.populate("author", "username");

    res.json(updated);
  } catch (err) {
    console.log("Error in update prompt: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a prompt
export const deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    if (prompt.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own prompts" });
    }
    await Prompt.findByIdAndDelete(req.params.id);

    res.json({ message: "Prompt deleted" });
  } catch (err) {
    console.log("Error in delete prompt: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Like or unlike the prompt
export const likePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    const userId = req.user._id;

    const userAlreadyLiked = prompt.likes.some(
      (id) => id.toString() === userId.toString(),
    );

    if (userAlreadyLiked) {
      prompt.likes = prompt.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      prompt.likes.push(userId);
    }

    await prompt.save();

    res.json({
      likes: prompt.likes.length,
      liked: !userAlreadyLiked,
    });
  } catch (err) {
    console.log("Error in Liking prompt: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Increment usage count when user copies
export const usePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    prompt.usageCount = prompt.usageCount + 1;
    await prompt.save();

    res.json({ usageCount: prompt.usageCount });
  } catch (err) {
    console.log("Error in using prompt: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get my prompts
export const getMyPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username");

    res.json(prompts);
  } catch (err) {
    console.log("Error in get my prompts: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};
