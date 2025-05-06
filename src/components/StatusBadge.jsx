export default function StatusBadge({ status }) {
  const colorMap = {
    Pending: '#ffc107',
    Resolved: '#28a745',
    'In Progress': '#17a2b8'
  };

  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: colorMap[status] || '#6c757d',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: 'bold'
      }}
    >
      {status}
    </span>
  );
}
