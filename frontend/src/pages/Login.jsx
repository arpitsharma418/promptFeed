import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Logged in!");
      navigate("/explore");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
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
          <h1 className="text-xl font-bold text-center mb-1 text-gray-800">Welcome back</h1>
          <p className="text-center text-gray-600 text-sm mb-6">Log in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="input_theme"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
