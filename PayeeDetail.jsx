import React, { useState } from 'react';
import './PayeeDetail.css';

const PayeeDetail = ({ payee, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPayee, setEditedPayee] = useState({ ...payee });

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: '👤' },
    { id: 'classification', label: 'Classification', icon: '🏷️' },
    { id: 'organization', label: 'Organization & Hierarchy', icon: '🏢' },
    { id: 'eligibility', label: 'Eligibility & Plans', icon: '✅' },
    { id: 'quota', label: 'Quota & Targets', icon: '🎯' },
    { id: 'payment', label: 'Payment & Tax Details', icon: '💳' },
    { id: 'history', label: 'History & Audit', icon: '📋' }
  ];

  const handleSave = () => {
    onUpdate(editedPayee);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPayee({ ...payee });
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedPayee(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'status-badge status-active',
      'Inactive': 'status-badge status-inactive',
      'Terminated': 'status-badge status-terminated'
    };
    return <span className={statusClasses[status] || 'status-badge'}>{status}</span>;
  };

  const getEligibilityBadge = (eligibility) => {
    const eligibilityClasses = {
      'Eligible': 'eligibility-badge eligibility-eligible',
      'Not Eligible': 'eligibility-badge eligibility-not-eligible',
      'Pending': 'eligibility-badge eligibility-pending'
    };
    return <span className={eligibilityClasses[eligibility] || 'eligibility-badge'}>{eligibility}</span>;
  };

  const renderBasicInformation = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              value={isEditing ? editedPayee.firstName : payee.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              value={isEditing ? editedPayee.lastName : payee.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Display Name *</label>
            <input
              type="text"
              value={isEditing ? editedPayee.displayName : payee.displayName}
              onChange={(e) => handleFieldChange('displayName', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Payee ID</label>
            <input
              type="text"
              value={payee.id}
              disabled
              className="readonly-field"
            />
          </div>
          <div className="form-group">
            <label>Employee Code *</label>
            <input
              type="text"
              value={isEditing ? editedPayee.employeeCode : payee.employeeCode}
              onChange={(e) => handleFieldChange('employeeCode', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={isEditing ? editedPayee.email : payee.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={isEditing ? editedPayee.phone : payee.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Hire Date *</label>
            <input
              type="date"
              value={isEditing ? editedPayee.hireDate : payee.hireDate}
              onChange={(e) => handleFieldChange('hireDate', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Termination Date</label>
            <input
              type="date"
              value={isEditing ? editedPayee.terminationDate || '' : payee.terminationDate || ''}
              onChange={(e) => handleFieldChange('terminationDate', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Payee Type *</label>
            <select
              value={isEditing ? editedPayee.payeeType : payee.payeeType}
              onChange={(e) => handleFieldChange('payeeType', e.target.value)}
              disabled={!isEditing}
              required
            >
              <option value="Employee">Employee</option>
              <option value="Partner">Partner</option>
              <option value="Contractor">Contractor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Employment Type</label>
            <select
              value={isEditing ? editedPayee.employmentType || 'Full-time' : payee.employmentType || 'Full-time'}
              onChange={(e) => handleFieldChange('employmentType', e.target.value)}
              disabled={!isEditing}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClassification = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3>Job Classification</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              value={isEditing ? editedPayee.jobTitle : payee.jobTitle}
              onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Role *</label>
            <select
              value={isEditing ? editedPayee.role : payee.role}
              onChange={(e) => handleFieldChange('role', e.target.value)}
              disabled={!isEditing}
              required
            >
              <option value="Account Executive">Account Executive</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="SDR">Sales Development Representative</option>
              <option value="Partner Rep">Partner Representative</option>
              <option value="Inside Sales">Inside Sales</option>
              <option value="Field Sales">Field Sales</option>
            </select>
          </div>
          <div className="form-group">
            <label>Department *</label>
            <input
              type="text"
              value={isEditing ? editedPayee.department : payee.department}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Job Level / Grade</label>
            <select
              value={isEditing ? editedPayee.jobLevel || 'L3' : payee.jobLevel || 'L3'}
              onChange={(e) => handleFieldChange('jobLevel', e.target.value)}
              disabled={!isEditing}
            >
              <option value="L1">L1 - Entry Level</option>
              <option value="L2">L2 - Junior</option>
              <option value="L3">L3 - Mid Level</option>
              <option value="L4">L4 - Senior</option>
              <option value="L5">L5 - Lead</option>
              <option value="M1">M1 - Manager</option>
              <option value="M2">M2 - Senior Manager</option>
              <option value="D1">D1 - Director</option>
            </select>
          </div>
          <div className="form-group">
            <label>Cost Center</label>
            <input
              type="text"
              value={isEditing ? editedPayee.costCenter || '' : payee.costCenter || ''}
              onChange={(e) => handleFieldChange('costCenter', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Business Unit *</label>
            <select
              value={isEditing ? editedPayee.businessUnit : payee.businessUnit}
              onChange={(e) => handleFieldChange('businessUnit', e.target.value)}
              disabled={!isEditing}
              required
            >
              <option value="Sales - West">Sales - West</option>
              <option value="Sales - East">Sales - East</option>
              <option value="Channel Partners">Channel Partners</option>
              <option value="Inside Sales">Inside Sales</option>
            </select>
          </div>
          <div className="form-group">
            <label>Classification Effective Date</label>
            <input
              type="date"
              value={isEditing ? editedPayee.classificationEffectiveDate || payee.effectiveStartDate : payee.classificationEffectiveDate || payee.effectiveStartDate}
              onChange={(e) => handleFieldChange('classificationEffectiveDate', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrganization = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3>Geographic & Organizational Structure</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Geography</label>
            <select
              value={isEditing ? editedPayee.geo || 'North America' : payee.geo || 'North America'}
              onChange={(e) => handleFieldChange('geo', e.target.value)}
              disabled={!isEditing}
            >
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
              <option value="Latin America">Latin America</option>
            </select>
          </div>
          <div className="form-group">
            <label>Region *</label>
            <input
              type="text"
              value={isEditing ? editedPayee.region : payee.region}
              onChange={(e) => handleFieldChange('region', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Territory</label>
            <input
              type="text"
              value={isEditing ? editedPayee.territory || '' : payee.territory || ''}
              onChange={(e) => handleFieldChange('territory', e.target.value)}
              disabled={!isEditing}
              placeholder="Multiple territories separated by commas"
            />
          </div>
          <div className="form-group">
            <label>Team</label>
            <input
              type="text"
              value={isEditing ? editedPayee.team || '' : payee.team || ''}
              onChange={(e) => handleFieldChange('team', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Direct Manager</label>
            <input
              type="text"
              value={isEditing ? editedPayee.manager : payee.manager}
              onChange={(e) => handleFieldChange('manager', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Compensation Manager</label>
            <input
              type="text"
              value={isEditing ? editedPayee.compensationManager || payee.manager : payee.compensationManager || payee.manager}
              onChange={(e) => handleFieldChange('compensationManager', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Credit Split %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={isEditing ? editedPayee.creditSplit || 100 : payee.creditSplit || 100}
              onChange={(e) => handleFieldChange('creditSplit', parseInt(e.target.value))}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Org Effective Start Date</label>
            <input
              type="date"
              value={isEditing ? editedPayee.orgEffectiveStart || payee.effectiveStartDate : payee.orgEffectiveStart || payee.effectiveStartDate}
              onChange={(e) => handleFieldChange('orgEffectiveStart', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Org Effective End Date</label>
            <input
              type="date"
              value={isEditing ? editedPayee.orgEffectiveEnd || '' : payee.orgEffectiveEnd || ''}
              onChange={(e) => handleFieldChange('orgEffectiveEnd', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEligibility = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3>Eligibility & Compensation Plans</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Eligibility Status *</label>
            <select
              value={isEditing ? editedPayee.eligibility : payee.eligibility}
              onChange={(e) => handleFieldChange('eligibility', e.target.value)}
              disabled={!isEditing}
              required
            >
              <option value="Eligible">Eligible</option>
              <option value="Not Eligible">Not Eligible</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="form-group">
            <label>Eligibility Start Date</label>
            <input
              type="date"
              value={isEditing ? editedPayee.eligibilityStartDate || payee.effectiveStartDate : payee.eligibilityStartDate || payee.effectiveStartDate}
              onChange={(e) => handleFieldChange('eligibilityStartDate', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Eligibility End Date</label>
            <input
              type="date"
              value={isEditing ? editedPayee.eligibilityEndDate || '' : payee.eligibilityEndDate || ''}
              onChange={(e) => handleFieldChange('eligibilityEndDate', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Incentive Cycle</label>
            <select
              value={isEditing ? editedPayee.incentiveCycle || 'Monthly' : payee.incentiveCycle || 'Monthly'}
              onChange={(e) => handleFieldChange('incentiveCycle', e.target.value)}
              disabled={!isEditing}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Assigned Compensation Plans</label>
            <div className="plan-list">
              <div className="plan-item">
                <span className="plan-name">Base Salary Plan</span>
                <span className="plan-status active">Active</span>
              </div>
              <div className="plan-item">
                <span className="plan-name">Commission Plan - Q1 2024</span>
                <span className="plan-status active">Active</span>
              </div>
              <div className="plan-item">
                <span className="plan-name">Bonus Plan - Annual</span>
                <span className="plan-status pending">Pending</span>
              </div>
            </div>
            {isEditing && (
              <button className="btn-secondary add-plan">
                <span className="btn-icon">+</span> Add Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuota = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3>Compensation & Quota Targets</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Base Salary</label>
            <input
              type="number"
              value={isEditing ? editedPayee.baseSalary : payee.baseSalary}
              onChange={(e) => handleFieldChange('baseSalary', parseInt(e.target.value))}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Target Incentive</label>
            <input
              type="number"
              value={isEditing ? editedPayee.targetIncentive : payee.targetIncentive}
              onChange={(e) => handleFieldChange('targetIncentive', parseInt(e.target.value))}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Monthly Quota</label>
            <input
              type="number"
              value={isEditing ? editedPayee.monthlyQuota || 50000 : payee.monthlyQuota || 50000}
              onChange={(e) => handleFieldChange('monthlyQuota', parseInt(e.target.value))}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Quarterly Quota</label>
            <input
              type="number"
              value={isEditing ? editedPayee.quarterlyQuota || 150000 : payee.quarterlyQuota || 150000}
              onChange={(e) => handleFieldChange('quarterlyQuota', parseInt(e.target.value))}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Annual Quota</label>
            <input
              type="number"
              value={isEditing ? editedPayee.annualQuota || 600000 : payee.annualQuota || 600000}
              onChange={(e) => handleFieldChange('annualQuota', parseInt(e.target.value))}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Override Quota</label>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="overrideQuota"
                checked={isEditing ? editedPayee.overrideQuota || false : payee.overrideQuota || false}
                onChange={(e) => handleFieldChange('overrideQuota', e.target.checked)}
                disabled={!isEditing}
              />
              <label htmlFor="overrideQuota">Allow quota override</label>
            </div>
          </div>
        </div>
        
        <div className="quota-history">
          <h4>Quota History</h4>
          <div className="history-table">
            <div className="history-header">
              <span>Period</span>
              <span>Quota</span>
              <span>Effective Date</span>
              <span>Changed By</span>
            </div>
            <div className="history-row">
              <span>Q1 2024</span>
              <span>$150,000</span>
              <span>2024-01-01</span>
              <span>System</span>
            </div>
            <div className="history-row">
              <span>Q4 2023</span>
              <span>$140,000</span>
              <span>2023-10-01</span>
              <span>Sarah Johnson</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3>Payment & Tax Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={isEditing ? editedPayee.paymentMethod || 'Direct Deposit' : payee.paymentMethod || 'Direct Deposit'}
              onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
              disabled={!isEditing}
            >
              <option value="Direct Deposit">Direct Deposit</option>
              <option value="Check">Check</option>
              <option value="Wire Transfer">Wire Transfer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              value={isEditing ? editedPayee.bankName || '' : payee.bankName || ''}
              onChange={(e) => handleFieldChange('bankName', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              value="****1234"
              disabled
              className="masked-field"
            />
          </div>
          <div className="form-group">
            <label>IFSC / SWIFT Code</label>
            <input
              type="text"
              value={isEditing ? editedPayee.swiftCode || '' : payee.swiftCode || ''}
              onChange={(e) => handleFieldChange('swiftCode', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Tax ID</label>
            <input
              type="text"
              value="***-**-1234"
              disabled
              className="masked-field"
            />
          </div>
          <div className="form-group">
            <label>Supporting Documents</label>
            <div className="file-upload">
              <button className="btn-secondary" disabled={!isEditing}>
                <span className="btn-icon">📎</span> Upload Document
              </button>
              <div className="uploaded-files">
                <div className="file-item">
                  <span>📄 W9_Form.pdf</span>
                  <button className="remove-file">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3>Change History & Audit Trail</h3>
        <div className="audit-log">
          <div className="audit-header">
            <span>Date</span>
            <span>Field</span>
            <span>Old Value</span>
            <span>New Value</span>
            <span>Changed By</span>
            <span>Reason</span>
          </div>
          <div className="audit-row">
            <span>2024-01-15</span>
            <span>Base Salary</span>
            <span>$80,000</span>
            <span>$85,000</span>
            <span>Sarah Johnson</span>
            <span>Annual review increase</span>
          </div>
          <div className="audit-row">
            <span>2024-01-01</span>
            <span>Territory</span>
            <span>West-1</span>
            <span>West-1, West-2</span>
            <span>Michael Chen</span>
            <span>Territory expansion</span>
          </div>
          <div className="audit-row">
            <span>2023-12-01</span>
            <span>Role</span>
            <span>Junior AE</span>
            <span>Account Executive</span>
            <span>Sarah Johnson</span>
            <span>Promotion</span>
          </div>
          <div className="audit-row">
            <span>2023-06-15</span>
            <span>Status</span>
            <span>-</span>
            <span>Active</span>
            <span>System</span>
            <span>Initial creation</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic': return renderBasicInformation();
      case 'classification': return renderClassification();
      case 'organization': return renderOrganization();
      case 'eligibility': return renderEligibility();
      case 'quota': return renderQuota();
      case 'payment': return renderPayment();
      case 'history': return renderHistory();
      default: return renderBasicInformation();
    }
  };

  return (
    <div className="payee-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Payees
        </button>
        <div className="header-actions">
          {isEditing ? (
            <>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                <span className="btn-icon">✏️</span> Edit
              </button>
              <button className="btn-danger">
                <span className="btn-icon">🚫</span> Deactivate
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {payee.displayName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{payee.displayName}</h1>
            <div className="profile-meta">
              <span className="payee-id">{payee.id}</span>
              <span className="role-department">{payee.role} • {payee.department}</span>
            </div>
            <div className="profile-badges">
              {getStatusBadge(payee.status)}
              {getEligibilityBadge(payee.eligibility)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content-container">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PayeeDetail;