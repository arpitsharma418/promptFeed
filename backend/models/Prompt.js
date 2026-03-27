// Prompt Model - defines how prompt data is stored in MongoDB
const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Prompt content is required"],
      trim: true,
      maxlength: [2000, "Prompt cannot exceed 2000 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
      default: "",
    },
    category: {
      type: String,
      enum: [
        "Writing",
        "Coding",
        "Marketing",
        "Education",
        "Creative",
        "Business",
        "Other",
      ],
      default: "Other",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // Reference to the user who created this prompt
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Users who liked this prompt
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // How many times this prompt was copied/used
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prompt", promptSchema);
