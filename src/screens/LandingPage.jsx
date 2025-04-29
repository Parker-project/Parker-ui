import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

export default function LandingPage({ user }) {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div
        className="page-container"
        style={{
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Welcome to <span style={{ color: '#007bff' }}>Parker App 🅿️</span>
        </h1>

        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#555' }}>
          Helping keep parking organized, clean, and efficient.
        </p>

        {!user && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              className="primary-button"
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#007bff',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              Login
            </button>
            <button
              className="primary-button"
              onClick={() => navigate('/signup')}
              style={{
                backgroundColor: '#28a745',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {user && (
          <div>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', color: '#333' }}>
              Hello, {user.firstName}!
            </h3>
            <button
              className="primary-button"
              onClick={() => navigate('/submit-report')}
              style={{
                backgroundColor: '#007bff',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              Submit a Report
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
