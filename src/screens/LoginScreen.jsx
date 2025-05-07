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

  const validateEmail = (email) => {
    if (!email.includes('@')) {
      return false;
    }
    return true;
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (emailError) {
      setEmailError('');
    }
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
        
        // Check for sanitizedUser which is how the backend returns the user data
        const userData = data.sanitizedUser || data.user || {};
        
        if (userData.isEmailVerified) {
          setIsLoading(false);
          
          // Let state updates finish
          setTimeout(() => {
            navigate('/dashboard');
          }, 100);
        } else {
          // Redirect to email verification page
          setError('Please verify your email before logging in.');
          setIsLoading(false);
          setTimeout(() => {
            navigate('/email-not-verified');
          }, 1000);
        }
      } else {
        setIsLoading(false);
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        
        {error && (
          <div className="message message-error">
            {error}
          </div>
        )}

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
            {emailError && (
              <div className="input-error-message">{emailError}</div>
            )}
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
            <button 
              className="btn btn-primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          
          <div className="form-footer">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
