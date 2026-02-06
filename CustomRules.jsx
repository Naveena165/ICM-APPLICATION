import React, { useState } from 'react';
import './CustomRules.css';
import {
  RuleHeaderSection,
  LookupKeysSection,
  OutputValuesSection,
  PreviewSection,
  VersioningSection
} from './CustomRulesSections';

const CustomRules = () => {
  const [view, setView] = useState('list'); // 'list' or 'edit'
  const [selectedRule, setSelectedRule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample rules data
  const [rules, setRules] = useState([
    {
      id: 1,
      ruleName: 'Standard Commission Rate',
      category: 'Rate Table',
      lookupCode: 'COMM_RATE_STD',
      effectiveStart: '2024-01-01',
      effectiveEnd: '2024-12-31',
      status: 'Active',
      lastModified: '2024-01-15',
      modifiedBy: 'Admin User',
      priority: 10,
      calculationType: 'Rate',
      version: 1
    },
    {
      id: 2,
      ruleName: 'Premium Territory Multiplier',
      category: 'Tier',
      lookupCode: 'TERR_MULT_PREM',
      effectiveStart: '2024-01-01',
      effectiveEnd: null,
      status: 'Active',
      lastModified: '2024-01-20',
      modifiedBy: 'Admin User',
      priority: 20,
      calculationType: 'Multiplier',
      version: 1
    },
    {
      id: 3,
      ruleName: 'Product Category Mapping',
      category: 'Mapping',
      lookupCode: 'PROD_CAT_MAP',
      effectiveStart: '2024-02-01',
      effectiveEnd: '2024-06-30',
      status: 'Inactive',
      lastModified: '2024-02-05',
      modifiedBy: 'Admin User',
      priority: 5,
      calculationType: 'Text',
      version: 2
    }
  ]);

  const handleAddNew = () => {
    setSelectedRule(null);
    setView('edit');
  };

  const handleClone = (rule) => {
    const clonedRule = {
      ...rule,
      id: rules.length + 1,
      ruleName: `${rule.ruleName} (Copy)`,
      lookupCode: `${rule.lookupCode}_COPY`,
      status: 'Inactive'
    };
    setRules([...rules, clonedRule]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  const handleExport = () => {
    alert('Exporting rules to CSV...');
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.lookupCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || rule.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || rule.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (view === 'edit') {
    return <CustomRuleEditor rule={selectedRule} onBack={() => setView('list')} onSave={(rule) => {
      if (selectedRule) {
        setRules(rules.map(r => r.id === rule.id ? rule : r));
      } else {
        setRules([...rules, { ...rule, id: rules.length + 1 }]);
      }
      setView('list');
    }} />;
  }

  return (
    <div className="custom-rules-container">
      <div className="custom-rules-header">
        <div className="header-left">
          <h1>Custom Rules</h1>
          <p className="subtitle">Configure dynamic business logic for calculation engine</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExport}>
            📥 Export Rules
          </button>
          <button className="btn-primary" onClick={handleAddNew}>
            ➕ Add New Rule
          </button>
        </div>
      </div>

      <div className="custom-rules-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by rule name or lookup code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Rate Table">Rate Table</option>
            <option value="Tier">Tier</option>
            <option value="Mapping">Mapping</option>
            <option value="Flag">Flag</option>
            <option value="Exception">Exception</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="custom-rules-stats">
        <div className="stat-card">
          <div className="stat-value">{rules.length}</div>
          <div className="stat-label">Total Rules</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{rules.filter(r => r.status === 'Active').length}</div>
          <div className="stat-label">Active Rules</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{rules.filter(r => r.category === 'Rate Table').length}</div>
          <div className="stat-label">Rate Tables</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{rules.filter(r => r.category === 'Exception').length}</div>
          <div className="stat-label">Exceptions</div>
        </div>
      </div>

      <div className="custom-rules-table-container">
        <table className="custom-rules-table">
          <thead>
            <tr>
              <th>Rule Name</th>
              <th>Category</th>
              <th>Lookup Code</th>
              <th>Effective Start</th>
              <th>Effective End</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No rules found. Click "Add New Rule" to create one.
                </td>
              </tr>
            ) : (
              filteredRules.map(rule => (
                <tr key={rule.id}>
                  <td>
                    <div className="rule-name-cell">
                      <strong>{rule.ruleName}</strong>
                      <span className="version-badge">v{rule.version}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`category-badge ${rule.category.toLowerCase().replace(' ', '-')}`}>
                      {rule.category}
                    </span>
                  </td>
                  <td><code>{rule.lookupCode}</code></td>
                  <td>{rule.effectiveStart}</td>
                  <td>{rule.effectiveEnd || '—'}</td>
                  <td>
                    <span className={`status-badge ${rule.status.toLowerCase()}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td>{rule.priority}</td>
                  <td>
                    <div className="modified-cell">
                      <div>{rule.lastModified}</div>
                      <small>{rule.modifiedBy}</small>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleClone(rule)} title="Clone">
                        📋
                      </button>
                      <button className="btn-icon" onClick={() => alert('Version history')} title="History">
                        🕐
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => handleDelete(rule.id)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomRules;


// Custom Rule Editor Component
const CustomRuleEditor = ({ rule, onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState('header');
  const [formData, setFormData] = useState(rule || {
    ruleName: '',
    category: 'Rate Table',
    lookupCode: '',
    description: '',
    status: 'Active',
    effectiveStart: '',
    effectiveEnd: '',
    priority: 10,
    calculationType: 'Rate',
    ruleGroup: '',
    lookupKeys: {
      key1: { enabled: false, type: '', value: '' },
      key2: { enabled: false, type: '', value: '' },
      key3: { enabled: false, type: '', value: '' },
      key4: { enabled: false, type: '', value: '' },
      key5: { enabled: false, type: '', value: '' }
    },
    outputValues: {
      rate: '',
      multiplier: '',
      thresholdMin: '',
      thresholdMax: '',
      value: '',
      booleanFlag: false,
      description: ''
    },
    version: 1,
    createdBy: 'Admin User',
    modifiedBy: 'Admin User',
    lastModified: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLookupKeyChange = (keyNum, field, value) => {
    setFormData({
      ...formData,
      lookupKeys: {
        ...formData.lookupKeys,
        [keyNum]: {
          ...formData.lookupKeys[keyNum],
          [field]: value
        }
      }
    });
  };

  const handleOutputChange = (field, value) => {
    setFormData({
      ...formData,
      outputValues: {
        ...formData.outputValues,
        [field]: value
      }
    });
  };

  const handleSave = () => {
    // Validation
    if (!formData.ruleName || !formData.lookupCode || !formData.effectiveStart) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new version if editing existing rule
    const savedRule = rule ? { ...formData, version: formData.version + 1 } : formData;
    onSave(savedRule);
  };

  return (
    <div className="custom-rule-editor">
      <div className="editor-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Rules
        </button>
        <h1>{rule ? 'Edit Rule' : 'Create New Rule'}</h1>
        <div className="editor-actions">
          <button className="btn-secondary" onClick={onBack}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            {rule ? 'Save New Version' : 'Create Rule'}
          </button>
        </div>
      </div>

      <div className="editor-tabs">
        <button 
          className={`tab ${activeTab === 'header' ? 'active' : ''}`}
          onClick={() => setActiveTab('header')}
        >
          📋 Rule Header
        </button>
        <button 
          className={`tab ${activeTab === 'lookup' ? 'active' : ''}`}
          onClick={() => setActiveTab('lookup')}
        >
          🔑 Lookup Keys
        </button>
        <button 
          className={`tab ${activeTab === 'output' ? 'active' : ''}`}
          onClick={() => setActiveTab('output')}
        >
          📊 Output Values
        </button>
        <button 
          className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Preview & Simulation
        </button>
        <button 
          className={`tab ${activeTab === 'version' ? 'active' : ''}`}
          onClick={() => setActiveTab('version')}
        >
          🕐 Versioning
        </button>
      </div>

      <div className="editor-content">
        {activeTab === 'header' && (
          <RuleHeaderSection formData={formData} onChange={handleInputChange} />
        )}
        {activeTab === 'lookup' && (
          <LookupKeysSection formData={formData} onChange={handleLookupKeyChange} />
        )}
        {activeTab === 'output' && (
          <OutputValuesSection formData={formData} onChange={handleOutputChange} calculationType={formData.calculationType} />
        )}
        {activeTab === 'preview' && (
          <PreviewSection formData={formData} />
        )}
        {activeTab === 'version' && (
          <VersioningSection formData={formData} />
        )}
      </div>
    </div>
  );
};
