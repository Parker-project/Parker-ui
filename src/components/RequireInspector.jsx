import { Navigate } from 'react-router-dom';

export default function RequireInspector({ user, isAuth, children, isVerifyingAuth }) {
  // If still verifying, show loading
  if (isVerifyingAuth) {
    return <div className="auth-loading">Verifying your session...</div>;
  }
  
  // First check if authenticated
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // Then check if user exists and has inspector role
  if (!user || user.role !== 'inspector') {
    // If not logged in or not inspector, redirect
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, allow access
  return children;
}
