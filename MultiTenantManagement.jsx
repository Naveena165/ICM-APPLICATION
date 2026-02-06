import { useState } from 'react';
import './UserManagement.css'; // Reuse same styles

const MultiTenantManagement = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTier, setFilterTier] = useState('All');

  // Mock tenant data
  const tenants = [
    { id: 'TEN-001', name: 'Acme Corporation', tier: 'Enterprise', status: 'Active', users: 250, storage: '500 GB', createdDate: '2023-06-15', lastActivity: '2024-01-27' },
    { id: 'TEN-002', name: 'TechStart Inc', tier: 'Professional', status: 'Active', users: 50, storage: '100 GB', createdDate: '2023-09-20', lastActivity: '2024-01-26' },
    { id: 'TEN-003', name: 'Global Solutions Ltd', tier: 'Enterprise', status: 'Active', users: 500, storage: '1 TB', createdDate: '2023-03-10', lastActivity: '2024-01-27' },
    { id: 'TEN-004', name: 'StartupXYZ', tier: 'Starter', status: 'Trial', users: 10, storage: '25 GB', createdDate: '2024-01-15', lastActivity: '2024-01-25' },
    { id: 'TEN-005', name: 'MegaCorp Industries', tier: 'Enterprise', status: 'Suspended', users: 300, storage: '750 GB', createdDate: '2023-01-05', lastActivity: '2023-12-20' }
  ];

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || tenant.status === filterStatus;
    const matchesTier = filterTier === 'All' || tenant.tier === filterTier;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleCreateTenant = () => {
    alert('Create Tenant functionality');
  };

  const handleEditTenant = (tenantId) => {
    alert(`Edit tenant: ${tenantId}`);
  };

  const handleSuspendTenant = (tenantId) => {
    if (window.confirm('Are you sure you want to suspend this tenant?')) {
      alert(`Suspend tenant: ${tenantId}`);
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div className="header-title">
          <h1>Multi-Tenant Management</h1>
          <p>View and manage tenant organizations</p>
        </div>
        <button className="btn-primary" onClick={handleCreateTenant}>
          + Create Tenant
        </button>
      </div>

      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-value">{tenants.length}</div>
          <div className="stat-label">Total Tenants</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{tenants.filter(t => t.status === 'Active').length}</div>
          <div className="stat-label">Active Tenants</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{tenants.reduce((sum, t) => sum + t.users, 0)}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{tenants.filter(t => t.tier === 'Enterprise').length}</div>
          <div className="stat-label">Enterprise Tier</div>
        </div>
      </div>

      <div className="user-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Trial">Trial</option>
          <option value="Suspended">Suspended</option>
        </select>
        <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
          <option value="All">All Tiers</option>
          <option value="Starter">Starter</option>
          <option value="Professional">Professional</option>
          <option value="Enterprise">Enterprise</option>
        </select>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Tenant ID</th>
              <th>Organization Name</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Users</th>
              <th>Storage</th>
              <th>Created Date</th>
              <th>Last Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map(tenant => (
              <tr 
                key={tenant.id}
                className="clickable-row"
                onClick={() => handleEditTenant(tenant.id)}
              >
                <td className="user-id">{tenant.id}</td>
                <td className="user-name">{tenant.name}</td>
                <td>{tenant.tier}</td>
                <td>
                  <span className={`status-badge ${tenant.status.toLowerCase()}`}>
                    {tenant.status}
                  </span>
                </td>
                <td className="text-center">{tenant.users}</td>
                <td>{tenant.storage}</td>
                <td>{tenant.createdDate}</td>
                <td>{tenant.lastActivity}</td>
                <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => handleEditTenant(tenant.id)} title="Edit">
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleSuspendTenant(tenant.id)} title="Suspend">
                    ⏸️
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

export default MultiTenantManagement;
