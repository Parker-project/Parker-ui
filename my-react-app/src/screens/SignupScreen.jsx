import { useState } from 'react';
import './SignupScreen.css'; // optional if you want external styling

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      setErrorMessage('Please fill in both email and password');
    } else {
      setErrorMessage('');
      window.alert(`Logged in as ${email}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

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

      {errorMessage && <p className="error-text">{errorMessage}</p>}

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

      <button className="form-button" onClick={handleLogin}>
        Login
      </button>

      <p className="link-text" onClick={() => window.alert("Redirect to password recovery flow")}>
        Forgot Password?
      </p>
    </div>
  );
}
