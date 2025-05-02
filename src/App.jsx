import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import LogoutButton from './components/LogoutButton';
import ReportDetail from './screens/ReportDetail';
import InspectorDashboardScreen from './screens/InspectorDashboardScreen';
import LandingPage from './screens/LandingPage';
import MyReportsScreen from './screens/MyReportsScreen'; // ✅ ADDED

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const hideNavbarOn = ['/login', '/signup', '/verify-email'];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && (
        <Navbar user={user} setUser={setUser} />
      )}
      <PageWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/login" element={<LoginScreen setUser={setUser} />} />
          <Route path="/submit-report" element={<SubmitReportScreen />} />
          <Route path="/verify-email" element={<EmailNotVerifiedScreen />} />
          <Route path="/verify-email-token" element={<VerifyTokenScreen />} />
          <Route path="/resend-verification" element={<ResendVerificationScreen />} />

          {/* Protected Routes */}
          <Route
            path="/main"
            element={
              <RequireAuth user={user}>
                <div>
                  <h2>Main Page (User)</h2>
                  <LogoutButton setUser={setUser} />
                </div>
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAuth user={user}>
                <div>
                  <h2>Admin Page</h2>
                  <LogoutButton setUser={setUser} />
                </div>
              </RequireAuth>
            }
          />

          <Route
            path="/my-reports"
            element={ // ✅ ADDED NEW PROTECTED ROUTE
              <RequireAuth user={user}>
                <MyReportsScreen user={user} />
              </RequireAuth>
            }
          />

          <Route
            path="/inspector/report/:id"
            element={
              <RequireAuth user={user}>
                <ReportDetail />
              </RequireAuth>
            }
          />

          <Route
            path="/inspector"
            element={
              <RequireInspector user={user}>
                <InspectorDashboardScreen />
              </RequireInspector>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </PageWrapper>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
