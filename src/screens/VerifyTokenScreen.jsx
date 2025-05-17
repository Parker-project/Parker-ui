import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../constants/api';
import PageWrapper from '../components/PageWrapper';

export default function VerifyTokenScreen({ setUser }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token: tokenFromPath } = useParams(); // ✅ moved inside component
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');


  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token') || searchParams.get('verificationToken') || tokenFromPath;

      if (!token) {
        setStatus('error');
        setError('No verification token provided in URL');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
          method: 'GET',
          credentials: 'include',
        });

        let data = {};
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
        } catch (e) {
          console.error('Error parsing response:', e);
        }

        if (response.ok) {
          setStatus('success');

          if (setUser && data.user) {
            const updatedUser = {
              ...data.user,
              isEmailVerified: true
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }

          sessionStorage.setItem('verificationSuccess', 'true');
          setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
        } else {
          setStatus('error');
          setError(data.message || 'Verification failed. Please try again.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setError('Failed to verify email. Please try again.');
      }
    };

    verifyToken();
  }, [searchParams, navigate, setUser, location]);

  const goToDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <PageWrapper>
      <div className="form-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h2>Email Verification</h2>

        {status === 'verifying' && (
          <div>
            <p>Verifying your email...</p>
            <div className="loading-spinner"></div>
          </div>
        )}

        {status === 'success' && (
          <div>
            <p style={{ color: 'green' }}>Email verified successfully!</p>
            <p>Redirecting to dashboard...</p>
            <button
              onClick={goToDashboard}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Go to Dashboard Now
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <p style={{ color: 'red' }}>{error}</p>
            <button
              onClick={() => navigate('/resend-verification')}
              className="form-button"
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Resend Verification Email
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
