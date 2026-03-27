import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import MaterialIcon from "./MaterialIcon";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setMenuOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-[var(--bg-soft)] theme-text"
        : "theme-text-secondary hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)]"
    }`;

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--nav-backdrop)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/promptfeed_logo.png"
            alt="PromptFeed logo"
            className="h-8 w-8 rounded-md object-cover"
          />
          <span className="text-lg font-semibold tracking-tight theme-text">
            PromptFeed
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link to="/explore" className={navLinkClass("/explore")}>
            Explore
          </Link>
          {user && (
            <>
              <Link to="/my-prompts" className={navLinkClass("/my-prompts")}>
                My Prompts
              </Link>
              <Link to="/create" className="ml-2 btn-primary !px-4 !py-1.5">
                <span className="inline-flex items-center gap-2">
                  <MaterialIcon name="add_circle" className="h-4 w-4" filled={true} />
                  New Prompt
                </span>
              </Link>
            </>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={handleThemeToggle}
            className="btn-secondary inline-flex items-center gap-2 !px-3 !py-1.5"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <MaterialIcon
              name={theme === "dark" ? "light_mode" : "dark_mode"}
              className="h-4 w-4"
              filled={true}
            />
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm transition-colors theme-text-secondary hover:text-[var(--text-primary)]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-700 text-xs font-semibold text-white">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <span>{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary !px-3 !py-1.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-1.5">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="theme-text-secondary transition-colors hover:text-[var(--text-primary)] md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div
          className="flex flex-col gap-2 border-t px-4 py-3 md:hidden"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-main)",
          }}
        >
          <Link to="/explore" onClick={() => setMenuOpen(false)} className="btn-ghost !px-0 text-left">
            Explore
          </Link>
          <button
            onClick={() => {
              handleThemeToggle();
              setMenuOpen(false);
            }}
            className="btn-ghost !px-0 text-left"
            type="button"
          >
            <span className="inline-flex items-center gap-2">
              <MaterialIcon
                name={theme === "dark" ? "light_mode" : "dark_mode"}
                className="h-4 w-4"
                filled={true}
              />
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </span>
          </button>
          {user ? (
            <>
              <Link to="/my-prompts" onClick={() => setMenuOpen(false)} className="btn-ghost !px-0 text-left">
                My Prompts
              </Link>
              <Link to="/create" onClick={() => setMenuOpen(false)} className="btn-ghost !px-0 text-left">
                <span className="inline-flex items-center gap-2">
                  <MaterialIcon name="add_circle" className="h-4 w-4" filled={true} />
                  New Prompt
                </span>
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="btn-ghost !px-0 text-left">
                Profile ({user.username})
              </Link>
              <button onClick={handleLogout} className="btn-ghost !px-0 text-left" type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost !px-0 text-left">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-ghost !px-0 text-left">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
