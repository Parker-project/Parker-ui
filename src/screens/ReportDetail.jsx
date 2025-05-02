import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, MapPin, Car, Clock, AlertCircle } from 'lucide-react';
import { colors } from '../constants/styles';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock reports with always-visible image URLs
  const reports = [
    {
      id: 1,
      plate: '123-45-678',
      description: 'Blocking sidewalk',
      resolved: false,
      imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
      location: 'Hashalom St, Tel Aviv',
      createdAt: new Date('2025-05-01T13:15:00'),
      reporter: 'John Doe',
      reporterContact: 'john@example.com'
    },
    {
      id: 2,
      plate: '987-65-432',
      description: 'Parked in disabled spot',
      resolved: true,
      imageUrl: 'https://placehold.co/400x250?text=Report+2+Image',
      location: 'Bialik St, Ramat Gan',
      createdAt: new Date('2025-05-01T14:30:00'),
      reporter: 'Jane Smith',
      reporterContact: 'jane@example.com'
    }
  ];

  const report = reports.find((r) => r.id === parseInt(id));

  if (!report) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <AlertCircle size={48} color={colors.error} />
          <h2 style={styles.errorTitle}>Report Not Found</h2>
          <p style={styles.errorText}>The report you're looking for doesn't exist or has been removed.</p>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/inspector')}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div style={styles.header}>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/inspector')}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={styles.title}>Report #{report.id}</h1>
          <div style={styles.statusBadge}>
            <span style={{ 
              ...styles.statusDot,
              backgroundColor: report.resolved ? colors.success : colors.error
            }} />
            {report.resolved ? 'Resolved' : 'Pending'}
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          {/* Image Section */}
          <div style={styles.imageSection}>
            <img
              src={report.imageUrl}
              alt={`Report ${report.id}`}
              style={styles.image}
            />
          </div>

          {/* Details Section */}
          <div style={styles.detailsSection}>
            <div style={styles.detailCard}>
              <h3 style={styles.sectionTitle}>Vehicle Information</h3>
              <div style={styles.detailRow}>
                <Car size={20} color={colors.gray} />
                <span style={styles.detailLabel}>License Plate:</span>
                <span style={styles.detailValue}>{report.plate}</span>
              </div>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.sectionTitle}>Location Details</h3>
              <div style={styles.detailRow}>
                <MapPin size={20} color={colors.gray} />
                <span style={styles.detailLabel}>Address:</span>
                <span style={styles.detailValue}>{report.location}</span>
              </div>
              <div style={styles.detailRow}>
                <Clock size={20} color={colors.gray} />
                <span style={styles.detailLabel}>Reported:</span>
                <span style={styles.detailValue}>
                  {report.createdAt.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.sectionTitle}>Report Details</h3>
              <p style={styles.description}>{report.description}</p>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.sectionTitle}>Reporter Information</h3>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Name:</span>
                <span style={styles.detailValue}>{report.reporter}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Contact:</span>
                <span style={styles.detailValue}>{report.reporterContact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!report.resolved && (
          <div style={styles.actionButtons}>
            <motion.button
              style={styles.resolveButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Handle resolve action
                navigate('/inspector');
              }}
            >
              <Check size={16} /> Mark as Resolved
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: colors.background,
    minHeight: '100vh',
    padding: '24px 20px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.primary,
    fontSize: 16,
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: 8,
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: `${colors.primary}15`,
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: colors.black,
    margin: 0,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 500,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  imageSection: {
    position: 'sticky',
    top: 24,
    height: 'fit-content',
  },
  image: {
    width: '100%',
    borderRadius: 16,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.black,
    marginBottom: 16,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  detailLabel: {
    color: colors.gray,
    fontSize: 14,
    minWidth: 100,
  },
  detailValue: {
    color: colors.black,
    fontSize: 14,
    fontWeight: 500,
  },
  description: {
    fontSize: 15,
    lineHeight: 1.5,
    color: colors.black,
    margin: 0,
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 32,
    gap: 16,
  },
  resolveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.success,
    color: colors.white,
    border: 'none',
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: `${colors.success}dd`,
    },
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    gap: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: colors.black,
    margin: 0,
  },
  errorText: {
    fontSize: 16,
    color: colors.gray,
    margin: 0,
  },
};
