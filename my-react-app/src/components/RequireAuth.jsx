import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  // simulate token/session check
  const isLoggedIn = true; // change to false to test redirect

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
