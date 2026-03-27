// App.jsx - sets up routing and wraps app with AuthProvider
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import CreatePrompt from "./pages/CreatePrompt";
import PromptDetail from "./pages/PromptDetail";
import MyPrompts from "./pages/MyPrompts";
import Profile from "./pages/Profile";
import EditPrompt from "./pages/EditPrompt";

// Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            fontFamily: "DM Sans, sans-serif",
          },
        }}
      />

      <div className="app-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/prompts/:id" element={<PromptDetail />} />

          {/* Protected routes - only for logged-in users */}
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePrompt />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-prompts"
            element={
              <PrivateRoute>
                <MyPrompts />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditPrompt />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
