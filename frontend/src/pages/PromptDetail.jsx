import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import MaterialIcon from "../components/MaterialIcon";
import { categoryThemes } from "../utils/theme";

const PromptDetail = () => {
  const { id } = useParams();
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await axios.get(`${API}/prompts/${id}`);
        setPrompt(res.data);
        setLikes(res.data.likes?.length || 0);
        setLiked(res.data.likes?.includes(user?._id) || false);
      } catch {
        toast.error("Prompt not found");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id, API, user, navigate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success("Prompt copied to clipboard!");
      await axios.put(`${API}/prompts/${id}/use`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Login to like prompts");
      return;
    }

    try {
      const res = await axios.put(`${API}/prompts/${id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this prompt?")) return;

    try {
      await axios.delete(`${API}/prompts/${id}`);
      toast.success("Prompt deleted");
      navigate("/my-prompts");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-sm theme-text-muted">Loading prompt...</div>
      </div>
    );
  }

  if (!prompt) return null;

  const isAuthor = user?._id === prompt.author?._id;

  return (
    <div className="app-shell">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1 text-sm transition-colors theme-text-muted hover:text-[var(--text-primary)]"
        >
          Back
        </button>

        <div className="surface-card rounded-2xl p-6 md:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold leading-snug theme-text md:text-2xl">{prompt.title}</h1>
            <span className={`shrink-0 ${categoryThemes[prompt.category] || categoryThemes.Other}`}>
              {prompt.category}
            </span>
          </div>

          {prompt.description && (
            <p className="mb-5 text-sm leading-relaxed theme-text-secondary">{prompt.description}</p>
          )}

          <div className="mb-6 flex items-center gap-3 border-b pb-6 theme-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-700 text-sm font-semibold text-white">
              {prompt.author?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium theme-text-secondary">{prompt.author?.username}</p>
              <p className="text-xs theme-text-muted">
                {new Date(prompt.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="ml-auto text-xs theme-text-muted">{prompt.usageCount} uses</div>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold theme-text-secondary">Prompt</h2>
              <button
                onClick={handleCopy}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  copied
                    ? "border-green-600 bg-green-500/10 text-green-600"
                    : "theme-border theme-text-secondary hover:border-violet-500 hover:text-violet-500"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <MaterialIcon name="content_copy" className="h-4 w-4" filled={true} />
                  {copied ? "Copied!" : "Copy Prompt"}
                </span>
              </button>
            </div>
            <div className="surface-soft rounded-xl p-5">
              <pre className="prompt-content whitespace-pre-wrap text-sm leading-relaxed theme-text-secondary">
                {prompt.content}
              </pre>
            </div>
          </div>

          {prompt.tags?.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {prompt.tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full border bg-[var(--bg-soft)] px-3 py-1 text-xs theme-border theme-text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-5 theme-border">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                liked
                  ? "border-red-300 bg-red-500/10 text-red-500"
                  : "theme-border theme-text-secondary hover:border-red-300 hover:text-red-500"
              }`}
            >
              <MaterialIcon
                name={liked ? "favorite" : "favorite_border"}
                className="h-4 w-4"
                filled={true}
              />
              <span>
                {likes} {likes === 1 ? "like" : "likes"}
              </span>
            </button>

            {isAuthor && (
              <div className="flex gap-2">
                <Link to={`/edit/${prompt._id}`} className="btn-secondary">
                  <span className="inline-flex items-center gap-1.5">
                    <MaterialIcon name="edit_square" className="h-4 w-4" filled={true} />
                    Edit
                  </span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="rounded-lg border px-4 py-2 text-sm transition-colors theme-border theme-text-muted hover:border-red-300 hover:text-red-500"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <MaterialIcon name="delete" className="h-4 w-4" filled={true} />
                    Delete
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="tips-panel mt-5 rounded-xl p-4">
          <p className="mb-1 text-xs font-medium text-violet-500">How to use this prompt</p>
          <p className="text-xs leading-relaxed theme-text-muted">
            Copy the prompt above and paste it into ChatGPT, Claude, Gemini, or any AI assistant. Replace any text in [BRACKETS] with your specific details for better results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
