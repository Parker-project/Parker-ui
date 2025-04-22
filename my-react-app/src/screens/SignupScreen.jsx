import { useState } from 'react';
import './SignupScreen.css'; // keep if you have styling

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password } = formData;

    if (!firstName || !lastName || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setErrorMessage('');
    console.log('Signing up with:', formData); // next step: send to backend
  };

  return (
    <div className="form-container">
      <h2>Create an Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button className="form-button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}
