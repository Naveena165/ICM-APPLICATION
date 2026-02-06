import { useState } from 'react';
import './UserManagement.css';

const UserManagement = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRole, setFilterRole] = useState('All');

  // Mock user data
  const users = [
    { id: 'USR-001', name: 'John Smith', email: 'john.smith@company.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-27', department: 'IT' },
    { id: 'USR-002', name: 'Jane Doe', email: 'jane.doe@company.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-26', department: 'Sales' },
    { id: 'USR-003', name: 'Bob Johnson', email: 'bob.johnson@company.com', role: 'User', status: 'Active', lastLogin: '2024-01-25', department: 'Finance' },
    { id: 'USR-004', name: 'Alice Williams', email: 'alice.williams@company.com', role: 'User', status: 'Inactive', lastLogin: '2024-01-20', department: 'HR' },
    { id: 'USR-005', name: 'Charlie Brown', email: 'charlie.brown@company.com', role: 'Manager', status: 'Pending', lastLogin: 'Never', department: 'Operations' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleInviteUser = () => {
    alert('Invite User functionality');
  };

  const handleEditUser = (userId) => {
    alert(`Edit user: ${userId}`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      alert(`Delete user: ${userId}`);
    }
  };

  return (
    <div className="user-management-container">
      {/* Header - Matching CompensationPlans */}
      <div className="user-management-header">
        <div className="header-title">
          <h1>User Management</h1>
          <p>Manage users, invites, and profile settings</p>
        </div>
        <button className="btn-primary" onClick={handleInviteUser}>
          + Invite User
        </button>
      </div>

      {/* Summary Stats - Matching CompensationPlans */}
      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => u.status === 'Active').length}</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => u.status === 'Pending').length}</div>
          <div className="stat-label">Pending Invites</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => u.role === 'Admin').length}</div>
          <div className="stat-label">Administrators</div>
        </div>
      </div>

      {/* Filters - Matching CompensationPlans */}
      <div className="user-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="User">User</option>
        </select>
      </div>

      {/* Users Table - Matching CompensationPlans table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr 
                key={user.id}
                className="clickable-row"
                onClick={() => handleEditUser(user.id)}
              >
                <td className="user-id">{user.id}</td>
                <td className="user-name">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.department}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => handleEditUser(user.id)} title="Edit">
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleDeleteUser(user.id)} title="Delete">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
