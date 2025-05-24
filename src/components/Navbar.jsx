import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaPlusCircle,
  FaFileAlt
} from 'react-icons/fa';
import { logout } from '../utils/api';
import './Navbar.css';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, clear local state
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { to: '/login', icon: <FaSignInAlt className="nav-icon" />, text: 'Login' },
    { to: '/signup', icon: <FaUserPlus className="nav-icon" />, text: 'Sign Up' }
  ];

  const authenticatedLinks = (() => {
    const isInspector = user?.role === 'inspector';
    const isAdmin = user?.role === 'admin';
    const isSuperInspector = user?.role === 'superInspector';

    if (isInspector || isSuperInspector || isAdmin) {
      return [];
    }

    return [
      { to: '/submit-report', icon: <FaPlusCircle className="nav-icon" />, text: 'Submit' },
      { to: '/my-reports', icon: <FaFileAlt className="nav-icon" />, text: 'Reports' }
    ];

  })();


  const logoutAction = {
    icon: <FaSignOutAlt className="nav-icon" />,
    text: 'Logout',
    onClick: handleLogout
  };

  const renderNavLink = (item, index) => {
    if (item.onClick) {
      return (
        <div
          key={`action-${index}`}
          className="nav-link"
          onClick={item.onClick}
          style={{ cursor: 'pointer' }}
        >
          {item.icon}
          <span className="nav-text">{item.text}</span>
        </div>
      );
    }

    return (
      <Link
        key={item.to}
        to={item.to}
        className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
      >
        {item.icon}
        <span className="nav-text">{item.text}</span>
      </Link>
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        {/* Home link always shows */}
        <Link
          to={user ? '/dashboard' : '/'}
          className={`nav-link ${isActive(user ? '/dashboard' : '/') ? 'active' : ''}`}
        >
          <FaHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </Link>

        {!user ? (
          // Public links for unauthenticated users
          publicLinks.map(renderNavLink)
        ) : (
          <>
            {authenticatedLinks.map(renderNavLink)}
            {renderNavLink(logoutAction, 'logout')}
          </>
        )}
      </div>
    </nav>
  );
}
