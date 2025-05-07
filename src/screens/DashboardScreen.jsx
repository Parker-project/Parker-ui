import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCarAlt, FaClipboardList, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import parkingIcon from '../assets/parking-icon.png';
import './DashboardScreen.css';

export default function DashboardScreen({ user }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
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
  const dashboardCards = [
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
    // {
    //   id: 'profile',
    //   icon: <FaUserAlt />,
    //   title: 'Profile',
    //   description: 'Update your personal information',
    //   action: () => navigate('/profile')
    // },
    {
      id: 'logout',
      icon: <FaSignOutAlt />,
      title: 'Logout',
      description: 'Sign out of your account',
      action: handleLogout
    }
  ];

  const getUserFirstName = () => {
    return user?.user?.firstName || user?.sanitizedUser?.firstName || 'User';
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
