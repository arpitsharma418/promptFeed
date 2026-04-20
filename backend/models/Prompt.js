import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  description: {
    type: String,
    trim: true,
    maxlength: 300,
    default: ""
  },
  category: {
    type: String,
    enum: ["Writing", "Coding", "Marketing", "Education", "Creative", "Business", "Other"],
    default: "Other"
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  likes: [mongoose.Schema.Types.ObjectId], //Users who liked this - Unki Ids ka Array

  usageCount: { //Kitne ne use kiya
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Prompt  = mongoose.model("Prompt", promptSchema);

export default Prompt;