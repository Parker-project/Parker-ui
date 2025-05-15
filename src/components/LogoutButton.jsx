import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/api';

export default function LogoutButton({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we should still clear local state
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
}
