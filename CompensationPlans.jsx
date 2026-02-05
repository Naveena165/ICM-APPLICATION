import React, { useState } from 'react';
import './CompensationPlans.css';

const CompensationPlans = () => {
  const [currentView, setCurrentView] = useState('list'); // list, designer, preview
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([
    {
      plan_id: 'PLAN-001',
      plan_name: 'Sales Commission Plan Q1 2024',
      plan_type: 'Sales',
      plan_category: 'Commission',
      frequency: 'Monthly',
      effective_start_date: '2024-01-01',
      effective_end_date: '2024-03-31',
      status: 'Active',
      version_number: '1.0',
      components_count: 3,
      assigned_payees: 25
    },
    {
      plan_id: 'PLAN-002',
      plan_name: 'Manager Bonus Plan 2024',
      plan_type: 'Manager',
      plan_category: 'Bonus',
      frequency: 'Quarterly',
      effective_start_date: '2024-01-01',
      effective_end_date: '2024-12-31',
      status: 'Active',
      version_number: '2.1',
      components_count: 5,
      assigned_payees: 12
    },
    {
      plan_id: 'PLAN-003',
      plan_name: 'Referral Incentive Program',
      plan_type: 'Referral',
      plan_category: 'Incentive',
      frequency: 'Monthly',
      effective_start_date: '2024-01-01',
      effective_end_date: '2024-12-31',
      status: 'Draft',
      version_number: '1.0',
      components_count: 2,
      assigned_payees: 0
    }
  ]);

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setCurrentView('designer');
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setCurrentView('designer');
  };

  const handleClonePlan = (plan) => {
    const clonedPlan = {
      ...plan,
      plan_id: `PLAN-${String(plans.length + 1).padStart(3, '0')}`,
      plan_name: `${plan.plan_name} (Copy)`,
      status: 'Draft',
      version_number: '1.0',
      assigned_payees: 0
    };
    setPlans([...plans, clonedPlan]);
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(p => p.plan_id !== planId));
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPlan(null);
  };

  return (
    <div className="compensation-plans-container">
      {currentView === 'list' && (
        <PlanListView
          plans={plans}
          onCreatePlan={handleCreatePlan}
          onEditPlan={handleEditPlan}
          onClonePlan={handleClonePlan}
          onDeletePlan={handleDeletePlan}
        />
      )}
      
      {currentView === 'designer' && (
        <PlanDesigner
          plan={selectedPlan}
          onBack={handleBackToList}
          onSave={(updatedPlan) => {
            if (selectedPlan) {
              setPlans(plans.map(p => p.plan_id === updatedPlan.plan_id ? updatedPlan : p));
            } else {
              setPlans([...plans, { ...updatedPlan, plan_id: `PLAN-${String(plans.length + 1).padStart(3, '0')}` }]);
            }
            setCurrentView('list');
          }}
        />
      )}
    </div>
  );
};

