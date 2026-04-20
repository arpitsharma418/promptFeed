import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Writing", "Coding", "Marketing", "Education", "Creative", "Business", "Other"];

function CreatePrompt() {
  const { API } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/prompts`, {
        title,
        content,
        description,
        category,
        tags
      });
      toast.success("Prompt created!");
      navigate(`/prompts/${res.data._id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create prompt";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/5 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create a Prompt</h1>
        <p className="text-gray-600 mb-8">Share a useful prompt with the community</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Professional Email Writer"
              required
              maxLength={100}
              className="input_theme"
            />
            <p className="text-right text-xs text-gray-500 mt-1">{title.length}/100</p>
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this prompt do?"
              maxLength={300}
              className="input_theme"
            />
          </div>

          <div>
            <label className="block mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input_theme"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Prompt Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your full prompt here..."
              required
              maxLength={2000}
              rows={10}
              className="input_theme"
            />
            <p className="text-right text-xs text-gray-500 mt-1">{content.length}/2000</p>
          </div>

          <div>
            <label className="block mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. email, professional, communication"
              className="input_theme"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? "Publishing..." : "Publish Prompt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePrompt;

