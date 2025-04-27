import { useParams } from 'react-router-dom';

export default function ReportDetail() {
  const { id } = useParams();

  // Mock reports with always-visible image URLs
  const reports = [
    {
      id: 1,
      plate: '123-45-678',
      description: 'Blocking sidewalk',
      resolved: false,
      imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
      location: 'Hashalom St, Tel Aviv'
    },
    {
      id: 2,
      plate: '987-65-432',
      description: 'Parked in disabled spot',
      resolved: true,
      imageUrl: 'https://placehold.co/400x250?text=Report+2+Image',
      location: 'Bialik St, Ramat Gan'
    }
  ];

  const report = reports.find((r) => r.id === parseInt(id));

  if (!report) {
    return (
      <div className="form-container">
        <h2>Report not found</h2>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Report Details</h2>
      <p><strong>Report ID:</strong> {report.id}</p>
      <p><strong>License Plate:</strong> {report.plate}</p>
      <p><strong>Description:</strong> {report.description}</p>
      <p><strong>Status:</strong> {report.resolved ? 'Resolved' : 'Pending'}</p>
      <p><strong>Location:</strong> {report.location}</p>

      <div style={{ marginTop: '1rem' }}>
        <img
          src={report.imageUrl}
          alt={`Report ${report.id}`}
          style={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
      </div>
    </div>
  );
}
