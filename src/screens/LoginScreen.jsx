import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LoginScreen.css';
import { login } from '../utils/api';

export default function LoginScreen({ setUser, setIsAuth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);


  const handleSendResetEmail = async () => {
    setIsSendingReset(true);
    setResetMessage('');
    console.log('Sending reset email for:', resetEmail);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setResetMessage('Reset link sent! Check your inbox.');
      } else {
        setResetMessage(data.message || 'Failed to send reset link.');
      }
    } catch (err) {
      setResetMessage('Server error. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };
  

  const validateEmail = (email) => email.includes('@');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!validateEmail(email)) {
      setEmailError('Invalid email format. Please include an @ symbol.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(email, password, rememberMe);
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsAuth(true);
        const userData = data.sanitizedUser || data.user || {};

        if (userData.isEmailVerified) {
          setTimeout(() => navigate('/dashboard'), 100);
        } else {
          setError('Please verify your email before logging in.');
          setTimeout(() => navigate('/email-not-verified'), 1000);
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };  

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="page-header">
          <h2>Login</h2>
        </div>

        {error && <div className="message message-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input ${emailError ? 'input-error' : ''}`}
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={isLoading}
            />
            {emailError && <div className="input-error-message">{emailError}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkbox-text">Remember Me</span>
            </label>
          </div>

          <div className="form-group" style={{ marginTop: '24px' }}>
            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div className="form-group">
  <button
    type="button"
    onClick={handleGoogleLogin}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '0.75rem',
      backgroundColor: 'white',
      color: '#444',
      border: '1px solid #ddd',
      borderRadius: '999px',
      fontWeight: 'bold',
      fontSize: '1rem', // 👈 Bigger font
      cursor: 'pointer',
      width: '50%',
      maxWidth: '320px',
      margin: '0 auto'
    }}
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google logo"
      style={{ width: '20px', height: '20px' }}
    />
    Sign in with Google
  </button>
</div>

<div style={{ marginTop: '16px', textAlign: 'center' }}>
  <button
    type="button"
    onClick={() => setShowResetModal(true)}
    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
  >
    Forgot your password?
  </button>
</div>



        </form>
        {showResetModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="page-header">
        <h2 style={{ marginBottom: '1rem' }}>Reset Password</h2>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
        </div>

        {resetMessage && (
          <div
            className="message"
            style={{
              color: resetMessage.toLowerCase().includes('sent') ? 'green' : 'red',
              marginTop: '0.5rem'
            }}
          >
            {resetMessage}
          </div>
        )}

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleSendResetEmail}
            disabled={isSendingReset}
            style={{ width: '100%' }}
          >
            {isSendingReset ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>

        <div className="form-group" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setShowResetModal(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}



      </motion.div>
    </div>
  );
}
