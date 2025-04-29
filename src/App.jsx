import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import SubmitReportScreen from './screens/SubmitReportScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import ResendVerificationScreen from './screens/ResendVerificationScreen';
import RequireAuth from './components/RequireAuth';
import RequireInspector from './components/RequireInspector';
import LogoutButton from './components/LogoutButton';
import ReportDetail from './screens/ReportDetail';
import InspectorDashboardScreen from './screens/InspectorDashboardScreen';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <PageWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<h2>Landing Page</h2>} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/login" element={<LoginScreen setUser={setUser} />} />
          <Route path="/submit-report" element={<SubmitReportScreen />} />
          <Route path="/verify-email" element={<VerifyEmailScreen />} />
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
    </Router>
  );
}

export default App;
