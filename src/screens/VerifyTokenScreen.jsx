import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../constants/api';
import PageWrapper from '../components/PageWrapper';

export default function VerifyTokenScreen({ setUser }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      // Log the full URL to see what we're working with
      console.log('Current URL:', window.location.href);
      console.log('Search params:', location.search);
      
      const token = searchParams.get('token') || searchParams.get('verificationToken');
      console.log('Token from URL:', token);
      
      if (!token) {
        setStatus('error');
        setError('No verification token provided in URL');
        return;
      }

      try {
        console.log('Sending verification request with token:', token);
        const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ verificationToken: token }),
          credentials: 'include',
        });

        console.log('Response status:', response.status);
        
        try {
          const text = await response.text();
          console.log('Response text:', text);
          data = text ? JSON.parse(text) : {};
        } catch (e) {
          console.error('Error parsing response:', e);
          data = {};
        }
        
        console.log('Parsed data:', data);

        if (response.ok) {
          setStatus('success');
          console.log('Verification successful');
          
          // Update user state and local storage
          if (setUser && data.user) {
            console.log('Updating user data:', data.user);
            const updatedUser = {
              ...data.user,
              isEmailVerified: true
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } else {
            console.warn('No user data in response or setUser not provided');
          }
          
          // Store success in session storage to ensure we can redirect later
          sessionStorage.setItem('verificationSuccess', 'true');
          
          // Redirect to dashboard after 2 seconds
          console.log('Will redirect to dashboard in 2 seconds');
          setTimeout(() => {
            console.log('Redirecting now...');
            navigate('/dashboard', { replace: true });
          }, 2000);
        } else {
          setStatus('error');
          setError(data.message || 'Verification failed. Please try again.');
          console.error('Verification failed:', data.message || 'Unknown error');
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
