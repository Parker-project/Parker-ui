import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import SubmitReportScreen from './screens/SubmitReportScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import ResendVerificationScreen from './screens/ResendVerificationScreen';
import RequireAuth from './components/RequireAuth';
import LogoutButton from './components/LogoutButton';
import InspectorDashboard from './screens/InspectorDashboard';
import ReportDetail from './screens/ReportDetail';

function App() {
  return (
    <Router>
      <Navbar />
      <PageWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<h2>Landing Page</h2>} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/submit" element={<SubmitReportScreen />} />
          <Route path="/verify-email" element={<VerifyEmailScreen />} />
          <Route path="/resend-verification" element={<ResendVerificationScreen />} />
          <Route
            path="/inspector/report/:id"
            element={
              <RequireAuth>
                <ReportDetail />
              </RequireAuth>
            }
          />

          {/*Protected Routes Start */}
          <Route
            path="/main"
            element={
              <RequireAuth>
                <div>
                  <h2>Main Page (User)</h2>
                  <LogoutButton />
                </div>
              </RequireAuth>
            }
          />

<Route
  path="/inspector"
  element={
    <RequireAuth>
      <InspectorDashboard />
    </RequireAuth>
  }
/>
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <div>
                  <h2>Admin Page</h2>
                  <LogoutButton />
                </div>
              </RequireAuth>
            }
          />
          {/*Protected Routes End */}
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;