// Plan List View Component
const PlanListView = ({ plans, onCreatePlan, onEditPlan, onClonePlan, onDeletePlan }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.plan_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || plan.status === filterStatus;
    const matchesType = filterType === 'All' || plan.plan_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="plan-list-view">
      {/* Header */}
      <div className="plan-list-header">
        <div className="header-title">
          <h1>Compensation Plans</h1>
          <p>Manage and configure compensation calculation plans</p>
        </div>
        <button className="btn-primary" onClick={onCreatePlan}>
          + Create New Plan
        </button>
      </div>

      {/* Summary Stats - Moved above filters */}
      <div className="plan-stats">
        <div className="stat-card">
          <div className="stat-value">{plans.length}</div>
          <div className="stat-label">Total Plans</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{plans.filter(p => p.status === 'Active').length}</div>
          <div className="stat-label">Active Plans</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{plans.reduce((sum, p) => sum + p.assigned_payees, 0)}</div>
          <div className="stat-label">Total Payees</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{plans.reduce((sum, p) => sum + p.components_count, 0)}</div>
          <div className="stat-label">Total Components</div>
        </div>
      </div>

      {/* Filters */}
      <div className="plan-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Sales">Sales</option>
          <option value="Manager">Manager</option>
          <option value="Referral">Referral</option>
        </select>
      </div>

      {/* Plans Table */}
      <div className="plans-table-container">
        <table className="plans-table">
          <thead>
            <tr>
              <th>Plan ID</th>
              <th>Plan Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Frequency</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Version</th>
              <th>Components</th>
              <th>Payees</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map(plan => (
              <tr 
                key={plan.plan_id} 
                className="clickable-row"
                onClick={() => onEditPlan(plan)}
                style={{ cursor: 'pointer' }}
              >
                <td className="plan-id">{plan.plan_id}</td>
                <td className="plan-name">{plan.plan_name}</td>
                <td>{plan.plan_type}</td>
                <td>{plan.plan_category}</td>
                <td>{plan.frequency}</td>
                <td>
                  <span className={`status-badge ${plan.status.toLowerCase()}`}>
                    {plan.status}
                  </span>
                </td>
                <td>{plan.effective_start_date}</td>
                <td>{plan.effective_end_date}</td>
                <td>{plan.version_number}</td>
                <td className="text-center">{plan.components_count}</td>
                <td className="text-center">{plan.assigned_payees}</td>
                <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => onClonePlan(plan)} title="Clone">
                    📋
                  </button>
                  <button className="btn-icon" onClick={() => onDeletePlan(plan.plan_id)} title="Delete">
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

// Plan Designer Component
const PlanDesigner = ({ plan, onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState(plan || {
    plan_name: '',
    description: '',
    plan_type: 'Sales',
    plan_category: 'Commission',
    frequency: 'Monthly',
    effective_start_date: '',
    effective_end_date: '',
    status: 'Draft',
    version_number: '1.0',
    auto_assignment_rule: '',
    components: [],
    measures: [],
    formulas: [],
    eligibility_rules: [],
    assigned_payees: 0,
    components_count: 0
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  const tabs = [
    { id: 'details', label: 'Plan Details', icon: '📋' },
    { id: 'components', label: 'Components', icon: '🧩' },
    { id: 'measures', label: 'Measures', icon: '📊' },
    { id: 'formulas', label: 'Formulas', icon: '🧮' },
    { id: 'eligibility', label: 'Eligibility', icon: '✓' },
    { id: 'versioning', label: 'Versioning', icon: '📝' },
    { id: 'preview', label: 'Preview', icon: '👁' }
  ];

  return (
    <div className="plan-designer">
      {/* Header */}
      <div className="designer-header">
        <button className="btn-back" onClick={onBack}>← Back to Plans</button>
        <h1>{plan ? 'Edit Plan' : 'Create New Plan'}</h1>
        <div className="header-actions">
          <button className="btn-secondary">Save as Draft</button>
          <button className="btn-primary" onClick={handleSave}>Save & Activate</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="designer-tabs">
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

      {/* Tab Content */}
      <div className="designer-content">
        {activeTab === 'details' && (
          <PlanDetailsTab formData={formData} onChange={handleInputChange} />
        )}
        {activeTab === 'components' && (
          <ComponentsTab formData={formData} onChange={handleInputChange} />
        )}
        {activeTab === 'measures' && (
          <MeasuresTab formData={formData} onChange={handleInputChange} />
        )}
        {activeTab === 'formulas' && (
          <FormulasTab formData={formData} onChange={handleInputChange} />
        )}
        {activeTab === 'eligibility' && (
          <EligibilityTab formData={formData} onChange={handleInputChange} />
        )}
        {activeTab === 'versioning' && (
          <VersioningTab formData={formData} />
        )}
        {activeTab === 'preview' && (
          <PreviewTab formData={formData} />
        )}
      </div>
    </div>
  );
};

// Plan Details Tab
const PlanDetailsTab = ({ formData, onChange }) => {
  return (
    <div className="tab-content">
      <h2>Plan Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Plan Name *</label>
          <input
            type="text"
            value={formData.plan_name}
            onChange={(e) => onChange('plan_name', e.target.value)}
            placeholder="Enter plan name"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Enter plan description"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Plan Type *</label>
          <select value={formData.plan_type} onChange={(e) => onChange('plan_type', e.target.value)}>
            <option value="Sales">Sales</option>
            <option value="Manager">Manager</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        <div className="form-group">
          <label>Plan Category *</label>
          <select value={formData.plan_category} onChange={(e) => onChange('plan_category', e.target.value)}>
            <option value="Commission">Commission</option>
            <option value="Incentive">Incentive</option>
            <option value="Bonus">Bonus</option>
          </select>
        </div>

        <div className="form-group">
          <label>Frequency *</label>
          <select value={formData.frequency} onChange={(e) => onChange('frequency', e.target.value)}>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annual">Annual</option>
          </select>
        </div>

        <div className="form-group">
          <label>Effective Start Date *</label>
          <input
            type="date"
            value={formData.effective_start_date}
            onChange={(e) => onChange('effective_start_date', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Effective End Date</label>
          <input
            type="date"
            value={formData.effective_end_date}
            onChange={(e) => onChange('effective_end_date', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={formData.status} onChange={(e) => onChange('status', e.target.value)}>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Auto Assignment Rule</label>
          <textarea
            value={formData.auto_assignment_rule}
            onChange={(e) => onChange('auto_assignment_rule', e.target.value)}
            placeholder="Enter SQL or rule expression for auto-assignment"
            rows="3"
          />
        </div>
      </div>
    </div>
  );
};

// Components Tab
const ComponentsTab = ({ formData, onChange }) => {
  const [components, setComponents] = useState(formData.components || []);
  const [showAddModal, setShowAddModal] = useState(false);

  const addComponent = (component) => {
    const newComponents = [...components, { ...component, component_id: `COMP-${components.length + 1}` }];
    setComponents(newComponents);
    onChange('components', newComponents);
    onChange('components_count', newComponents.length);
    setShowAddModal(false);
  };

  const removeComponent = (id) => {
    const newComponents = components.filter(c => c.component_id !== id);
    setComponents(newComponents);
    onChange('components', newComponents);
    onChange('components_count', newComponents.length);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Plan Components</h2>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Component
        </button>
      </div>

      <div className="components-list">
        {components.map((comp, index) => (
          <div key={comp.component_id} className="component-card">
            <div className="component-header">
              <span className="component-sequence">#{index + 1}</span>
              <h3>{comp.component_name}</h3>
              <button className="btn-icon-danger" onClick={() => removeComponent(comp.component_id)}>
                🗑️
              </button>
            </div>
            <div className="component-details">
              <div className="detail-item">
                <span className="label">Type:</span>
                <span className="value">{comp.component_type}</span>
              </div>
              <div className="detail-item">
                <span className="label">Rate Type:</span>
                <span className="value">{comp.rate_type}</span>
              </div>
              <div className="detail-item">
                <span className="label">Credit Source:</span>
                <span className="value">{comp.credit_source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <ComponentModal onClose={() => setShowAddModal(false)} onSave={addComponent} />
      )}
    </div>
  );
};

// Component Modal
const ComponentModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    component_name: '',
    component_type: 'Rate',
    calculation_sequence: 1,
    qualification_rules: '',
    rate_type: 'Flat',
    rate_source: 'Inline',
    credit_source: ''
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Add Component</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Component Name</label>
            <input
              type="text"
              value={formData.component_name}
              onChange={(e) => setFormData({ ...formData, component_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Component Type</label>
            <select
              value={formData.component_type}
              onChange={(e) => setFormData({ ...formData, component_type: e.target.value })}
            >
              <option value="Rate">Rate</option>
              <option value="Tier">Tier</option>
              <option value="Lump">Lump</option>
              <option value="Achievement">Achievement</option>
            </select>
          </div>
          <div className="form-group">
            <label>Rate Type</label>
            <select
              value={formData.rate_type}
              onChange={(e) => setFormData({ ...formData, rate_type: e.target.value })}
            >
              <option value="Flat">Flat</option>
              <option value="Tiered">Tiered</option>
              <option value="Slabs">Slabs</option>
            </select>
          </div>
          <div className="form-group">
            <label>Credit Source</label>
            <input
              type="text"
              value={formData.credit_source}
              onChange={(e) => setFormData({ ...formData, credit_source: e.target.value })}
            />
          </div>
        </div>
        <div className="modal-buttons">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(formData)}>Add Component</button>
        </div>
      </div>
    </div>
  );
};

// Measures Tab
const MeasuresTab = ({ formData, onChange }) => {
  const [measures, setMeasures] = useState(formData.measures || []);

  const addMeasure = () => {
    const newMeasure = {
      measure_id: `MEAS-${measures.length + 1}`,
      measure_name: 'New Measure',
      source_field: '',
      calculation_method: 'Sum',
      threshold_min: 0,
      threshold_max: 0,
      threshold_target: 0,
      performance_cycle: 'Monthly',
      display_unit: 'Currency'
    };
    const newMeasures = [...measures, newMeasure];
    setMeasures(newMeasures);
    onChange('measures', newMeasures);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Performance Measures (KPIs)</h2>
        <button className="btn-primary" onClick={addMeasure}>+ Add Measure</button>
      </div>
      <div className="measures-grid">
        {measures.map(measure => (
          <div key={measure.measure_id} className="measure-card">
            <h4>{measure.measure_name}</h4>
            <p>Method: {measure.calculation_method}</p>
            <p>Cycle: {measure.performance_cycle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Formulas Tab
const FormulasTab = ({ formData, onChange }) => {
  return (
    <div className="tab-content">
      <h2>Formulas & Calculation Logic</h2>
      <div className="formula-editor">
        <textarea
          placeholder="Enter formula expression..."
          rows="10"
          style={{ width: '100%', fontFamily: 'monospace' }}
        />
      </div>
    </div>
  );
};

// Eligibility Tab
const EligibilityTab = ({ formData, onChange }) => {
  const [gateConditions, setGateConditions] = useState(formData.gate_conditions || []);
  const [preConditions, setPreConditions] = useState(formData.pre_conditions || []);
  const [showPreview, setShowPreview] = useState(false);
  const [eligiblePayees, setEligiblePayees] = useState([]);

  // Payee data fields for rule builder
  const payeeFields = [
    { value: 'role', label: 'Role', type: 'text' },
    { value: 'business_unit', label: 'Business Unit', type: 'text' },
    { value: 'region', label: 'Region', type: 'text' },
    { value: 'department', label: 'Department', type: 'text' },
    { value: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'On Leave'] },
    { value: 'plan_assignment', label: 'Plan Assignment', type: 'text' },
    { value: 'job_level', label: 'Job Level', type: 'text' },
    { value: 'grade', label: 'Grade', type: 'text' },
    { value: 'band', label: 'Band', type: 'text' },
    { value: 'hire_date', label: 'Hire Date', type: 'date' },
    { value: 'employment_type', label: 'Employment Type', type: 'select', options: ['Full-Time', 'Part-Time', 'Contract'] },
    { value: 'manager', label: 'Manager', type: 'text' },
    { value: 'custom_attr_1', label: 'Custom Attribute 1', type: 'text' },
    { value: 'custom_attr_2', label: 'Custom Attribute 2', type: 'text' },
    { value: 'custom_attr_3', label: 'Custom Attribute 3', type: 'text' }
  ];

  // Operators
  const operators = [
    { value: '=', label: '= (equals)' },
    { value: '!=', label: '≠ (not equals)' },
    { value: 'in', label: 'in (contains)' },
    { value: 'not_in', label: 'not in (does not contain)' },
    { value: '>', label: '> (greater than)' },
    { value: '<', label: '< (less than)' },
    { value: '>=', label: '≥ (greater than or equal)' },
    { value: '<=', label: '≤ (less than or equal)' }
  ];

  // Mock payee data for preview
  const mockPayees = [
    { id: 'PAY-001', name: 'John Smith', role: 'Sales Rep', region: 'West', department: 'Sales', status: 'Active', business_unit: 'Enterprise', job_level: 'L3' },
    { id: 'PAY-002', name: 'Jane Doe', role: 'Account Manager', region: 'East', department: 'Sales', status: 'Active', business_unit: 'SMB', job_level: 'L4' },
    { id: 'PAY-003', name: 'Bob Johnson', role: 'Sales Rep', region: 'West', department: 'Sales', status: 'On Leave', business_unit: 'Enterprise', job_level: 'L3' },
    { id: 'PAY-004', name: 'Alice Williams', role: 'Manager', region: 'Central', department: 'Sales', status: 'Active', business_unit: 'Enterprise', job_level: 'L5' }
  ];

  const addGateCondition = () => {
    const newRule = {
      id: `gate-${Date.now()}`,
      field: 'role',
      operator: '=',
      value: '',
      connector: 'AND'
    };
    const updated = [...gateConditions, newRule];
    setGateConditions(updated);
    onChange('gate_conditions', updated);
  };

  const addPreCondition = () => {
    const newRule = {
      id: `pre-${Date.now()}`,
      field: 'role',
      operator: '=',
      value: '',
      connector: 'AND'
    };
    const updated = [...preConditions, newRule];
    setPreConditions(updated);
    onChange('pre_conditions', updated);
  };

  const removeRule = (ruleId, isGate) => {
    if (isGate) {
      const updated = gateConditions.filter(r => r.id !== ruleId);
      setGateConditions(updated);
      onChange('gate_conditions', updated);
    } else {
      const updated = preConditions.filter(r => r.id !== ruleId);
      setPreConditions(updated);
      onChange('pre_conditions', updated);
    }
  };

  const updateRule = (ruleId, field, value, isGate) => {
    if (isGate) {
      const updated = gateConditions.map(r => 
        r.id === ruleId ? { ...r, [field]: value } : r
      );
      setGateConditions(updated);
      onChange('gate_conditions', updated);
    } else {
      const updated = preConditions.map(r => 
        r.id === ruleId ? { ...r, [field]: value } : r
      );
      setPreConditions(updated);
      onChange('pre_conditions', updated);
    }
  };

  const evaluateRule = (payee, rule) => {
    const fieldValue = payee[rule.field];
    const ruleValue = rule.value;

    switch (rule.operator) {
      case '=':
        return fieldValue === ruleValue;
      case '!=':
        return fieldValue !== ruleValue;
      case 'in':
        return fieldValue && fieldValue.toLowerCase().includes(ruleValue.toLowerCase());
      case 'not_in':
        return fieldValue && !fieldValue.toLowerCase().includes(ruleValue.toLowerCase());
      case '>':
        return fieldValue > ruleValue;
      case '<':
        return fieldValue < ruleValue;
      case '>=':
        return fieldValue >= ruleValue;
      case '<=':
        return fieldValue <= ruleValue;
      default:
        return false;
    }
  };

  const evaluateRules = (payee, rules) => {
    if (rules.length === 0) return true;

    let result = evaluateRule(payee, rules[0]);
    
    for (let i = 1; i < rules.length; i++) {
      const rule = rules[i];
      const ruleResult = evaluateRule(payee, rule);
      
      if (rules[i - 1].connector === 'AND') {
        result = result && ruleResult;
      } else {
        result = result || ruleResult;
      }
    }
    
    return result;
  };

  const handlePreviewEligibility = () => {
    const results = mockPayees.map(payee => {
      const passesGate = evaluateRules(payee, gateConditions);
      const passesPre = evaluateRules(payee, preConditions);
      const eligible = passesGate && passesPre;
      
      return {
        ...payee,
        eligible,
        reason: !passesGate ? 'Failed Gate Conditions' : !passesPre ? 'Failed Pre-Conditions' : 'Eligible'
      };
    });
    
    setEligiblePayees(results);
    setShowPreview(true);
  };

  const getRuleSummary = (rules) => {
    if (rules.length === 0) return 'No rules defined';
    
    return rules.map((rule, index) => {
      const field = payeeFields.find(f => f.value === rule.field);
      const operator = operators.find(o => o.value === rule.operator);
      const connector = index > 0 ? ` ${rules[index - 1].connector} ` : '';
      
      return `${connector}${field?.label || rule.field} ${operator?.label || rule.operator} "${rule.value}"`;
    }).join(' ');
  };

  const eligibleCount = eligiblePayees.filter(p => p.eligible).length;
  const totalCount = eligiblePayees.length;

  return (
    <div className="tab-content eligibility-tab">
      <div className="eligibility-header">
        <div>
          <h2>Eligibility Rules</h2>
          <p>Define gate conditions and pre-conditions for plan eligibility</p>
        </div>
        <button className="btn-primary" onClick={handlePreviewEligibility}>
          👁 Preview Eligible Payees
        </button>
      </div>

      {/* Gate Conditions Section */}
      <div className="eligibility-section">
        <div className="section-header">
          <div className="section-title">
            <h3>🚪 Gate Conditions</h3>
            <span className="tooltip-icon" title="Gate conditions determine if a payee can enter the plan at all">ℹ️</span>
          </div>
          <button className="btn-secondary btn-sm" onClick={addGateCondition}>
            + Add Gate Condition
          </button>
        </div>

        {gateConditions.length > 0 && (
          <div className="rule-summary">
            <strong>Summary:</strong> {getRuleSummary(gateConditions)}
          </div>
        )}

        <div className="rules-container">
          {gateConditions.map((rule, index) => (
            <RuleBuilder
              key={rule.id}
              rule={rule}
              index={index}
              payeeFields={payeeFields}
              operators={operators}
              onUpdate={(field, value) => updateRule(rule.id, field, value, true)}
              onRemove={() => removeRule(rule.id, true)}
              showConnector={index > 0}
            />
          ))}
          {gateConditions.length === 0 && (
            <div className="empty-state">
              <p>No gate conditions defined. Click "Add Gate Condition" to start.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pre-Conditions Section */}
      <div className="eligibility-section">
        <div className="section-header">
          <div className="section-title">
            <h3>✓ Pre-Conditions</h3>
            <span className="tooltip-icon" title="Additional requirements that must be satisfied before incentive calculation">ℹ️</span>
          </div>
          <button className="btn-secondary btn-sm" onClick={addPreCondition}>
            + Add Pre-Condition
          </button>
        </div>

        {preConditions.length > 0 && (
          <div className="rule-summary">
            <strong>Summary:</strong> {getRuleSummary(preConditions)}
          </div>
        )}

        <div className="rules-container">
          {preConditions.map((rule, index) => (
            <RuleBuilder
              key={rule.id}
              rule={rule}
              index={index}
              payeeFields={payeeFields}
              operators={operators}
              onUpdate={(field, value) => updateRule(rule.id, field, value, false)}
              onRemove={() => removeRule(rule.id, false)}
              showConnector={index > 0}
            />
          ))}
          {preConditions.length === 0 && (
            <div className="empty-state">
              <p>No pre-conditions defined. Click "Add Pre-Condition" to start.</p>
            </div>
          )}
        </div>
      </div>

      {/* Eligibility Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content eligibility-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Eligibility Preview</h3>
              <button className="btn-close" onClick={() => setShowPreview(false)}>✕</button>
            </div>

            <div className="eligibility-stats">
              <div className="stat-item">
                <span className="stat-value">{eligibleCount}</span>
                <span className="stat-label">Eligible Payees</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{totalCount - eligibleCount}</span>
                <span className="stat-label">Excluded Payees</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{totalCount}</span>
                <span className="stat-label">Total Payees</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{totalCount > 0 ? Math.round((eligibleCount / totalCount) * 100) : 0}%</span>
                <span className="stat-label">Eligibility Rate</span>
              </div>
            </div>

            {eligibleCount === 0 && (
              <div className="warning-banner">
                ⚠️ Warning: No payees are eligible with current rules. Plan cannot be activated.
              </div>
            )}

            <div className="preview-table-container">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>Payee ID</th>
                    <th>Payee Name</th>
                    <th>Role</th>
                    <th>Region</th>
                    <th>Status</th>
                    <th>Eligible</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {eligiblePayees.map(payee => (
                    <tr key={payee.id} className={payee.eligible ? 'eligible-row' : 'excluded-row'}>
                      <td>{payee.id}</td>
                      <td>{payee.name}</td>
                      <td>{payee.role}</td>
                      <td>{payee.region}</td>
                      <td>{payee.status}</td>
                      <td>
                        <span className={`eligibility-badge ${payee.eligible ? 'yes' : 'no'}`}>
                          {payee.eligible ? '✓ Yes' : '✕ No'}
                        </span>
                      </td>
                      <td className="reason-cell">{payee.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPreview(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Activation Safeguards */}
      {(gateConditions.length === 0 && preConditions.length === 0) && (
        <div className="info-banner">
          ℹ️ Note: No eligibility rules defined. All payees will be eligible by default.
        </div>
      )}
    </div>
  );
};

// Rule Builder Component
const RuleBuilder = ({ rule, index, payeeFields, operators, onUpdate, onRemove, showConnector }) => {
  const selectedField = payeeFields.find(f => f.value === rule.field);

  return (
    <div className="rule-builder">
      {showConnector && (
        <div className="rule-connector">
          <select
            value={rule.connector}
            onChange={(e) => onUpdate('connector', e.target.value)}
            className="connector-select"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
      )}

      <div className="rule-row">
        <div className="rule-number">{index + 1}</div>

        <select
          value={rule.field}
          onChange={(e) => onUpdate('field', e.target.value)}
          className="rule-field-select"
        >
          {payeeFields.map(field => (
            <option key={field.value} value={field.value}>{field.label}</option>
          ))}
        </select>

        <select
          value={rule.operator}
          onChange={(e) => onUpdate('operator', e.target.value)}
          className="rule-operator-select"
        >
          {operators.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>

        {selectedField?.type === 'select' ? (
          <select
            value={rule.value}
            onChange={(e) => onUpdate('value', e.target.value)}
            className="rule-value-input"
          >
            <option value="">Select value...</option>
            {selectedField.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={selectedField?.type === 'date' ? 'date' : 'text'}
            value={rule.value}
            onChange={(e) => onUpdate('value', e.target.value)}
            placeholder="Enter value..."
            className="rule-value-input"
          />
        )}

        <button className="btn-icon-danger" onClick={onRemove} title="Remove rule">
          🗑️
        </button>
      </div>
    </div>
  );
};

// Versioning Tab
const VersioningTab = ({ formData }) => {
  return (
    <div className="tab-content">
      <h2>Version History</h2>
      <p>Current Version: {formData.version_number}</p>
    </div>
  );
};

// Preview Tab
const PreviewTab = ({ formData }) => {
  return (
    <div className="tab-content">
      <h2>Calculation Preview</h2>
      <p>Simulate sample transactions to preview calculations</p>
    </div>
  );
};

export default CompensationPlans;
