import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import { getReports } from '../utils/api';
import '../App.css';
import './MyReportsScreen.css';

export default function MyReportsScreen({ user }) {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    try {
      setLoading(true);
      
      const userId = user?.user?.id || user?.sanitizedUser?.id;
      
      const data = await getReports(userId);
      setReports(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatReportTitle = (report) => {
    if (report.description) {
      return report.description;
    } else if (report.liscensePlateNumber) {
      return `Report for plate: ${report.liscensePlateNumber}`;
    } else {
      return `Report #${report._id.substring(0, 8)}`;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    }
  };

  const reportVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      } 
    }),
    hover: { 
      y: -5, 
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="page-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="page-header">
          <h2>My Reports</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            <span className="btn-icon">🏠</span> Dashboard
          </button>
        </div>
        
        {loading ? (
          <p className="loading-state">Loading reports...</p>
        ) : error ? (
          <motion.div 
            className="error-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p>{error}</p>
            <button 
              onClick={fetchReports}
              className="btn btn-secondary"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="user-info"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Showing reports submitted by <strong>{user?.user?.firstName || user?.sanitizedUser?.firstName || user?.user?.email || 'you'}</strong>
            </motion.div>

            {reports.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <p>You haven't submitted any reports yet.</p>
                <button 
                  onClick={() => navigate('/submit-report')}
                  className="btn btn-primary"
                >
                  Submit Your First Report
                </button>
              </motion.div>
            ) : (
              <div className="reports-list">
                {reports.map((report, index) => (
                  <motion.div
                    key={report._id || report.id}
                    className="report-card"
                    custom={index}
                    variants={reportVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <div className="report-title">
                      {formatReportTitle(report)}
                    </div>
                    {report.liscensePlateNumber && (
                      <p className="report-details">
                        License plate: <strong>{report.liscensePlateNumber}</strong>
                      </p>
                    )}
                    {report.location && (
                      <p className="report-details">
                        Location: {report.location.address || `${report.location.latitude.toFixed(6)}, ${report.location.longitude.toFixed(6)}`}
                      </p>
                    )}
                    {report.createdAt && (
                      <p className="report-details">
                        Submitted: {new Date(report.createdAt).toLocaleString()}
                      </p>
                    )}
                    <StatusBadge status={report.status || 'Pending'} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
