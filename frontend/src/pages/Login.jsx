import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate("/explore");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-[calc(100vh-60px)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="surface-card rounded-2xl p-8">
          <div className="mb-7 text-center">
            <img
              src="/promptfeed_logo.png"
              alt="PromptFeed logo"
              className="mx-auto mb-3 h-12 w-12 rounded-xl object-cover"
            />
            <h1 className="text-xl font-bold theme-text">Welcome back</h1>
            <p className="mt-1 text-sm theme-text-muted">Log in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm theme-text-secondary">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="theme-input compact"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm theme-text-secondary">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="theme-input compact"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm theme-text-muted">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-violet-500 transition-colors hover:text-violet-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
