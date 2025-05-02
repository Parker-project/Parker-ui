import PageWrapper from '../components/PageWrapper';
import StatusBadge from '../components/StatusBadge'; //  new badge component

export default function MyReportsScreen({ user }) {
  const reports = [
    { id: 1, title: 'Blocked driveway', status: 'Pending' },
    { id: 2, title: 'Illegal parking on sidewalk', status: 'Resolved' },
    { id: 3, title: 'Fire hydrant blocked', status: 'In Progress' }
  ];

  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>My Reports</h2>
        <p style={{ marginBottom: '1rem', color: '#555' }}>
          Showing reports submitted by <strong>{user?.user?.firstName || user?.user?.email}</strong>:
        </p>

        {reports.map((report) => (
          <div
            key={report.id}
            style={{
              background: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{report.title}</strong>
            <StatusBadge status={report.status} />
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
