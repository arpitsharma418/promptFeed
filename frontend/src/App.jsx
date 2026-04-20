import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import CreatePrompt from "./pages/CreatePrompt";
import PromptDetail from "./pages/PromptDetail";
import MyPrompts from "./pages/MyPrompts";
import Profile from "./pages/Profile";
import EditPrompt from "./pages/EditPrompt";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/prompts/:id" element={<PromptDetail />} />

          {/* These pages require logged in */}
          <Route path="/create" element={<PrivateRoute><CreatePrompt /></PrivateRoute>} />
          <Route path="/my-prompts" element={<PrivateRoute><MyPrompts /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><EditPrompt /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
