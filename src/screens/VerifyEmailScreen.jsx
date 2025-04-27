import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function VerifyEmailScreen() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Verification token missing');
      return;
    }

    // MOCK verification behavior
    setTimeout(() => {
      if (token === 'bad-token') {
        setStatus('error');
        setMessage('Verification failed. Invalid or expired token.');
      } else {
        setStatus('success');
        setMessage('Email verified successfully!');
      }
    }, 1000);
  }, [searchParams]);

  return (
    <div className="form-container">
      <h2>Email Verification</h2>
      {status === 'loading' && <p>Verifying...</p>}
      {status === 'success' && <p className="success-text">{message}</p>}
      {status === 'error' && <p className="error-text">{message}</p>}
    </div>
  );
}
