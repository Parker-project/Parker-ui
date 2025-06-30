import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllReports, getUserById, getUserByRole, updateReportInspector, deleteReportById } from '../utils/api'; 
import './InspectorScreen.css';
import ReportImages from '../components/ReportImages';

const SuperInspectorDashboard = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInspector, setSelectedInspector] = useState('ALL');
  const [editingReportId, setEditingReportId] = useState(null);
  const [inspectors, setInspectors] = useState([]);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, selectedInspector]);

  useEffect(() => {
    fetchInspectors();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getAllReports();
      setReports(Array.isArray(data) ? data : []);
      setError(null);
      setError(null);
      await enrichReportsWithInspectorName(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    if (selectedInspector === 'ALL') {
      setFilteredReports([...reports]);
    } else {
        setFilteredReports(reports.filter(r => r.inspectorId === selectedInspector));
    }
  };

  const handleUpdateInspector = async (reportId, newInspectorId) => {
    try {
      setUpdating(reportId);
  
      // 1. Update in backend
      await updateReportInspector(reportId, newInspectorId);
  
      // 2. Get new inspector data
      const user = await getUserById(newInspectorId);
      const inspectorName = user ? `${user.firstName} ${user.lastName}` : "Unknown";
  
      // 3. Update the report in local state
      setReports(prevReports =>
        prevReports.map(r =>
          r._id === reportId
            ? { ...r, inspectorId: newInspectorId, inspectorName }
            : r
        )
      );
      setToast(`Inspector updated to ${inspectorName}`);
      setTimeout(() => setToast(null), 6000);
    } catch (err) {
      console.error('Error updating report status:', err);
      alert('Failed to update inspector');
    } finally {
      setUpdating(null);
      setEditingReportId(null);
    }
  };
  

  const handleInspectorChange = (e) => {
    setSelectedInspector(e.target.value);
  };

  const renderInspectorBadge = (status) => {
    const lower = status.trim().toLowerCase();;
    return <span className={`status-badge`}>{status}</span>;
  };

  const enrichReportsWithInspectorName = async (reports) => {
    const enrichedReports = await Promise.all(
      reports.map(async (report) => {
        try {
          const user = await getUserById(report.inspectorId);
          const inspectorName = user ? `${user.firstName} ${user.lastName}` : "Unknown";
          return { ...report, inspectorName };
        } catch (error) {
          console.error("Failed to fetch user", error);
          return { ...report, inspectorName: "Unknown" };
        }
      })
    );
    setReports(enrichedReports);
  };

  const fetchInspectors = async () => {
    try {
    setLoading(true);
    setError(null);
    const response = await getUserByRole("inspector");
    setInspectors(response);
    } catch (error) {
      console.error("Error fetching inspectors:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
  
    try {
      await deleteReportById(reportId);
  
      // Remove the report from state
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete the report.');
    }
  };

  return (
    <div className="page-container">
      {toast && (<div className="toast-notification">{toast}</div>)}
      <div className="page-header">
        <button className="btn back-btn" onClick={() => navigate(-1)}>⬅</button>
        <h2>Reports Dashboard</h2>
      </div>

      <div className="dashboard-button-container">
      <select className="dashboard-btn" value={selectedInspector} onChange={handleInspectorChange}>
        <option value="ALL">All Inspectors</option>
        {inspectors.map((inspector) => (
          <option key={inspector._id} value={inspector._id}>
            {inspector.firstName} {inspector.lastName}
          </option>
          ))}
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
                  <strong>Location:</strong> {report.location.address}
                </div>
                <div className="report-details">
                  <strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}
                </div>
                <div className="report-details">
                  <strong>Status:</strong> {report.status}
                </div>
                
                <div className="report-details">
                  <strong>Assigned Inspector:</strong>{' '}
                  {editingReportId === report._id ? (
                    updating === report._id ? (
                      <span>Updating...</span>
                    ) : (
                      <select
                        value={reports.find(r => r._id === report._id)?.inspectorId || report.inspectorId}
                        onChange={async (e) => {
                          const newInspector = e.target.value;
                          if (newInspector !== report.inspectorId) {
                            await handleUpdateInspector(report._id, newInspector);
                          } else {
                            setEditingReportId(null);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      >
                        {inspectors.map((inspector) => (
                        <option key={inspector._id} value={inspector._id}>
                            {inspector.firstName} {inspector.lastName}
                        </option>
                        ))}
                      </select>
                    )
                  ) : (
                    renderInspectorBadge(report.inspectorName || 'Unassigned')
                  )}
                </div>
                {report.images && report.images.length > 0 && (
                  <ReportImages images={report.images} />
                )}
                {editingReportId === report._id && (
                <button
                className="minimal-delete-btn"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent parent card click
                    handleDeleteReport(report._id);
                }}
                >
                Delete
                </button>)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SuperInspectorDashboard;
