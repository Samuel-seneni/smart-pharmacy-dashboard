import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const user = getUser();

  // 1. Not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. No roles provided (safety fallback)
  if (allowedRoles.length === 0) {
    return children;
  }

  // 3. Role not allowed → redirect safely
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;