import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SignupScreen.css';
import { API_BASE_URL } from '../constants/api';

export default function SignupScreen({ setUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Submitting signup form:', { firstName, lastName, email });
  
    try {
      console.log('Sending request to:', `${API_BASE_URL}/auth/signup`);
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });
      
      console.log('Response status:', res.status);
  
      if (res.ok) {
        // Only try reading body if needed, otherwise just navigate
        try {
          const text = await res.text();
          if (text) {
            const data = JSON.parse(text);
            console.log('Parsed response:', data);
            if (data && data.token) {
              localStorage.setItem('user', JSON.stringify(data));
              setUser(data);
            }
          }
        } catch (parseError) {
          console.warn('No usable JSON body, but signup succeeded:', parseError);
        }
  
        navigate('/verify-email');
      } else {
        let errorMessage = 'Signup failed';
        try {
          const text = await res.text();
          console.log('Error response text:', text);
          const data = text ? JSON.parse(text) : {};
          if (data.message) {
            errorMessage = data.message;
          }
        } catch (err) {
          console.warn('Error reading error message:', err);
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Something went wrong. Please try again.');
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
          <h2>Sign Up</h2>
        </div>

        {error && (
          <div className="message message-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
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
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group" style={{ marginTop: '24px' }}>
            <button 
              className="btn btn-primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
          
          <div className="form-footer">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
