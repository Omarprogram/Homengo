// adminRoute.jsx
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (user.role !== "A") {
    return <Navigate to="/HomeScreen" replace />;
  }

  // Allowed
  return children;
}
