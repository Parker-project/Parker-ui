import { Navigate } from 'react-router-dom';

export default function RequireAuth({ user, children }) {
  console.log('RequireAuth check, user:', user);

  if (!user) {
    console.log('User not logged in, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if email is verified (assuming sanitizedUser structure from backend)
  const userData = user.sanitizedUser || user.user || user;
  if (!userData.isEmailVerified) {
    console.log('Email not verified, redirecting to verification page');
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}
