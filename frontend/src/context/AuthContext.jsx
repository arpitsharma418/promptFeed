// AuthContext - manages user login state across the whole app
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Custom hook to use auth context easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading while checking login status

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // On app load, check if user is already logged in (token in localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("promptdir_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Set axios default auth header when user changes
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  // Register new user
  const register = async (username, email, password) => {
    const res = await axios.post(`${API}/auth/register`, {
      username,
      email,
      password,
    });
    setUser(res.data);
    localStorage.setItem("promptdir_user", JSON.stringify(res.data));
    return res.data;
  };

  // Login existing user
  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    setUser(res.data);
    localStorage.setItem("promptdir_user", JSON.stringify(res.data));
    return res.data;
  };

  // Logout - clear user state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("promptdir_user");
  };

  // Update user info in state after profile edit
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("promptdir_user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateUser, API }}
    >
      {children}
    </AuthContext.Provider>
  );
};
