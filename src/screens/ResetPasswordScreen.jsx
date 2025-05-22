import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ResetPasswordScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // on mount, log and check token
  useEffect(() => {
    console.log('Token from URL:', token);
    if (!token) {
      setMessage('Invalid or missing token');
    }
  }, [token]);

  const handleReset = async () => {
    setMessage('');
    if (!token) {
      setMessage('Invalid or missing token');
      return;
    }
    if (typeof password !== 'string') {
      setMessage('Password must be a string');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    setIsSubmitting(true);
    console.log('Sending reset request:', { token, password });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password })
        }
      );
      const data = await res.json();

      if (res.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setMessage(data.message || 'Reset failed. Try again.');
      }
    } catch (err) {
      console.error('Reset error:', err);
      setMessage('Server error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>Reset Password</h2>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isSubmitting}
        style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
      />

      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isSubmitting}
        style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
      />

      <button
        onClick={handleReset}
        disabled={isSubmitting}
        style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}
      >
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </button>

      {message && (
        <p
          style={{
            marginTop: '1rem',
            color: message.includes('successful') ? 'green' : 'red'
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
