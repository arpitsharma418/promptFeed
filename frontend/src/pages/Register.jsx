import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      toast.success("Account created!");
      navigate("/explore");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
            <h1 className="text-xl font-bold theme-text">Create an account</h1>
            <p className="mt-1 text-sm theme-text-muted">Join the prompt community</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm theme-text-secondary">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="cooluser123"
                required
                minLength={3}
                className="theme-input compact"
              />
            </div>

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
                placeholder="Min 6 characters"
                required
                className="theme-input compact"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm theme-text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-500 transition-colors hover:text-violet-400">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
