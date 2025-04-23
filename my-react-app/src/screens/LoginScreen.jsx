import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css'; // optional styling file

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please fill in both fields');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const knownEmails = ['user@example.com', 'inspector@example.com', 'admin@example.com'];

      if (email === 'unverified@example.com') {
        setErrorMessage('Email not verified. Please check your inbox.');
      } else if (!knownEmails.includes(email)) {
        setErrorMessage('Email not found');
      } else if (password !== '123456') {
        setErrorMessage('Incorrect password');
      } else {
        setSuccessMessage(`Logged in as ${email}`);

        let role = 'user';
        if (email === 'inspector@example.com') role = 'inspector';
        if (email === 'admin@example.com') role = 'admin';

        setTimeout(() => {
          if (role === 'user') navigate('/main');
          if (role === 'inspector') navigate('/inspector');
          if (role === 'admin') navigate('/admin');
        }, 1000);
      }

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="remember-me">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
        </div>

        <button className="form-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}
    </div>
  );
}
