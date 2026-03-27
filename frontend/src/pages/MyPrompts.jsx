import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import PromptCard from "../components/PromptCard";
import MaterialIcon from "../components/MaterialIcon";

const MyPrompts = () => {
  const { API } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPrompts = async () => {
      try {
        const res = await axios.get(`${API}/prompts/user/my-prompts`);
        setPrompts(res.data);
      } catch {
        toast.error("Failed to load your prompts");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPrompts();
  }, [API]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prompt?")) return;

    try {
      await axios.delete(`${API}/prompts/${id}`);
      setPrompts(prompts.filter((prompt) => prompt._id !== id));
      toast.success("Prompt deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="app-shell">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold theme-text">My Prompts</h1>
            <p className="mt-1 text-sm theme-text-muted">
              {prompts.length} prompt{prompts.length !== 1 ? "s" : ""} published
            </p>
          </div>
          <Link to="/create" className="btn-primary">
            <span className="inline-flex items-center gap-2">
              <MaterialIcon name="add_circle" className="h-4 w-4" filled={true} />
              New Prompt
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-block h-48 animate-pulse rounded-xl p-5"></div>
            ))}
          </div>
        ) : prompts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                showActions={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state py-20">
            <div className="mb-3 flex justify-center text-violet-500">
              <MaterialIcon name="edit_square" className="h-10 w-10" filled={true} />
            </div>
            <p className="mb-2 text-lg font-medium theme-text">No prompts yet</p>
            <p className="mb-6 text-sm theme-text-muted">Share your best AI prompts with the community.</p>
            <Link to="/create" className="btn-primary">
              Create Your First Prompt
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrompts;
