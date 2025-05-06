import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import parkingIcon from '../assets/parking-icon.png'; // <-- Make sure you have an icon here!

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
      <div
        className="page-container"
        style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          maxWidth: '500px',
          margin: '0 auto',
          animation: 'fadeIn 1s ease',
        }}
      >
        <img
          src={parkingIcon}
          alt="Parking Icon"
          style={{ width: '250px', margin: '1rem auto 2rem', display: 'block' }}
        />

        <p style={{ fontSize: '1.4rem', marginBottom: '3rem', color: '#555' }}>
          Helping keep parking organized, clean, and efficient.
        </p>

        {!user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <button
              className="primary-button"
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#007bff',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1.4rem',
                color: 'white',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '300px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.1s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Login
            </button>
            <button
              className="primary-button"
              onClick={() => navigate('/signup')}
              style={{
                backgroundColor: '#28a745',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1.4rem',
                color: 'white',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '300px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.1s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Sign Up
            </button>
          </div>
        )}

        {user && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '2rem', color: '#333', fontWeight: '600' }}>
              Hello, {displayName}!
            </h3>
            <button
              className="primary-button"
              onClick={() => navigate('/submit-report')}
              style={{
                backgroundColor: '#007bff',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1.4rem',
                color: 'white',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '300px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.1s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Submit a Report
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          body {
            background-color: #f8f9fa;
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </PageWrapper>
  );
}
