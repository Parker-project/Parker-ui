import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = formData;

    if (!firstName || !lastName || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Simulated API behavior (mock)
    setTimeout(() => {
      if (email === 'taken@example.com') {
        setErrorMessage('Email address is already in use');
      } else {
        setSuccessMessage('Verification email sent! Check your inbox.');
        setFormData({ firstName: '', lastName: '', email: '', password: '' });
      }
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <PageWrapper>
      <div className="page-container">
        <h2>Create an Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            className="input-field"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="input-field"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
          {successMessage}
        </p>}
      </div>
    </PageWrapper>
  );
}
