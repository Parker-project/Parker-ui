import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, MapPin, Car, Clock, AlertCircle } from 'lucide-react';
import { MOCK_REPORTS } from '../mocks/reports';
import './ReportDetail.css';

const StatusBadge = ({ resolved }) => (
  <div className="status-badge">
    <span 
      className="status-dot"
      style={{ backgroundColor: resolved ? 'var(--success)' : 'var(--error)' }}
    />
    {resolved ? 'Resolved' : 'Pending'}
  </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="detail-row">
    {Icon && <Icon size={20} color="var(--gray)" />}
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value}</span>
  </div>
);

const DetailCard = ({ title, children }) => (
  <div className="detail-card">
    <h3 className="section-title">{title}</h3>
    {children}
  </div>
);

const MapPreview = ({ location }) => (
  <div className="map-container">
    <div className="map-placeholder">
      <MapPin size={24} color="var(--primary)" />
      <p className="map-placeholder-text">Location Preview</p>
      <p className="map-placeholder-subtext">{location}</p>
    </div>
  </div>
);

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const reportId = Number(id);
  const report = MOCK_REPORTS.find(r => r.id === reportId);

  if (!report) {
    return (
      <div className="report-detail">
        <div className="error-container">
          <AlertCircle size={48} color="var(--error)" />
          <h2 className="error-title">Report Not Found</h2>
          <p className="error-text">
            {isNaN(reportId) 
              ? 'Invalid report ID format'
              : `Report #${id} doesn't exist or has been removed.`}
          </p>
          <button 
            className="back-button"
            onClick={() => navigate('/inspector')}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-detail">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="header">
          <button 
            className="back-button"
            onClick={() => navigate('/inspector')}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="title">Report #{report.id}</h1>
          <StatusBadge resolved={report.resolved} />
        </div>

        <div className="content">
          <div className="image-section">
            <img
              src={report.imageUrl}
              alt={`Report ${report.id}`}
              className="image"
            />
          </div>

          <div className="details-section">
            <DetailCard title="Vehicle Information">
              <DetailRow 
                icon={Car}
                label="License Plate"
                value={report.plate}
              />
            </DetailCard>

            <DetailCard title="Location Details">
              <DetailRow 
                icon={MapPin}
                label="Address"
                value={report.location}
              />
              <DetailRow 
                icon={Clock}
                label="Reported"
                value={report.createdAt.toLocaleString()}
              />
              <MapPreview location={report.location} />
            </DetailCard>

            <DetailCard title="Report Details">
              <p className="description">{report.description}</p>
            </DetailCard>

            <DetailCard title="Reporter Information">
              <DetailRow 
                label="Name"
                value={report.reporter}
              />
              <DetailRow 
                label="Contact"
                value={report.reporterContact}
              />
            </DetailCard>
          </div>
        </div>

        {!report.resolved && (
          <div className="action-buttons">
            <motion.button
              className="resolve-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/inspector')}
            >
              <Check size={16} /> Mark as Resolved
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
