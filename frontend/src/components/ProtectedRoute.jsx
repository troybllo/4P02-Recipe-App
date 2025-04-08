// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#869a7b]"></div>
    </div>;
  }

  if (!currentUser) {
    // Remember where they were trying to go
    return <Navigate to="/SignIn" state={{ openSignIn: true, from: location.pathname }} replace />;
  }

  return <Outlet />;
};