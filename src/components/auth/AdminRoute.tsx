
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For showcase purposes - allow all authenticated users to access admin pages
  // IMPORTANT: Remove this for production and uncomment the below code
  /*
  if (!isAdmin) {
    return <Navigate to="/patient-dashboard" replace />;
  }
  */
  
  return <>{children}</>;
};
