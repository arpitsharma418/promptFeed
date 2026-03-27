import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import MaterialIcon from "./MaterialIcon";
import { categoryThemes } from "../utils/theme";

const PromptCard = ({ prompt, onDelete, showActions = false }) => {
  const { user, API } = useAuth();
  const [likes, setLikes] = useState(prompt.likes?.length || 0);
  const [liked, setLiked] = useState(prompt.likes?.includes(user?._id) || false);
  const [copying, setCopying] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopying(true);
      toast.success("Prompt copied!");
      await axios.put(`${API}/prompts/${prompt._id}/use`);
      setTimeout(() => setCopying(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like prompts");
      return;
    }

    try {
      const res = await axios.put(`${API}/prompts/${prompt._id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch {
      toast.error("Failed to update like");
    }
  };

  return (
    <div className="surface-card surface-hover flex flex-col gap-3 rounded-xl p-5">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/prompts/${prompt._id}`}
          className="line-clamp-2 text-[0.95rem] font-semibold leading-snug theme-text transition-colors hover:text-violet-500"
        >
          {prompt.title}
        </Link>
        <span className={`shrink-0 ${categoryThemes[prompt.category] || categoryThemes.Other}`}>
          {prompt.category}
        </span>
      </div>

      {prompt.description && (
        <p className="line-clamp-2 text-sm theme-text-muted">{prompt.description}</p>
      )}

      <div className="surface-soft rounded-lg p-3">
        <p className="prompt-content line-clamp-3 text-xs theme-text-secondary">
          {prompt.content}
        </p>
      </div>

      {prompt.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {prompt.tags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-[var(--bg-soft)] px-2 py-0.5 text-xs theme-text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t pt-1 theme-border">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-700 text-xs font-bold text-white">
            {prompt.author?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs theme-text-muted">{prompt.author?.username}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-colors ${
              liked ? "text-red-500" : "theme-text-muted hover:text-red-500"
            }`}
          >
            <MaterialIcon
              name={liked ? "favorite" : "favorite_border"}
              className="h-3.5 w-3.5"
              filled={true}
            />
            <span>{likes}</span>
          </button>

          <button
            onClick={handleCopy}
            className={`rounded-md border px-2 py-1 text-xs transition-colors ${
              copying
                ? "border-green-600 text-green-600"
                : "theme-border theme-text-secondary hover:border-violet-500 hover:text-violet-500"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <MaterialIcon name="content_copy" className="h-3.5 w-3.5" filled={true} />
              {copying ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 border-t pt-2 theme-border">
          <Link
            to={`/edit/${prompt._id}`}
            className="flex-1 rounded-md border py-1.5 text-center text-xs transition-colors theme-border theme-text-secondary hover:text-[var(--text-primary)]"
          >
            <span className="inline-flex items-center gap-1">
              <MaterialIcon name="edit_square" className="h-3.5 w-3.5" filled={true} />
              Edit
            </span>
          </Link>
          <button
            onClick={() => onDelete && onDelete(prompt._id)}
            className="flex-1 rounded-md border py-1.5 text-xs transition-colors theme-border theme-text-muted hover:border-red-300 hover:text-red-500"
          >
            <span className="inline-flex items-center gap-1">
              <MaterialIcon name="delete" className="h-3.5 w-3.5" filled={true} />
              Delete
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
