
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  requireAuth?: boolean;
  requiredRole?: "patient" | "hospital" | "doctor" | null;
  redirectPath?: string;
};

export const ProtectedRoute = ({
  requireAuth = true,
  requiredRole = null,
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, profile, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If authentication is required and user isn't authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If user is authenticated but this is a public route (like login/register),
  // redirect to appropriate dashboard
  if (!requireAuth && isAuthenticated) {
    if (profile?.role === "patient") {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (profile?.role === "hospital" || profile?.role === "doctor") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If specific role is required, check that too
  if (requiredRole && profile?.role !== requiredRole) {
    // For patients trying to access admin routes
    if (profile?.role === "patient" && (requiredRole === "hospital" || requiredRole === "doctor")) {
      return <Navigate to="/patient-dashboard" replace />;
    }
    // For admins/doctors trying to access patient routes
    else if ((profile?.role === "hospital" || profile?.role === "doctor") && requiredRole === "patient") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    // Default fallback
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the children routes
  return <Outlet />;
};

export default ProtectedRoute;
