import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PromptCard from "../components/PromptCard";
import MaterialIcon from "../components/MaterialIcon";

const Home = () => {
  const { user, API } = useAuth();
  const [featuredPrompts, setFeaturedPrompts] = useState([]);
  const [stats, setStats] = useState({
    promptsShared: 0,
    categories: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [promptsRes, statsRes] = await Promise.all([
          axios.get(`${API}/prompts?sort=popular`),
          axios.get(`${API}/prompts/stats/overview`),
        ]);

        setFeaturedPrompts(promptsRes.data.slice(0, 6));
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching prompts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [API]);

  const formatStat = (value) => {
    if (!value) return "0";
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M+`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K+`;
    return `${value}`;
  };

  return (
    <div className="app-shell">
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-20 text-center">
        <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-violet-500">
          <MaterialIcon name="auto_awesome" className="h-3.5 w-3.5" filled={true} />
          The prompt-sharing network for modern AI teams
        </div>

        <h1 className="mb-4 text-4xl font-bold leading-tight theme-text md:text-6xl">
          Discover and Share
          <br />
          <span className="text-violet-500">Better AI Prompts</span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-lg theme-text-secondary md:text-xl">
          A community-driven directory of high-quality prompts for ChatGPT, Claude, Gemini, and more.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/explore" className="btn-primary w-full sm:w-auto">
            <span className="inline-flex items-center gap-2">
              <MaterialIcon name="travel_explore" className="h-4 w-4" filled={true} />
              Explore Prompts
            </span>
          </Link>
          {!user && (
            <Link to="/register" className="btn-secondary w-full sm:w-auto">
              Join PromptFeed
            </Link>
          )}
          {user && (
            <Link to="/create" className="btn-secondary w-full sm:w-auto">
              <span className="inline-flex items-center gap-2">
                <MaterialIcon name="add_circle" className="h-4 w-4" filled={true} />
                Share a Prompt
              </span>
            </Link>
          )}
        </div>
      </section>

      <section className="page-section-muted border-y">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-4 py-8 text-center">
          {[
            { label: "Prompts Shared", value: formatStat(stats.promptsShared) },
            { label: "Categories", value: formatStat(stats.categories) },
            { label: "Users", value: formatStat(stats.users) },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold theme-text">{stat.value}</div>
              <div className="mt-1 text-xs theme-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold theme-text">Popular Prompts</h2>
          <Link to="/explore" className="text-sm text-violet-500 transition-colors hover:text-violet-400">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-block animate-pulse rounded-xl p-5">
                <div className="skeleton-line mb-3 h-4 w-3/4 rounded"></div>
                <div className="skeleton-line mb-2 h-3 w-full rounded"></div>
                <div className="skeleton-line h-3 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : featuredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="mb-3 flex justify-center text-violet-500">
              <MaterialIcon name="travel_explore" className="h-10 w-10" filled={true} />
            </div>
            <p className="mb-4 theme-text-secondary">No prompts yet. Be the first!</p>
            {user ? (
              <Link to="/create" className="btn-primary">
                Create First Prompt
              </Link>
            ) : (
              <Link to="/register" className="btn-primary">
                Join and Share
              </Link>
            )}
          </div>
        )}
      </section>

      <section className="page-section-muted border-t">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h2 className="mb-10 text-2xl font-bold theme-text">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: "travel_explore",
                title: "Explore",
                desc: "Browse prompts by category, search by keyword, or see what the community is using most.",
              },
              {
                icon: "content_copy",
                title: "Copy and Use",
                desc: "Grab any prompt in one click and use it in ChatGPT, Claude, or any other AI tool.",
              },
              {
                icon: "add_circle",
                title: "Share Yours",
                desc: "Publish your own prompts, help others, and learn what resonates with the community.",
              },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center gap-3">
                <span className="rounded-full bg-violet-500/10 p-3 text-violet-500">
                  <MaterialIcon name={step.icon} className="h-5 w-5" filled={true} />
                </span>
                <h3 className="font-semibold theme-text">{step.title}</h3>
                <p className="text-sm leading-relaxed theme-text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
