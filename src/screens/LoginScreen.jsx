import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LoginScreen.css';
import { login } from '../utils/api';

export default function LoginScreen({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login(email, password, rememberMe);
      setUser(data);

      // Check for sanitizedUser which is how the backend returns the user data
      const userData = data.sanitizedUser || data.user || {};
      
      if (userData.isEmailVerified) {
        // Add a small delay before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // Redirect to email verification page
        setError('Please verify your email before logging in.');
        setTimeout(() => {
          navigate('/email-not-verified');
        }, 2000);
        return;
      }
    } catch (err) {
      console.error('Login error:', err);
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
              className="form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
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
