// Register.jsx - registration/signup page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      toast.success("Account created!");
      navigate("/explore");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="w-12 h-12 mx-auto mb-2">
            <img
              src="/promptfeed_logo.png"
              alt="logo_img"
              className="rounded-lg"
            />
          </div>
          <h1 className="text-xl font-bold text-center mb-1 text-gray-800">
            Create an account
          </h1>
          <p className="text-center text-gray-600 text-sm mb-6">
            Join our prompt community
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cooluser123"
                required
                minLength={3}
                className="input_theme"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="input_theme"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className="input_theme"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
