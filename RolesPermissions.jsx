import { useState } from 'react';
import './UserManagement.css'; // Reuse same styles

const RolesPermissions = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock roles data
  const roles = [
    { id: 'ROLE-001', name: 'Administrator', users: 5, permissions: 45, description: 'Full system access', status: 'Active' },
    { id: 'ROLE-002', name: 'Manager', users: 12, permissions: 28, description: 'Team management access', status: 'Active' },
    { id: 'ROLE-003', name: 'User', users: 45, permissions: 15, description: 'Standard user access', status: 'Active' },
    { id: 'ROLE-004', name: 'Auditor', users: 3, permissions: 10, description: 'Read-only audit access', status: 'Active' }
  ];

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    alert('Create Role functionality');
  };

  const handleEditRole = (roleId) => {
    alert(`Edit role: ${roleId}`);
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div className="header-title">
          <h1>Roles & Permissions</h1>
          <p>Configure RBAC roles and granular access</p>
        </div>
        <button className="btn-primary" onClick={handleCreateRole}>
          + Create Role
        </button>
      </div>

      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-value">{roles.length}</div>
          <div className="stat-label">Total Roles</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{roles.reduce((sum, r) => sum + r.users, 0)}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{roles.reduce((sum, r) => sum + r.permissions, 0)}</div>
          <div className="stat-label">Total Permissions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{roles.filter(r => r.status === 'Active').length}</div>
          <div className="stat-label">Active Roles</div>
        </div>
      </div>

      <div className="user-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Role ID</th>
              <th>Role Name</th>
              <th>Description</th>
              <th>Users</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map(role => (
              <tr 
                key={role.id}
                className="clickable-row"
                onClick={() => handleEditRole(role.id)}
              >
                <td className="user-id">{role.id}</td>
                <td className="user-name">{role.name}</td>
                <td>{role.description}</td>
                <td className="text-center">{role.users}</td>
                <td className="text-center">{role.permissions}</td>
                <td>
                  <span className={`status-badge ${role.status.toLowerCase()}`}>
                    {role.status}
                  </span>
                </td>
                <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => handleEditRole(role.id)} title="Edit">
                    ✏️
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

export default RolesPermissions;
