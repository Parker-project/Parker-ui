import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInspectorReports, updateReportStatus } from '../utils/api'; 
import './InspectorScreen.css';
import ReportImages from '../components/ReportImages';

const InspectorDashboard = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [editingReportId, setEditingReportId] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, selectedStatus]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getInspectorReports(user);
      setReports(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    if (selectedStatus === 'ALL') {
      setFilteredReports([...reports]);
    } else {
      setFilteredReports(reports.filter(r => r.status === selectedStatus));
    }
  };

  const handleUpdateStatus = async (reportId, newStatus, index) => {
    try {
      setUpdating(reportId);
      await updateReportStatus(reportId, newStatus);
  
      // Update the report in `reports`
      setReports(prevReports =>
        prevReports.map(r =>
          r._id === reportId ? { ...r, status: newStatus } : r
        )
      );
      setToast(`Report ${index + 1} updated to status ${newStatus}`);
      setTimeout(() => setToast(null), 6000);
    } catch (err) {
      console.error('Error updating report status:', err);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
      setEditingReportId(null);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const renderStatusBadge = (status) => {
    const lower = status.trim().toLowerCase();;
    console.log('Status:', lower);
    return <span className={`status-badge ${lower}`}>{status}</span>;
  };

  return (
    <div className="page-container">
      {toast && (<div className="toast-notification">{toast}</div>)}
      <div className="page-header">
        <button className="btn back-btn" onClick={() => navigate(-1)}>⬅</button>
        <h2>Reports Dashboard</h2>
      </div>
      <div className="welcome-banner">
          <h3>Welcome Inspector {user.firstName}</h3>
          <p>The following reports have been assigned to you</p>
        </div>

      <div className="dashboard-button-container">
        <select className="dashboard-btn" value={selectedStatus} onChange={handleStatusChange}>
          <option value="ALL">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading reports...</div>
      ) : error ? (
        <div className="error-state">
          {error}
          <button className="retry-btn" onClick={fetchReports}>Retry</button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="empty-state">
          <p>No reports found for selected status.</p>
        </div>
      ) : (
        <div className="reports-list">
          {filteredReports.map((report, index) => {
            const fullReport = reports.find(r => r._id === report._id) || report;

            return (
              <div
                className={`report-card ${editingReportId === report._id ? 'selected' : ''}`}
                key={report._id}
                onClick={() => setEditingReportId(report._id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="report-title">
                  #{index + 1} — {report.description}
                </div>
                <div className="report-details">
                  <strong>License plate:</strong> {report.liscensePlateNumber}
                </div>
                <div className="report-details">
                  <strong>Description:</strong> {report.description}
                </div>
                <div className="report-details">
                  <strong>Location:</strong> {report.location.address}
                </div>
                <div className="report-details">
                  <strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}
                </div>
                <div className="report-details">
                  <strong>Status:</strong>{' '}
                  {editingReportId === report._id ? (
                    updating === report._id ? (
                      <span>Updating...</span>
                    ) : (
                      <select
                        value={reports.find(r => r._id === report._id)?.status || report.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          if (newStatus !== report.status) {
                            await handleUpdateStatus(report._id, newStatus, index);
                          } else {
                            setEditingReportId(null);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      >
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="reviewed">Reviewed</option>
                      </select>
                    )
                  ) : (
                    renderStatusBadge(report.status)
                  )}
                </div>
                {report.images && report.images.length > 0 && (
                  <ReportImages images={report.images} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InspectorDashboard;
