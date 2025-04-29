import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); // Really clear it
    setUser(null); // Update App.jsx that no user is logged in
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navLeft}>
        <Link style={styles.link} to="/">Home</Link>
        {!user && (
          <>
            <Link style={styles.link} to="/login">Login</Link>
            <Link style={styles.link} to="/signup">Sign Up</Link>
          </>
        )}
        {user && (
          <>
            <Link style={styles.link} to="/submit-report">Submit Report</Link>
            {user.role === 'inspector' && (
              <Link style={styles.link} to="/inspector">Inspector Dashboard</Link>
            )}
            {/* You can add Admin dashboard link if needed */}
          </>
        )}
      </div>

      <div>
        {user && (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    marginBottom: '2rem'
  },
  navLeft: {
    display: 'flex',
    gap: '1rem'
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold'
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
