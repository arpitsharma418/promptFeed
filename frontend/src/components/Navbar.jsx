import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-gray-100 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8">
            <img
              src="/promptfeed_logo.png"
              alt="logo_img"
              className="rounded-lg"
            />
          </div>
          <span className="text-lg font-semibold text-gray-800">
            PromptFeed
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link
            to="/explore"
            className="text-gray-700 hover:text-blue-500 transition"
          >
            Explore
          </Link>

          {user && (
            <>
              <Link
                to="/my-prompts"
                className="text-gray-700 hover:text-blue-500 transition"
              >
                My Prompts
              </Link>
              <Link
                to="/create"
                className="text-gray-700 hover:text-blue-500 transition"
              >
                New Prompt
              </Link>
            </>
          )}
        </div>

        {/* User area */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition"
              >
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white rounded-lg bg-red-600 "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 hover:text-blue-500"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#1f1f1f"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#1f1f1f"
              >
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden">
            <div className="px-4 py-4 space-y-3">
              <Link to="/explore" className="block text-gray-700">
                Explore
              </Link>
              {user && (
                <>
                  <Link to="/my-prompts" className="block text-gray-700">
                    My Prompts
                  </Link>
                  <Link to="/create" className="block text-gray-700">
                    New Prompt
                  </Link>
                  <Link to="/profile" className="block text-gray-700">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700"
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <>
                  <Link to="/login" className="block text-gray-700">
                    Login
                  </Link>
                  <Link to="/register" className="block text-gray-700">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
