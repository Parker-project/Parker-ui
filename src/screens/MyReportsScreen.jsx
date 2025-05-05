import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import StatusBadge from '../components/StatusBadge'; //  new badge component
import { getReports } from '../utils/api';

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

  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>My Reports</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span style={{ marginRight: '5px' }}>🏠</span> Dashboard
          </button>
        </div>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#555' }}>Loading reports...</p>
        ) : error ? (
          <div style={{ padding: '20px', backgroundColor: '#fff0f0', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ color: '#d32f2f' }}>{error}</p>
            <button 
              onClick={fetchReports}
              style={{
                padding: '8px 16px',
                marginTop: '12px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: '1rem', color: '#555' }}>
              Showing reports submitted by <strong>{user?.user?.firstName || user?.sanitizedUser?.firstName || user?.user?.email || 'you'}</strong>:
            </p>

            {reports.length === 0 ? (
              <div style={{ 
                padding: '30px', 
                textAlign: 'center', 
                backgroundColor: '#f9f9f9', 
                borderRadius: '8px',
                border: '1px dashed #ddd'
              }}>
                <p style={{ marginBottom: '16px', color: '#666' }}>You haven't submitted any reports yet.</p>
                <button 
                  onClick={() => navigate('/submit-report')}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Submit Your First Report
                </button>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id || report.id}
                  style={{
                    background: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                    {formatReportTitle(report)}
                  </strong>
                  {report.liscensePlateNumber && (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      License plate: <strong>{report.liscensePlateNumber}</strong>
                    </p>
                  )}
                  {report.location && (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      Location: {report.location.address || `${report.location.latitude.toFixed(6)}, ${report.location.longitude.toFixed(6)}`}
                    </p>
                  )}
                  {report.createdAt && (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      Submitted: {new Date(report.createdAt).toLocaleString()}
                    </p>
                  )}
                  <StatusBadge status={report.status || 'Pending'} />
                </div>
              ))
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
