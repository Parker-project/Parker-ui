import { Link } from 'react-router-dom';

export default function LandingScreen() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to the Parking App</h1>
      <p>This is the landing page. Use the menu to navigate.</p>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/login">
          <button style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>Login</button>
        </Link>
        <Link to="/signup">
          <button style={{ padding: '0.5rem 1rem' }}>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
