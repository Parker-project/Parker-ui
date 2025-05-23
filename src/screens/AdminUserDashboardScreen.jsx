import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserRole, deleteUser } from '../utils/api'; 
import './AdminScreens.css';

//

const AdminUserDashboardScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [editingUserId, setEditingUserId] = useState(null);
  const [updating, setUpdating] = useState(null);



  useEffect(() => {
    filterUsers();
  }, [users, selectedRole]);

  useEffect(() => {
    fetchUsers();
    console.log('Fetching users...', users);
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      console.log('Fetched users:', data);
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
        console.log('Filtering users by ALL', users);
        setFilteredUsers(users);
    } else {
        setFilteredUsers(users.filter(u => u.role === selectedRole));
    }
  };

  const handleUpdateUser = async (userId, newRole) => {
    try {
      console.log('Updating user:', userId, newRole);
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
      setEditingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;
  
    try {
      setUpdating(userId);
      await deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user.');
    } finally {
      setUpdating(null);
      setEditingUserId(null);
    }
  };
  

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const renderRoleBadge = (role) => {
    const lower = role.toLowerCase();
    return <span className={`role-badge ${lower}`}>{role}</span>;
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
                  updating === user._id ? (
                    <span>Updating...</span>
                  ) : (
                    <>
                    <select
                      value={user.role}
                      onChange={async (e) => {
                        const newRole = e.target.value;
                        if (newRole !== user.role) {
                          await handleUpdateUser(user._id, newRole);
                        }
                        setEditingUserId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    >
                      <option value="user">User</option>
                      <option value="inspector">Inspector</option>
                      <option value="admin">Admin</option>
                    </select>
                    
                    {/* Delete button under all text */}
                    <div className="user-actions">
                      <button
                        className="minimal-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user._id);
                        }}
                      >
                        Delete User
                      </button>
                    </div>
                  </>
                  )
                ) : (
                  renderRoleBadge(user.role)
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