import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Writing", "Coding", "Marketing", "Education", "Creative", "Business", "Other"];

const EditPrompt = () => {
  const { id } = useParams();
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    category: "Other",
    tags: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await axios.get(`${API}/prompts/${id}`);
        const prompt = res.data;

        if (prompt.author._id !== user?._id) {
          toast.error("You can only edit your own prompts");
          navigate("/my-prompts");
          return;
        }

        setFormData({
          title: prompt.title,
          content: prompt.content,
          description: prompt.description || "",
          category: prompt.category,
          tags: prompt.tags?.join(", ") || "",
        });
      } catch {
        toast.error("Prompt not found");
        navigate("/my-prompts");
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id, API, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API}/prompts/${id}`, formData);
      toast.success("Prompt updated!");
      navigate(`/prompts/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm theme-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold theme-text">Edit Prompt</h1>
          <p className="mt-1 text-sm theme-text-muted">Update your prompt details</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium theme-text-secondary">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              className="theme-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium theme-text-secondary">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
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
            <label className="mb-2 block text-sm font-medium theme-text-secondary">Prompt Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              maxLength={2000}
              rows={8}
              className="theme-input resize-none font-mono"
            />
            <p className="mt-1 text-right text-xs theme-text-muted">{formData.content.length}/2000</p>
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
              className="theme-input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPrompt;
