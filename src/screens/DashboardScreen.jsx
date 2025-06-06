import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCarAlt, FaClipboardList, FaSitemap, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import parkingIcon from '../assets/parking-icon.png';
import { logout } from '../utils/api';
import './DashboardScreen.css';


export default function DashboardScreen({ user, setUser, setIsAuth, isAuth, isVerifyingAuth }) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout API endpoint
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Even if the API call fails, clear the local state
      localStorage.removeItem('user');
      setUser(null);
      setIsAuth(false);
      navigate('/');
    }
  };

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: { duration: 0.2 } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Dashboard card configurations
  const dashboardCards = (() => {
    const isInspector = user?.role === 'inspector';
    const isAdmin = user?.role === 'admin';
    const isSuperInspector = user?.role === 'superInspector';
    if (isInspector) {
      return [
        {
          id: 'manage-status',
          icon: <FaUserAlt />,
          title: 'Update Reports Status',
          description: 'Update the status of reports',
          action: () => navigate('/inspector-all-reports')
        },
        {
          id: 'logout',
          icon: <FaSignOutAlt />,
          title: 'Logout',
          description: 'Sign out of your account',
          action: handleLogout
        },
        {
          id: 'report-map-view',
          icon: <FaSitemap />,
          title: 'Report Map View',
          description: 'View all submitted reports on a map',
          action: () => navigate('/inspector-map-view')
        }
      ];
    }

    else if (isAdmin) {
      return [
        {
          id: 'manage-users',
          icon: <FaUserAlt />,
          title: 'Users Dashboard',
          description: 'Manage and view all assigned users',
          action: () => navigate('/admin-all-users')
        },
        {
          id: 'logout',
          icon: <FaSignOutAlt />,
          title: 'Logout',
          description: 'Sign out of your account',
          action: handleLogout
        },
      ];
    }

    else if (isSuperInspector) {
      return [
        {
          id: 'report-violation',
          icon: <FaCarAlt />,
          title: 'Manage Reports',
          description: 'Manage all existing reports',
          action: () => navigate('/super-inspector')
        },
        {
          id: 'report-map-view',
          icon: <FaSitemap />,
          title: 'Report Map View',
          description: 'View all submitted reports on a map',
          action: () => navigate('/inspector-map-view')
        },
        {
          id: 'logout',
          icon: <FaSignOutAlt />,
          title: 'Logout',
          description: 'Sign out of your account',
          action: handleLogout
        },
      ];
    }

    return [
      {
        id: 'report-violation',
        icon: <FaCarAlt />,
        title: 'Report Violation',
        description: 'Submit a new parking violation report',
        action: () => navigate('/submit-report')
      },
      {
        id: 'my-reports',
        icon: <FaClipboardList />,
        title: 'My Reports',
        description: 'View your submitted reports and their status',
        action: () => navigate('/my-reports')
      },
      {
        id: 'logout',
        icon: <FaSignOutAlt />,
        title: 'Logout',
        description: 'Sign out of your account',
        action: handleLogout
      }
    ];
  })();

    const getUserFirstName = () => {
      return (
        user?.firstName ||
        user?.user?.firstName ||
        user?.sanitizedUser?.firstName ||
        'User'
      );
    };


  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="page-header">
          <div className="dashboard-header">
            <img 
              src={parkingIcon} 
              alt="Parker App Logo" 
              className="dashboard-logo" 
            />
            <h2 className="dashboard-title">Dashboard</h2>
          </div>
        </div>

        <div className="welcome-banner">
          <h3>Welcome, {getUserFirstName()}!</h3>
          <p>What would you like to do today?</p>
        </div>

        <motion.div 
          className="dashboard-cards dashboard-cards-2col"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {dashboardCards.map(card => (
            <motion.div 
              key={card.id}
              className="dashboard-card"
              variants={cardVariants}
              whileHover="hover"
              onClick={card.action}
            >
              <div className="dashboard-card-icon">
                {card.icon}
              </div>
              <div className="dashboard-card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}