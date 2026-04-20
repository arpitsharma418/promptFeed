import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import PromptCard from "../components/PromptCard";

function MyPrompts() {
  const { API } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const res = await axios.get(`${API}/prompts/user/my-prompts`);
        console.log(res.data[2].author);
        setPrompts(res.data);
      } catch (err) {
        toast.error("Failed to load your prompts");
      } finally {
        setLoading(false);
      }
    };

    loadPrompts();
  }, [API]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prompt?")) return;

    try {
      await axios.delete(`${API}/prompts/${id}`);
      setPrompts(prompts.filter((p) => p._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Prompts</h1>
            <p className="text-gray-600 mt-1">
              You have {prompts.length} prompt{prompts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/create" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            New Prompt
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <div key={prompt._id}>
                <PromptCard prompt={prompt} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium mb-2">No prompts yet</p>
            <p className="mb-6">Share your first prompt with the community</p>
            <Link to="/create" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Create Your First Prompt
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPrompts;
