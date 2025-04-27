import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Here you'd clear token/cookie in the real version
    navigate('/login');
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
}
