import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

axios.defaults.withCredentials = true;

// Custom hook
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${API}/auth/me`);
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // Register user
  const register = async (username, email, password) => {
    const res = await axios.post(`${API}/auth/register`, {
      username,
      email,
      password
    });
    setUser(res.data);
    return res.data;
  };

  // Login user
  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    setUser(res.data);
    return res.data;
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (err) {
      toast.error("Something Wrong");
    }
    setUser(null);
  };

  // Update user profile
  const updateUser = (newData) => {
    setUser({ ...user, ...newData });
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser, API }}>
      {children}
    </AuthContext.Provider>
  );
};

