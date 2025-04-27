import { useNavigate } from 'react-router-dom';

export default function DashboardScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session (in real app you’d clear auth token, etc.)
    window.alert('Logged out!');
    navigate('/'); // Redirect to landing
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Dashboard</h1>
      <p>Welcome! You are now logged in.</p>

      <button
        onClick={handleLogout}
        style={{ marginTop: '2rem', padding: '0.5rem 1.2rem' }}
      >
        Logout
      </button>
    </div>
  );
}
