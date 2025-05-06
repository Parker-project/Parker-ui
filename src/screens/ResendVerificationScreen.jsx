import { useState } from 'react';
import { API_BASE_URL } from '../constants/api';
import PageWrapper from '../components/PageWrapper';

export default function ResendVerificationScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message || 'Verification email has been resent.');
        setEmail(''); // Clear the email field after successful resend
      } else {
        setErrorMessage(data.message || 'Failed to resend verification email.');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="form-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h2>Resend Verification Email</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <input
            className="form-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />

          <button
            className="form-button"
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isSubmitting ? 'Sending...' : 'Resend Email'}
          </button>
        </form>

        {errorMessage && <p className="error-text" style={{ color: 'red', marginTop: '1rem' }}>{errorMessage}</p>}
        {successMessage && <p className="success-text" style={{ color: 'green', marginTop: '1rem' }}>{successMessage}</p>}
      </div>
    </PageWrapper>
  );
}
