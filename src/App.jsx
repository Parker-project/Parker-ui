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
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const hideNavbarOn = ['/verify-email'];

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
          <Route path="/signup" element={<SignupScreen setUser={setUser} />} />
          <Route path="/login" element={<LoginScreen setUser={setUser} />} />
          <Route path="/verify-email" element={<VerifyTokenScreen setUser={setUser} />} />
          <Route path="/verify-email-token" element={<VerifyTokenScreen setUser={setUser} />} />
          <Route path="/resend-verification" element={<ResendVerificationScreen />} />
          <Route path="/email-not-verified" element={<EmailNotVerifiedScreen />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth user={user}>
                <DashboardScreen user={user} />
              </RequireAuth>
            }
          />

          <Route
            path="/submit-report"
            element={
              <RequireAuth user={user}>
                <SubmitReportScreen user={user} />
              </RequireAuth>
            }
          />

          <Route
            path="/my-reports"
            element={
              <RequireAuth user={user}>
                <MyReportsScreen user={user} />
              </RequireAuth>
            }
          />

          <Route
            path="/inspector"
            element={
              <RequireInspector user={user}>
                <InspectorDashboardScreen user={user} />
              </RequireInspector>
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
      <div className="app">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
