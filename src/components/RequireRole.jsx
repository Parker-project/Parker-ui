import { Navigate } from 'react-router-dom';

export default function RequireRole({ user, isAuth, children, isVerifyingAuth, allowedRoles = [] }) {
  if (isVerifyingAuth) {
    return <div className="auth-loading">Verifying your session...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}