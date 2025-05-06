import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaPlusCircle,
  FaTools,
  FaFileAlt // 👈 added
} from 'react-icons/fa';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navLeft}>
        <Link style={styles.link} to="/">
          <div style={styles.linkContent}>
            <FaHome size={18} />
            <span>Home</span>
          </div>
        </Link>

        {!user && (
          <>
            <Link style={styles.link} to="/login">
              <div style={styles.linkContent}>
                <FaSignInAlt size={18} />
                <span>Login</span>
              </div>
            </Link>

            <Link style={styles.link} to="/signup">
              <div style={styles.linkContent}>
                <FaUserPlus size={18} />
                <span>Sign Up</span>
              </div>
            </Link>
          </>
        )}

        {user && (
          <>
            <Link style={styles.link} to="/submit-report">
              <div style={styles.linkContent}>
                <FaPlusCircle size={18} />
                <span>Submit</span>
              </div>
            </Link>

            <Link style={styles.link} to="/my-reports">
              <div style={styles.linkContent}>
                <FaFileAlt size={18} />
                <span>My Reports</span>
              </div>
            </Link>

            {user.role === 'inspector' && (
              <Link style={styles.link} to="/inspector">
                <div style={styles.linkContent}>
                  <FaTools size={18} />
                  <span>Inspector</span>
                </div>
              </Link>
            )}

            <div style={styles.link} onClick={handleLogout}>
              <div style={styles.linkContent}>
                <FaSignOutAlt size={18} />
                <span>Logout</span>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ccc',
    padding: '0.5rem 0',
    zIndex: 1000
  },
  navLeft: {
    display: 'flex',
    gap: '1rem',
    flex: 1,
    justifyContent: 'space-around'
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: '14px',
    padding: '4px 8px',
    cursor: 'pointer'
  },
  linkContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  }
};
