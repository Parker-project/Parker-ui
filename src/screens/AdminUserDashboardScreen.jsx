import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserRole } from '../utils/api'; 
import './InspectorScreen.css';

//

const AdminUserDashboardScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('ALL');
//   const [editingReportId, setEditingReportId] = useState(null);



  useEffect(() => {
    filterReports();
  }, [users, selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching usres:', err);
      setError(err.message || 'Failed to load uses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (selectedRole === 'ALL') {
        setFilteredUsers(users);
    } else {
        setFilteredUsers(users.filter(u => u.role === selectedRole));
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setUpdating(userId);
      await updateUserRole(userId, newRole);
      const updatedUsers = users.map(u =>
        u._id === userId ? { ...u, role: newRole } : u
      );
      setUsers(updatedUsers); // triggers re-filtering
    } catch (err) {
      console.error('Error updating report status:', err);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };
  

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const renderRoleBadge = (role) => {
    const lower = role.toLowerCase();
    return <span className={`status-badge ${lower}`}>{role}</span>;
  };
  const navigate = useNavigate();
  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn back-btn" onClick={() => navigate(-1)}>⬅</button>
        <h2>Users List</h2>
      </div>

      <div className="dashboard-button-container">
        <select className="dashboard-btn" value={selectedRole} onChange={handleRoleChange}>
          <option value="ALL">All Users</option>
          <option value="user">User</option>
          <option value="inspector">Inspector</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading users...</div>
      ) : error ? (
        <div className="error-state">
          {error}
          <button className="retry-btn" onClick={fetchUsers}>Retry</button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>No users found for selected status.</p>
        </div>
      ) : (
        <div className="reports-list">
          {filteredUsers.map((user, index) => (
            <div
            className={`report-card ${editingUserId === user._id ? 'selected' : ''}`}
            key={user._id}
            onClick={() => setEditingUserId(user._id)}
            style={{ cursor: 'pointer' }}
            >
              <div className="report-title">
                #{index +1} — {user.firstName} {user.lastName}
              </div>
              <div className="report-details">
                <strong>email:</strong> {user.email}
              </div>
              <div className="report-details">
                <strong>Role:</strong>{' '}
                {editingUserId === user._id ? (
                  <select
                    value={user.role}
                    onChange={async (e) => {
                      const newRole = e.target.value;
                      if (newRole !== user.role) {
                        await handleUpdateRole(user._id, newRole);
                      }
                      setEditingUserId(null); // Done editing
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent card click while changing
                    autoFocus
                  >
                    <option value="user">User</option>
                    <option value="inspector">Inspector</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  renderRoleBadge(report.status)
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminUserDashboardScreen;