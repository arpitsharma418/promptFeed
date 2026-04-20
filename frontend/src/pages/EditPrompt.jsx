import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Writing", "Coding", "Marketing", "Education", "Creative", "Business", "Other"];

function EditPrompt() {
  const { id } = useParams();
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const res = await axios.get(`${API}/prompts/${id}`);
        const prompt = res.data;

        if (prompt.author._id !== user?._id) {
          toast.error("You can only edit your own prompts");
          navigate("/my-prompts");
          return;
        }

        setTitle(prompt.title);
        setContent(prompt.content);
        setDescription(prompt.description || "");
        setCategory(prompt.category);
        setTags(prompt.tags?.join(", ") || "");
      } catch (err) {
        toast.error("Prompt not found");
        navigate("/my-prompts");
      } finally {
        setLoading(false);
      }
    };

    loadPrompt();
  }, [id, API, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`${API}/prompts/${id}`, {
        title,
        content,
        description,
        category,
        tags
      });
      toast.success("Prompt updated!");
      navigate(`/prompts/${id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="bg-white min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-black/5 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Prompt</h1>
        <p className="text-gray-600 mb-8">Update your prompt details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label className="block mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              maxLength={2000}
              rows={10}
              className="input_theme"
            />
            <p className="text-right text-xs text-gray-500 mt-1">{content.length}/2000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
              disabled={saving}
              className="btn-primary flex-1"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPrompt;