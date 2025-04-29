import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { API_BASE_URL } from '../constants/api';

export default function LoginScreen({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe: true, // Optional: for Alon's backend "remember me" feature
        }),
        credentials: 'include', // Important: allow cookies (access_token)
      });

      let data = {};

      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.warn('No usable JSON body, but login succeeded');
      }

      if (!res.ok) {
        let errorMessage = 'Login failed';
        if (data && data.message) {
          errorMessage = data.message;
        }
        setError(errorMessage);
        return;
      }

      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else if (data && data.token) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      }

      navigate('/submit-report');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <PageWrapper>
      <div className="page-container">
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
