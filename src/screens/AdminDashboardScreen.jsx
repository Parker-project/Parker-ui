import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllReports, updateReportStatus } from '../utils/api'; 
import './AdminScreens.css';


const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [editingReportId, setEditingReportId] = useState(null);



  useEffect(() => {
    filterReports();
  }, [reports, selectedStatus]);

  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getAllReports();
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
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(r => r.status === selectedStatus));
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      setUpdating(reportId);
      await updateReportStatus(reportId, newStatus);
      const updatedReports = reports.map(r =>
        r._id === reportId ? { ...r, status: newStatus } : r
      );
      setReports(updatedReports); // triggers re-filtering
    } catch (err) {
      console.error('Error updating report status:', err);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };
  

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const renderStatusBadge = (status) => {
    const lower = status.toLowerCase();
    return <span className={`status-badge ${lower}`}>{status}</span>;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Reports Dashboard</h2>
      </div>

      <div className="dashboard-button-container">
        <select className="dashboard-btn" value={selectedStatus} onChange={handleStatusChange}>
          <option value="ALL">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
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
          {filteredReports.map((report, index) => (
            <div
            className={`report-card ${editingReportId === report._id ? 'selected' : ''}`}
            key={report._id}
            onClick={() => setEditingReportId(report._id)}
            style={{ cursor: 'pointer' }}
            >
              <div className="report-title">
                #{index +1} — {report.description}
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
                  <select
                    value={report.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      if (newStatus !== report.status) {
                        await handleUpdateStatus(report._id, newStatus);
                      }
                      setEditingReportId(null); // Done editing
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent card click while changing
                    autoFocus
                  >
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                ) : (
                  renderStatusBadge(report.status)
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    <div className="dashboard-button-container">
    <Link
        to="/admin/map-view"
        className="report-card view-map-link"
        style={{ textAlign: 'center', fontWeight: 'bold' }}
      >
        Map View 
      </Link>
    </div>
    </div>
  );
};

export default AdminDashboard;
