import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PromptCard from "../components/PromptCard";
import MaterialIcon from "../components/MaterialIcon";

const CATEGORIES = ["All", "Writing", "Coding", "Marketing", "Education", "Creative", "Business", "Other"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Liked" },
  { value: "most-used", label: "Most Used" },
];

const Explore = () => {
  const { API } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category !== "All") params.append("category", category);
        if (sort) params.append("sort", sort);

        const res = await axios.get(`${API}/prompts?${params.toString()}`);
        setPrompts(res.data);
      } catch (err) {
        console.error("Error fetching prompts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [search, category, sort, API]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="app-shell">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-bold theme-text">Explore Prompts</h1>
          <p className="text-sm theme-text-muted">
            {loading ? "Loading..." : `${prompts.length} prompts found`}
          </p>
        </div>

        <div className="mb-5 flex items-start gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted">
              <MaterialIcon name="search" className="h-4 w-4" filled={true} />
            </span>
            <input
              type="text"
              placeholder="Search prompts by title, description, or tags..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="theme-input compact w-full !pl-10"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="theme-input compact hidden w-40 shrink-0 cursor-pointer !px-3 sm:block"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8 flex gap-3">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === cat
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "theme-border bg-[var(--bg-soft)] theme-text-secondary hover:text-[var(--text-primary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="theme-input compact w-40 shrink-0 cursor-pointer !px-3 sm:hidden"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="skeleton-block animate-pulse rounded-xl p-5">
                <div className="skeleton-line mb-3 h-4 w-3/4 rounded"></div>
                <div className="skeleton-line mb-2 h-3 w-full rounded"></div>
                <div className="skeleton-line mb-3 h-16 rounded"></div>
                <div className="skeleton-line h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : prompts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="empty-state py-20">
            <div className="mb-2 flex justify-center text-violet-500">
              <MaterialIcon name="search" className="h-8 w-8" filled={true} />
            </div>
            <p className="mb-2 text-lg theme-text-secondary">No prompts found</p>
            <p className="text-sm theme-text-muted">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
