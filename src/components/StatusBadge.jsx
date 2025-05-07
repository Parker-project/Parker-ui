import './StatusBadge.css';

export default function StatusBadge({ status = 'pending' }) {
  const statusLower = (status || 'pending').toLowerCase();
  
  const colorMap = {
    pending: '#f1c40f',
    approved: '#2ecc71',
    rejected: '#e74c3c'
  };

  const formatStatus = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getStatusClass = () => {
    const classes = ['status-badge'];
    if (['pending', 'approved', 'rejected'].includes(statusLower)) {
      classes.push(statusLower);
    }
    return classes.join(' ');
  };

  return (
    <span
      className={getStatusClass()}
      style={{
        backgroundColor: colorMap[statusLower] || '#6c757d',
        color: statusLower === 'pending' ? '#000' : 'white'
      }}
    >
      {formatStatus(status)}
    </span>
  );
}
