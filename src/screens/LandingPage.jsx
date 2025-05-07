import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import parkingIcon from '../assets/parking-icon.png';
import './LandingPage.css';

export default function LandingPage({ user }) {
  const navigate = useNavigate();

  const displayName =
    user?.user?.firstName ||
    user?.user?.name ||
    user?.user?.fullName ||
    user?.user?.email?.split('@')[0] ||
    'friend';

  return (
    <PageWrapper>
      <div className="landing-container">
        <img
          src={parkingIcon}
          alt="Parking Icon"
          className="landing-logo"
        />
        <h1 className="landing-title">PARKER</h1>
        <p className="landing-subtitle">
          Helping keep parking organized, clean, and efficient.
        </p>

        {!user && (
          <div className="landing-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        )}

        {user && (
          <div className="landing-user-action">
            <h3 className="landing-greeting">
              Hello, {displayName}!
            </h3>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/submit-report')}
            >
              Submit a Report
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
