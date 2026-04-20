import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PromptCard from "../components/PromptCard";

const CATEGORIES = [
  "All",
  "Writing",
  "Coding",
  "Marketing",
  "Education",
  "Creative",
  "Business",
  "Other",
];

function Explore() {
  const { API } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotolPages] = useState(1);

  useEffect(() => {
    const loadPrompts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", 10);

        if (search) params.append("search", search);
        if (category !== "All") params.append("category", category);
        if (sort) params.append("sort", sort);

        const res = await axios.get(`${API}/prompts?${params.toString()}`);
        setPrompts(res.data.data);
        setTotolPages(res.data.totalPages);
      } catch (err) {
        console.log("Error loading prompts: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPrompts();
  }, [search, category, sort, API, page]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Explore Prompts
        </h1>
        <p className="text-gray-600 mb-6">
          {loading ? "Loading..." : prompts.length + " prompts found"}
        </p>

        {/* Search box */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input_theme"
          />
        </div>

        {/* Category filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition text-xs ${
                category === cat
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort option */}
        <div className="mb-6">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input_theme"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Liked</option>
            <option value="most-used">Most Used</option>
          </select>
        </div>

        {/* Prompts */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No prompts found</p>
          </div>
        )}

        {!loading && (
          <div className="text-xs flex justify-evenly items-center mt-10 p-3 rounded-lg">
            <button
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <span>
              {" "}
              Page {page} of {totalPages}{" "}
            </span>

            <button
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
