import { useState } from 'react';
import './UserManagement.css'; // Reuse same styles

const SecuritySettings = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Mock security settings data
  const securitySettings = [
    { id: 'SEC-001', name: 'Single Sign-On (SSO)', category: 'Authentication', status: 'Enabled', provider: 'Okta', lastModified: '2024-01-20' },
    { id: 'SEC-002', name: 'Multi-Factor Authentication', category: 'Authentication', status: 'Enabled', provider: 'Internal', lastModified: '2024-01-15' },
    { id: 'SEC-003', name: 'Password Policy', category: 'Authentication', status: 'Active', provider: 'Internal', lastModified: '2024-01-10' },
    { id: 'SEC-004', name: 'Session Timeout', category: 'Security', status: 'Active', provider: 'Internal', lastModified: '2024-01-05' },
    { id: 'SEC-005', name: 'IP Whitelisting', category: 'Security', status: 'Disabled', provider: 'Internal', lastModified: '2023-12-20' },
    { id: 'SEC-006', name: 'Audit Logging', category: 'Compliance', status: 'Enabled', provider: 'Internal', lastModified: '2024-01-25' },
    { id: 'SEC-007', name: 'Data Encryption', category: 'Security', status: 'Enabled', provider: 'AWS KMS', lastModified: '2024-01-18' },
    { id: 'SEC-008', name: 'GDPR Compliance', category: 'Compliance', status: 'Active', provider: 'Internal', lastModified: '2024-01-12' }
  ];

  const filteredSettings = securitySettings.filter(setting => {
    const matchesSearch = setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || setting.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConfigureSetting = (settingId) => {
    alert(`Configure setting: ${settingId}`);
  };

  const handleToggleSetting = (settingId) => {
    alert(`Toggle setting: ${settingId}`);
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div className="header-title">
          <h1>Security Settings</h1>
          <p>SSO, audit logs, compliance, and security configuration</p>
        </div>
        <button className="btn-primary" onClick={() => alert('Add Security Setting')}>
          + Add Setting
        </button>
      </div>

      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-value">{securitySettings.length}</div>
          <div className="stat-label">Total Settings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{securitySettings.filter(s => s.status === 'Enabled' || s.status === 'Active').length}</div>
          <div className="stat-label">Active Settings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{securitySettings.filter(s => s.category === 'Authentication').length}</div>
          <div className="stat-label">Authentication</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{securitySettings.filter(s => s.category === 'Compliance').length}</div>
          <div className="stat-label">Compliance</div>
        </div>
      </div>

      <div className="user-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search security settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Authentication">Authentication</option>
          <option value="Security">Security</option>
          <option value="Compliance">Compliance</option>
        </select>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Setting ID</th>
              <th>Setting Name</th>
              <th>Category</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSettings.map(setting => (
              <tr 
                key={setting.id}
                className="clickable-row"
                onClick={() => handleConfigureSetting(setting.id)}
              >
                <td className="user-id">{setting.id}</td>
                <td className="user-name">{setting.name}</td>
                <td>{setting.category}</td>
                <td>{setting.provider}</td>
                <td>
                  <span className={`status-badge ${setting.status.toLowerCase()}`}>
                    {setting.status}
                  </span>
                </td>
                <td>{setting.lastModified}</td>
                <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => handleConfigureSetting(setting.id)} title="Configure">
                    ⚙️
                  </button>
                  <button className="btn-icon" onClick={() => handleToggleSetting(setting.id)} title="Toggle">
                    🔄
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

export default SecuritySettings;
