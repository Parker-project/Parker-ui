import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { API_BASE_URL } from '../constants/api';
export default function SignupScreen({ setUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });
      
  
      if (res.ok) {
        // Only try reading body if needed, otherwise just navigate
        try {
          const text = await res.text();
          if (text) {
            const data = JSON.parse(text);
            if (data && data.token) {
              localStorage.setItem('user', JSON.stringify(data));
              setUser(data);
            }
          }
        } catch (parseError) {
          console.warn('No usable JSON body, but signup succeeded');
        }
  
        navigate('/verify-email');
      } else {
        let errorMessage = 'Signup failed';
        try {
          const text = await res.text();
          const data = text ? JSON.parse(text) : {};
          if (data.message) {
            errorMessage = data.message;
          }
        } catch (err) {
          console.warn('Error reading error message');
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };  

  return (
    <PageWrapper>
      <div className="page-container">
        <h2>Sign Up</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="primary-button" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
