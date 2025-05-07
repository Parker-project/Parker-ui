import { Navigate } from 'react-router-dom';

export default function RequireAuth({ user, isAuth, children, isVerifyingAuth }) {

  // If still verifying, show nothing
  if (isVerifyingAuth) {
    return <div className="auth-loading">Verifying your session...</div>;
  }

  // First check if authenticated
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Double check user exists (shouldn't happen, but just in case)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if email is verified (assuming sanitizedUser structure from backend)
  const userData = user.sanitizedUser || user.user || user;
  if (!userData.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}
