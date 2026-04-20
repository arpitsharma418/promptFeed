import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function PromptDetail() {
  const { id } = useParams();
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const res = await axios.get(`${API}/prompts/${id}`);
        setPrompt(res.data);
        setLikes(res.data.likes?.length || 0);
        setLiked(res.data.likes?.includes(user?._id) || false);
      } catch (err) {
        toast.error("Prompt not found");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    loadPrompt();
  }, [id, API, user, navigate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      // Increment usage count
      await axios.put(`${API}/prompts/${id}/use`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
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
    } catch (err) {
      toast.error("Failed to like");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this prompt?")) return;

    try {
      await axios.delete(`${API}/prompts/${id}`);
      toast.success("Deleted");
      navigate("/my-prompts");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!prompt) return null;

  const isAuthor = user?._id === prompt.author?._id;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-600 mb-6 text-sm"
        >
          ← Back
        </button>

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{prompt.title}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
              {prompt.category}
            </span>
          </div>

          {prompt.description && (
            <p className="text-gray-600 mb-6">{prompt.description}</p>
          )}

          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              {prompt.author?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {prompt.author?.username}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(prompt.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="ml-auto text-sm text-gray-500">
              {prompt.usageCount} uses
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Prompt</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {prompt.content}
              </pre>
            </div>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                copied
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {copied ? "Copied!" : "Copy Prompt"}
            </button>
          </div>

          {prompt.tags?.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {prompt.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <button
              onClick={handleLike}
              className="border flex items-center px-5 py-2 gap-2 rounded-lg hover:bg-red-50 transition"
            >
              {liked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="17px"
                  viewBox="0 -960 960 960"
                  width="17px"
                  fill="#0000F5"
                >
                  <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="17px"
                  viewBox="0 -960 960 960"
                  width="17px"
                  fill="#000000"
                >
                  <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                </svg>
              )}
              {likes}
            </button>

            {isAuthor && (
              <div className="flex gap-2">
                <Link
                  to={`/edit/${prompt._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptDetail;
