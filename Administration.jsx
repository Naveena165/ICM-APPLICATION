import { useState } from 'react';
import './Administration.css';
import UserManagement from './UserManagement';
import RolesPermissions from './RolesPermissions';
import SecuritySettings from './SecuritySettings';
import MultiTenantManagement from './MultiTenantManagement';

const Administration = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or module name
  const [selectedModule, setSelectedModule] = useState(null);

  // Administration modules
  const adminModules = [
    {
      id: 'user-management',
      name: 'User Management',
      icon: '👥',
      description: 'Manage users, invites, and profile settings.',
      component: 'UserManagement'
    },
    {
      id: 'roles-permissions',
      name: 'Roles & Permissions',
      icon: '🔐',
      description: 'Configure RBAC roles and granular access.',
      component: 'RolesPermissions'
    },
    {
      id: 'security-settings',
      name: 'Security Settings',
      icon: '🛡️',
      description: 'SSO, audit logs, compliance, and security.',
      component: 'SecuritySettings'
    },
    {
      id: 'multi-tenant',
      name: 'Multi-Tenant Management',
      icon: '🏢',
      description: 'View and manage tenant organizations.',
      badge: 'Beta',
      component: 'MultiTenantManagement'
    }
  ];

  const handleModuleClick = (moduleId) => {
    const module = adminModules.find(m => m.id === moduleId);
    if (module) {
      setSelectedModule(moduleId);
      setCurrentView('module');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedModule(null);
  };

  // Render individual module component
  const renderModuleComponent = () => {
    const module = adminModules.find(m => m.id === selectedModule);
    if (!module) return null;

    switch (module.component) {
      case 'UserManagement':
        return <UserManagement onBack={handleBackToDashboard} />;
      case 'RolesPermissions':
        return <RolesPermissions onBack={handleBackToDashboard} />;
      case 'SecuritySettings':
        return <SecuritySettings onBack={handleBackToDashboard} />;
      case 'MultiTenantManagement':
        return <MultiTenantManagement onBack={handleBackToDashboard} />;
      default:
        return null;
    }
  };

  // If viewing a specific module, render that component
  if (currentView === 'module') {
    return (
      <div className="administration-container">
        {renderModuleComponent()}
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="administration-container">
      {/* Header - Matching CompensationPlans layout */}
      <div className="admin-header">
        <div className="header-title">
          <h1>Administration</h1>
          <p>System configuration and access control</p>
        </div>
      </div>

      {/* Admin Module Cards - Matching ImportAssistants card style */}
      <div className="admin-modules-grid">
        {adminModules.map(module => (
          <div
            key={module.id}
            className="admin-module-card"
            onClick={() => handleModuleClick(module.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleModuleClick(module.id);
              }
            }}
          >
            <div className="module-icon">{module.icon}</div>
            <div className="module-content">
              <div className="module-header">
                <div className="module-name">{module.name}</div>
                {module.badge && (
                  <span className="module-badge">{module.badge}</span>
                )}
              </div>
              <div className="module-description">{module.description}</div>
            </div>
            <div className="module-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Administration;
