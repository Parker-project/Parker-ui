import { Navigate } from 'react-router-dom';

export default function RequireInspector({ user, children }) {
  if (!user || user.role !== 'inspector') {
    // If not logged in or not inspector, redirect
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access
  return children;
}
