import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Writing", "Coding", "Marketing", "Education", "Creative", "Business", "Other"];

const CreatePrompt = () => {
  const { API } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    category: "Other",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and prompt content are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/prompts`, formData);
      toast.success("Prompt created!");
      navigate(`/prompts/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create prompt");
    } finally {
      setLoading(false);
    }
  };

  const charCount = formData.content.length;

  return (
    <div className="app-shell">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold theme-text">Create a Prompt</h1>
          <p className="mt-1 text-sm theme-text-muted">Share a useful AI prompt with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium theme-text-secondary">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Professional Email Writer"
              required
              maxLength={100}
              className="theme-input"
            />
            <p className="mt-1 text-right text-xs theme-text-muted">{formData.title.length}/100</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium theme-text-secondary">
              Short Description <span className="theme-text-muted">(optional)</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What does this prompt do? When should you use it?"
              maxLength={300}
              className="theme-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium theme-text-secondary">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="theme-input cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium theme-text-secondary">
              Prompt Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your full prompt here... Be specific and include placeholders like [TOPIC] or [AUDIENCE] where needed."
              required
              maxLength={2000}
              rows={8}
              className="theme-input resize-none font-mono"
            />
            <p className={`mt-1 text-right text-xs ${charCount > 1800 ? "text-red-500" : "theme-text-muted"}`}>
              {charCount}/2000
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium theme-text-secondary">
              Tags <span className="theme-text-muted">(comma separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. email, professional, communication"
              className="theme-input"
            />
            <p className="mt-1 text-xs theme-text-muted">Tags help others discover your prompt</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Prompt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrompt;
