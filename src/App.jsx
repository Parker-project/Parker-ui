import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import SubmitReportScreen from './screens/SubmitReportScreen';
import VerifyTokenScreen from './screens/VerifyTokenScreen';
import EmailNotVerifiedScreen from './screens/EmailNotVerifiedScreen';
import ResendVerificationScreen from './screens/ResendVerificationScreen';
import RequireAuth from './components/RequireAuth';
import RequireInspector from './components/RequireInspector';
import ReportDetail from './screens/ReportDetail';
import InspectorDashboardScreen from './screens/InspectorDashboardScreen';
import LandingPage from './screens/LandingPage';
import MyReportsScreen from './screens/MyReportsScreen';
import DashboardScreen from './screens/DashboardScreen';
import InspectorMapViewScreen from './screens/InspectorMapViewScreen';
import { getUserProfile } from './utils/api';
import './App.css';


export const handleSessionExpired = () => {
  const event = new CustomEvent('session_expired');
  window.dispatchEvent(event);
};

function AppContent() {
  const [user, setUser] = useState(null); 
  const [isAuth, setIsAuth] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbarOn = ['/verify-email'];

  // Verify authentication status on app load or refresh
  useEffect(() => {
    // Skip verification entirely if we're already on login page to prevent loops
    if (location.pathname === '/login') {
      setIsVerifyingAuth(false);
      return;
    }

    const verifyAuth = async () => {
      setIsVerifyingAuth(true);
      
      // First try to get user from localStorage
      const storedUser = localStorage.getItem('user');
      console.log('Stored user in localStorage:', storedUser ? 'exists' : 'not found');

      if (!storedUser) {
        // If no user in localStorage, try to get from server using cookie
        try {
          console.log('No stored user, checking server...');
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
            credentials: 'include'
          });

          if (response.ok) {
            const userData = await response.json();

            // Create complete user object
            const completeUserData = {
              ...userData,
              isEmailVerified: userData.isEmailVerified,
              provider: userData.provider || 'local' // Default to 'local' if not specified
            };

            localStorage.setItem('user', JSON.stringify(completeUserData));
            setUser(completeUserData);
            setIsAuth(true);
            setIsVerifyingAuth(false);
            return;
          }
        } catch (error) {
          console.error('Failed to get user from server:', error);
        }

        // If we get here, we couldn't get the user data
        console.log('No stored user found, clearing auth state');
        setUser(null);
        setIsAuth(false);
        setIsVerifyingAuth(false);
        return;
      }

      // Parse stored user data
      try {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        setUser(userData); // Set user from localStorage first

        // Skip verification if we're already on login, signup, or verification pages
        const currentPath = location.pathname;
        const isPublicRoute = currentPath === '/' ||
          currentPath === '/login' ||
          currentPath === '/signup' ||
          currentPath.includes('/verify-email');

        if (isPublicRoute) {
          setIsAuth(true); // Temporarily set as authenticated
          setIsVerifyingAuth(false);
          return;
        }

        // Then verify with the server that the user is still authenticated
        try {
          console.log('Verifying authentication with server...');
          const profileData = await getUserProfile();
          console.log('Server verification successful:', profileData);

          // Update user data with the complete profile data
          const updatedUserData = {
            ...userData,
            ...profileData,
            isEmailVerified: profileData.isEmailVerified,
            provider: profileData.provider || 'local' // Default to 'local' if not specified
          };

          // Update localStorage with complete user data
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          setUser(updatedUserData);
          setIsAuth(true);
        } catch (error) {
          console.error('Server verification failed:', error);

          // If on a protected route, redirect to login
          if (!isPublicRoute) {
            console.log('Clearing user data and redirecting to login');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuth(false);
            navigate('/login', {
              state: { message: 'Your session has expired. Please log in again.' }
            });
          }
        }
      } catch (parseError) {
        console.error('Failed to parse stored user data:', parseError);
        localStorage.removeItem('user');
        setUser(null);
        setIsAuth(false);
      }

      setIsVerifyingAuth(false);
    };

    verifyAuth();
  }, [navigate, location.pathname]);

  // Update isAuth whenever user state changes
  useEffect(() => {
    setIsAuth(!!user);
  }, [user]);

  useEffect(() => {
    const handleSessionExpiredEvent = () => {
      localStorage.removeItem('user');
      setUser(null);
      setIsAuth(false);

      if (location.pathname !== '/login') {
        navigate('/login', {
          state: { message: 'Your session has expired. Please log in again.' }
        });
      }
    };

    window.addEventListener('session_expired', handleSessionExpiredEvent);

    return () => {
      window.removeEventListener('session_expired', handleSessionExpiredEvent);
    };
  }, [navigate, location.pathname]);

  // Show loading state while verifying authentication
  if (isVerifyingAuth) {
    return (
      <div className="auth-loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && (
        <Navbar user={user} setUser={setUser} setIsAuth={setIsAuth} />
      )}
      <PageWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/signup" element={<SignupScreen setUser={setUser} setIsAuth={setIsAuth} />} />
          <Route path="/login" element={<LoginScreen setUser={setUser} setIsAuth={setIsAuth} />} />
          <Route path="/verify-email" element={<VerifyTokenScreen setUser={setUser} setIsAuth={setIsAuth} />} />
          <Route path="/verify-email-token" element={<VerifyTokenScreen setUser={setUser} setIsAuth={setIsAuth} />} />
          <Route path="/resend-verification" element={<ResendVerificationScreen />} />
          <Route path="/email-not-verified" element={<EmailNotVerifiedScreen />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth user={user} isAuth={isAuth} isVerifyingAuth={isVerifyingAuth}>
                <DashboardScreen user={user} setUser={setUser} setIsAuth={setIsAuth} isAuth={isAuth} isVerifyingAuth={isVerifyingAuth}/>
              </RequireAuth>
            }
          />

          <Route
            path="/submit-report"
            element={
              <RequireAuth user={user} isAuth={isAuth} isVerifyingAuth={isVerifyingAuth}>
                <SubmitReportScreen user={user} />
              </RequireAuth>
            }
          />

          <Route
            path="/my-reports"
            element={
              <RequireAuth user={user} isAuth={isAuth} isVerifyingAuth={isVerifyingAuth}>
                <MyReportsScreen user={user} />
              </RequireAuth>
            }
          />

          <Route
            path="/inspector-all-reports"
            element={
              <RequireInspector user={user} isAuth={isAuth} isVerifyingAuth={isVerifyingAuth}>
                <InspectorDashboardScreen user={user} />
              </RequireInspector>
            }
          />

          <Route
            path="/inspector-map-view"
            element={
              <RequireInspector user={user} isAuth={isAuth} isVerifyingAuth={isVerifyingAuth}>
                <InspectorMapViewScreen user={user} />
              </RequireInspector>
            }
          />

          <Route
            path="/inspector/report/:id"
            element={
              <RequireAuth user={user} isAuth={isAuth} isVerifyingAuth={isVerifyingAuth}>
                <ReportDetail />
              </RequireAuth>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />

          <Route path="/verify-email/:token" element={<VerifyTokenScreen setUser={setUser} />} />


        </Routes>
      </PageWrapper>
    </>
  );
}

function App() {
  return (
    <div className="app">
      <AppContent />
    </div>
  );
}

export default App;
