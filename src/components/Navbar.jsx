import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaPlusCircle,
  FaTools,
  FaFileAlt
} from 'react-icons/fa';
import './Navbar.css';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { to: '/login', icon: <FaSignInAlt className="nav-icon" />, text: 'Login' },
    { to: '/signup', icon: <FaUserPlus className="nav-icon" />, text: 'Sign Up' }
  ];

  const authenticatedLinks = [
    { to: '/submit-report', icon: <FaPlusCircle className="nav-icon" />, text: 'Submit' },
    { to: '/my-reports', icon: <FaFileAlt className="nav-icon" />, text: 'Reports' }
  ];

  // Only show the inspector link if the user has the role
  const inspectorLink = {
    to: '/inspector',
    icon: <FaTools className="nav-icon" />,
    text: 'Inspector'
  };

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
            {user.role === 'inspector' && renderNavLink(inspectorLink)}
            {renderNavLink(logoutAction, 'logout')}
          </>
        )}
      </div>
    </nav>
  );
}
