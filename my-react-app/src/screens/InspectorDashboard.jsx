import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function InspectorDashboard() {

  const navigate = useNavigate();
  const [reports, setReports] = useState([
    {
      id: 1,
      plate: '123-45-678',
      description: 'Blocking sidewalk',
      resolved: false
    },
    {
      id: 2,
      plate: '987-65-432',
      description: 'Parked in disabled spot',
      resolved: false
    }
  ]);

  const markAsResolved = (id) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, resolved: true } : report
      )
    );
  };

  return (
    <div className="form-container">
      <h2>Reports to Handle</h2>
      {reports.filter(r => !r.resolved).length === 0 ? (
        <p>No unresolved reports</p>
      ) : (
        reports
          .filter((report) => !report.resolved)
          .map((report) => (
            <div key={report.id} className="report-card">
            <p><strong>Plate:</strong> {report.plate}</p>
            <p><strong>Description:</strong> {report.description}</p>
            <button onClick={() => markAsResolved(report.id)}>Mark as Resolved</button>
            <button onClick={() => navigate(`/inspector/report/${report.id}`)}>
                View Details
            </button>
            </div>
          ))
      )}
    </div>
  );
}
