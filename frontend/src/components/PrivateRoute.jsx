// PrivateRoute - redirects to login if user is not logged in
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing while checking auth status
  if (loading) return null;

  // Redirect to login if not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Render the protected page
  return children;
};

export default PrivateRoute;
