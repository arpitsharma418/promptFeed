import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PromptCard from "../components/PromptCard";

function Home() {
  const { user, API } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [stats, setStats] = useState({ promptsShared: 0, categories: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPrompts = async () => {
      try {
        const promptsRes = await axios.get(`${API}/prompts?sort=popular`);
        setPrompts(promptsRes.data.data.slice(0, 6));

        const statsRes = await axios.get(`${API}/prompts/stats/overview`);
        setStats(statsRes.data);
      } catch (err) {
        console.log("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    getPrompts();
  }, [API]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero section */}
      <div className="sm:max-w-2xl mx-auto px-4 py-20 text-center">
         <div className="text-xs my-5 border border-blue-200 w-fit mx-auto px-3 py-1 rounded-full bg-blue-50 text-blue-700">
          The prompt sharing network for modern AI teams
         </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-4">
          Discover and Share <span className="text-blue-600">Better AI Prompts</span>
        </h1>
        <p className="text-base sm:text-xl text-gray-600 mb-8 sm:max-w-2xl mx-auto">
          A simple community for people to share and find useful prompts for ChatGPT, Claude, and other AI tools.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/explore" className="btn-primary">
            Explore Prompts
          </Link>
          {!user && (
            <Link to="/register" className="btn-secondary">
              Join PromptFeed
            </Link>
          )}
          {user && (
            <Link to="/create" className="btn-secondary">
              Share a Prompt
            </Link>
          )}
        </div>
      </div>

      {/* Stats section */}
      <div className="border py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.promptsShared}</div>
              <div className="text-gray-600 text-sm mt-1">Prompts Shared</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.categories}</div>
              <div className="text-gray-600 text-sm mt-1">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.users}</div>
              <div className="text-gray-600 text-sm mt-1">Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured prompts */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Popular Prompts</h2>
        
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;