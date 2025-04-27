import { useState } from 'react';

export default function ResendVerificationScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Simulated backend behavior
    setTimeout(() => {
      if (email === 'notfound@example.com') {
        setErrorMessage('Email not found or already verified');
      } else {
        setSuccessMessage('Verification email has been resent.');
      }
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="form-container">
      <h2>Resend Verification Email</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="form-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Resend Email'}
        </button>
      </form>

      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}
    </div>
  );
}
