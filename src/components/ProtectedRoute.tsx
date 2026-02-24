import { Navigate, Outlet } from "react-router";

import { useAuth } from "@providers/useAuth";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background court-texture flex items-center justify-center">
        <p className="text-muted-foreground tracking-widest uppercase text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
