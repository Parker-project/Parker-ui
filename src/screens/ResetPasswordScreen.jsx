import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ResetPasswordScreen() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/'), 2500);
      } else {
        setMessage(data.message || 'Reset failed. Try again.');
      }
    } catch (err) {
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
        <p style={{ marginTop: '1rem', color: message.includes('successful') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}
