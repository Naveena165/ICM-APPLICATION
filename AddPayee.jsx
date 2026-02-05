import { useState, useEffect } from 'react';
import './AddPayee.css';

const AddPayee = ({ onBack, onSave }) => {
  console.log('AddPayee component loaded with new vertical navigation');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    displayName: '',
    payeeId: '',
    employeeCode: '',
    email: '',
    phone: '',
    hireDate: '',
    terminationDate: '',
    payeeType: 'Employee',
    status: 'Active',
    
    // Classification
    jobTitle: '',
    role: '',
    department: '',
    jobLevel: '',
    employmentType: 'Full-time',
    costCenter: '',
    businessUnit: '',
    classificationStartDate: '',
    classificationEndDate: '',
    
    // Organization & Hierarchy
    geography: 'NA',
    region: '',
    territory: [],
    team: '',
    directManager: '',
    compensationManager: '',
    creditSplitPercentage: 100,
    orgStartDate: '',
    orgEndDate: '',
    
    // Eligibility & Plans
    eligibilityStatus: 'Eligible',
    eligibilityStartDate: '',
    eligibilityEndDate: '',
    incentiveCycle: 'Monthly',
    assignedPlans: [],
    planStartDate: '',
    planEndDate: '',
    
    // Quota & Targets
    baseSalary: '',
    targetIncentive: '',
    monthlyQuota: '',
    quarterlyQuota: '',
    annualQuota: '',
    quotaOverride: false,
    
    // Payment & Tax
    paymentMethod: 'Payroll',
    bankName: '',
    accountNumber: '',
    swiftCode: '',
    taxId: '',
    documents: [],
    
    // Review
    confirmDetails: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { id: 0, title: 'Basic Information', icon: '👤', required: true },
    { id: 1, title: 'Classification', icon: '🏷️', required: true },
    { id: 2, title: 'Organization & Hierarchy', icon: '🏢', required: true },
    { id: 3, title: 'Eligibility & Plans', icon: '✅', required: true },
    { id: 4, title: 'Quota & Targets', icon: '🎯', required: false },
    { id: 5, title: 'Payment & Tax', icon: '💳', required: false },
    { id: 6, title: 'Review & Confirm', icon: '📋', required: true }
  ];

  // Auto-generate display name and payee ID
  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const displayName = `${formData.firstName} ${formData.lastName}`;
      const payeeId = `PAY-${formData.firstName.substring(0, 3).toUpperCase()}${formData.lastName.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      
      setFormData(prev => ({
        ...prev,
        displayName,
        payeeId: prev.payeeId || payeeId
      }));
    }
  }, [formData.firstName, formData.lastName]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    
    switch (stepIndex) {
      case 0: // Basic Information
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
        break;
        
      case 1: // Classification
        if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.businessUnit) newErrors.businessUnit = 'Business unit is required';
        break;
        
      case 2: // Organization
        if (!formData.region) newErrors.region = 'Region is required';
        if (!formData.directManager) newErrors.directManager = 'Direct manager is required';
        break;
        
      case 3: // Eligibility
        if (!formData.eligibilityStartDate) newErrors.eligibilityStartDate = 'Eligibility start date is required';
        if (formData.eligibilityStatus === 'Eligible' && formData.assignedPlans.length === 0) {
          newErrors.assignedPlans = 'At least one compensation plan must be assigned for eligible payees';
        }
        break;
        
      case 6: // Review
        if (!formData.confirmDetails) newErrors.confirmDetails = 'Please confirm the details are correct';
        break;
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateStep(currentStep);
    
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async (activate = false) => {
    const allRequiredSteps = steps.filter(step => step.required).map(step => step.id);
    const allValid = allRequiredSteps.every(stepId => validateStep(stepId));
    
    if (allValid) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        onSave({ ...formData, status: activate ? 'Active' : 'Draft' });
      } catch (error) {
        console.error('Save failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const canSaveAndActivate = () => {
    const requiredSteps = steps.filter(step => step.required).map(step => step.id);
    return requiredSteps.every(stepId => completedSteps.includes(stepId) || stepId === currentStep);
  };

  const getStepStatus = (stepIndex) => {
    if (completedSteps.includes(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'completed';
    return 'upcoming';
  };

  const renderBasicInformation = () => (
    <div className="step-content">
      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-grid">
          <div className={`form-group ${errors.firstName ? 'has-error' : formData.firstName ? 'has-success' : ''}`}>
            <label>First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          
          <div className={`form-group ${errors.lastName ? 'has-error' : formData.lastName ? 'has-success' : ''}`}>
            <label>Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
          
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => handleFieldChange('displayName', e.target.value)}
              className="auto-generated"
            />
            <small className="help-text">Auto-generated from first and last name</small>
          </div>
          
          <div className="form-group">
            <label>Payee ID</label>
            <input
              type="text"
              value={formData.payeeId}
              onChange={(e) => handleFieldChange('payeeId', e.target.value)}
              className="auto-generated"
            />
            <small className="help-text">Auto-generated, editable before save</small>
          </div>
          
          <div className="form-group">
            <label>Employee Code</label>
            <input
              type="text"
              value={formData.employeeCode}
              onChange={(e) => handleFieldChange('employeeCode', e.target.value)}
            />
          </div>
          
          <div className={`form-group ${errors.email ? 'has-error' : formData.email ? 'has-success' : ''}`}>
            <label>Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Hire Date *</label>
            <input
              type="date"
              value={formData.hireDate}
              onChange={(e) => handleFieldChange('hireDate', e.target.value)}
              className={errors.hireDate ? 'error' : ''}
            />
            {errors.hireDate && <span className="error-message">{errors.hireDate}</span>}
          </div>
          
          <div className="form-group">
            <label>Termination Date</label>
            <input
              type="date"
              value={formData.terminationDate}
              onChange={(e) => handleFieldChange('terminationDate', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Payee Type</label>
            <select
              value={formData.payeeType}
              onChange={(e) => handleFieldChange('payeeType', e.target.value)}
            >
              <option value="Employee">Employee</option>
              <option value="Contractor">Contractor</option>
              <option value="Partner Representative">Partner Representative</option>
              <option value="Channel Representative">Channel Representative</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <input
              type="text"
              value={formData.status}
              disabled
              className="readonly-field"
            />
            <small className="help-text">Default: Active</small>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClassification = () => (
    <div className="step-content">
      <div className="form-section">
        <h3>Job Classification</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
              className={errors.jobTitle ? 'error' : ''}
            />
            {errors.jobTitle && <span className="error-message">{errors.jobTitle}</span>}
          </div>
          
          <div className="form-group">
            <label>Role *</label>
            <select
              value={formData.role}
              onChange={(e) => handleFieldChange('role', e.target.value)}
              className={errors.role ? 'error' : ''}
            >
              <option value="">Select Role</option>
              <option value="AE">Account Executive</option>
              <option value="SDR">Sales Development Representative</option>
              <option value="Manager">Manager</option>
              <option value="Partner Rep">Partner Representative</option>
              <option value="Channel Rep">Channel Representative</option>
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>
          
          <div className="form-group">
            <label>Department *</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              className={errors.department ? 'error' : ''}
            />
            {errors.department && <span className="error-message">{errors.department}</span>}
          </div>
          
          <div className="form-group">
            <label>Job Level / Grade</label>
            <select
              value={formData.jobLevel}
              onChange={(e) => handleFieldChange('jobLevel', e.target.value)}
            >
              <option value="">Select Level</option>
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
            <label>Employment Type</label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleFieldChange('employmentType', e.target.value)}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Cost Center</label>
            <input
              type="text"
              value={formData.costCenter}
              onChange={(e) => handleFieldChange('costCenter', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Business Unit *</label>
            <select
              value={formData.businessUnit}
              onChange={(e) => handleFieldChange('businessUnit', e.target.value)}
              className={errors.businessUnit ? 'error' : ''}
            >
              <option value="">Select Business Unit</option>
              <option value="Sales - West">Sales - West</option>
              <option value="Sales - East">Sales - East</option>
              <option value="Channel Partners">Channel Partners</option>
              <option value="Inside Sales">Inside Sales</option>
            </select>
            {errors.businessUnit && <span className="error-message">{errors.businessUnit}</span>}
          </div>
          
          <div className="form-group">
            <label>Classification Effective Start Date</label>
            <input
              type="date"
              value={formData.classificationStartDate}
              onChange={(e) => handleFieldChange('classificationStartDate', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Classification Effective End Date</label>
            <input
              type="date"
              value={formData.classificationEndDate}
              onChange={(e) => handleFieldChange('classificationEndDate', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrganization = () => (
    <div className="step-content">
      <div className="form-section">
        <h3>Organization & Hierarchy</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Geography</label>
            <select
              value={formData.geography}
              onChange={(e) => handleFieldChange('geography', e.target.value)}
            >
              <option value="APAC">APAC</option>
              <option value="EMEA">EMEA</option>
              <option value="NA">North America</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Region *</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => handleFieldChange('region', e.target.value)}
              className={errors.region ? 'error' : ''}
            />
            {errors.region && <span className="error-message">{errors.region}</span>}
          </div>
          
          <div className="form-group">
            <label>Territory</label>
            <input
              type="text"
              value={formData.territory.join(', ')}
              onChange={(e) => handleFieldChange('territory', e.target.value.split(', ').filter(t => t))}
              placeholder="Multiple territories separated by commas"
            />
          </div>
          
          <div className="form-group">
            <label>Team</label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => handleFieldChange('team', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Direct Manager *</label>
            <input
              type="text"
              value={formData.directManager}
              onChange={(e) => handleFieldChange('directManager', e.target.value)}
              className={errors.directManager ? 'error' : ''}
              placeholder="Search for manager..."
            />
            {errors.directManager && <span className="error-message">{errors.directManager}</span>}
          </div>
          
          <div className="form-group">
            <label>Compensation Manager</label>
            <input
              type="text"
              value={formData.compensationManager}
              onChange={(e) => handleFieldChange('compensationManager', e.target.value)}
              placeholder="Search for compensation manager..."
            />
          </div>
          
          <div className="form-group">
            <label>Credit Split Percentage</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.creditSplitPercentage}
              onChange={(e) => handleFieldChange('creditSplitPercentage', parseInt(e.target.value))}
            />
          </div>
          
          <div className="form-group">
            <label>Effective Start Date</label>
            <input
              type="date"
              value={formData.orgStartDate}
              onChange={(e) => handleFieldChange('orgStartDate', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Effective End Date</label>
            <input
              type="date"
              value={formData.orgEndDate}
              onChange={(e) => handleFieldChange('orgEndDate', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEligibility = () => (
    <div className="step-content">
      <div className="form-section">
        <h3>Eligibility & Compensation Plans</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Eligibility Status</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="eligibilityStatus"
                  value="Eligible"
                  checked={formData.eligibilityStatus === 'Eligible'}
                  onChange={(e) => handleFieldChange('eligibilityStatus', e.target.value)}
                />
                <span>Eligible</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="eligibilityStatus"
                  value="Not Eligible"
                  checked={formData.eligibilityStatus === 'Not Eligible'}
                  onChange={(e) => handleFieldChange('eligibilityStatus', e.target.value)}
                />
                <span>Not Eligible</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>Eligibility Start Date *</label>
            <input
              type="date"
              value={formData.eligibilityStartDate}
              onChange={(e) => handleFieldChange('eligibilityStartDate', e.target.value)}
              className={errors.eligibilityStartDate ? 'error' : ''}
            />
            {errors.eligibilityStartDate && <span className="error-message">{errors.eligibilityStartDate}</span>}
          </div>
          
          <div className="form-group">
            <label>Eligibility End Date</label>
            <input
              type="date"
              value={formData.eligibilityEndDate}
              onChange={(e) => handleFieldChange('eligibilityEndDate', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Incentive Cycle</label>
            <select
              value={formData.incentiveCycle}
              onChange={(e) => handleFieldChange('incentiveCycle', e.target.value)}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          
          <div className="form-group full-width">
            <label>Assigned Compensation Plans</label>
            <div className="plan-selector">
              <select
                multiple
                value={formData.assignedPlans}
                onChange={(e) => handleFieldChange('assignedPlans', Array.from(e.target.selectedOptions, option => option.value))}
                disabled={formData.eligibilityStatus === 'Not Eligible'}
                className={errors.assignedPlans ? 'error' : ''}
              >
                <option value="Base Salary Plan">Base Salary Plan</option>
                <option value="Commission Plan - Q1 2024">Commission Plan - Q1 2024</option>
                <option value="Bonus Plan - Annual">Bonus Plan - Annual</option>
                <option value="SPIFFs Plan">SPIFFs Plan</option>
              </select>
              <small className="help-text">Hold Ctrl/Cmd to select multiple plans</small>
            </div>
            {errors.assignedPlans && <span className="error-message">{errors.assignedPlans}</span>}
          </div>
          
          <div className="form-group">
            <label>Plan Effective Start Date</label>
            <input
              type="date"
              value={formData.planStartDate}
              onChange={(e) => handleFieldChange('planStartDate', e.target.value)}
              disabled={formData.eligibilityStatus === 'Not Eligible'}
            />
          </div>
          
          <div className="form-group">
            <label>Plan Effective End Date</label>
            <input
              type="date"
              value={formData.planEndDate}
              onChange={(e) => handleFieldChange('planEndDate', e.target.value)}
              disabled={formData.eligibilityStatus === 'Not Eligible'}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuota = () => (
    <div className="step-content">
      <div className="form-section">
        <h3>Compensation & Quota Targets</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Base Salary</label>
            <input
              type="number"
              value={formData.baseSalary}
              onChange={(e) => handleFieldChange('baseSalary', e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label>Target Incentive</label>
            <input
              type="number"
              value={formData.targetIncentive}
              onChange={(e) => handleFieldChange('targetIncentive', e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label>Monthly Quota</label>
            <input
              type="number"
              value={formData.monthlyQuota}
              onChange={(e) => handleFieldChange('monthlyQuota', e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label>Quarterly Quota</label>
            <input
              type="number"
              value={formData.quarterlyQuota}
              onChange={(e) => handleFieldChange('quarterlyQuota', e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label>Annual Quota</label>
            <input
              type="number"
              value={formData.annualQuota}
              onChange={(e) => handleFieldChange('annualQuota', e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label>Quota Override</label>
            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.quotaOverride}
                  onChange={(e) => handleFieldChange('quotaOverride', e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Allow quota override</span>
              </label>
            </div>
          </div>
        </div>
        
        {(!formData.monthlyQuota && !formData.quarterlyQuota && !formData.annualQuota) && (
          <div className="info-message">
            <span className="info-icon">ℹ️</span>
            <span>Consider setting quota targets for performance tracking</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="step-content">
      <div className="form-section">
        <h3>Payment & Tax Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
            >
              <option value="Payroll">Payroll</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => handleFieldChange('bankName', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="password"
              value={formData.accountNumber}
              onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
              className="masked-field"
              placeholder="Enter account number"
            />
            <small className="help-text">🔒 This field is encrypted and masked</small>
          </div>
          
          <div className="form-group">
            <label>IFSC / SWIFT Code</label>
            <input
              type="text"
              value={formData.swiftCode}
              onChange={(e) => handleFieldChange('swiftCode', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Tax ID / PAN</label>
            <input
              type="password"
              value={formData.taxId}
              onChange={(e) => handleFieldChange('taxId', e.target.value)}
              className="masked-field"
              placeholder="Enter tax ID"
            />
            <small className="help-text">🔒 This field is encrypted and masked</small>
          </div>
          
          <div className="form-group full-width">
            <label>Upload Supporting Documents</label>
            <div className="file-upload-area">
              <div className="upload-zone">
                <span className="upload-icon">📎</span>
                <span>Drag & drop files here or click to browse</span>
                <input type="file" multiple hidden />
              </div>
              <small className="help-text">Supported formats: PDF, JPG, PNG (Max 5MB each)</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="step-content">
      <div className="form-section">
        <h3>Review & Confirm</h3>
        
        <div className="review-summary">
          <div className="summary-section">
            <h4>Basic Information</h4>
            <div className="summary-grid">
              <div><strong>Name:</strong> {formData.displayName || 'Not provided'}</div>
              <div><strong>Email:</strong> {formData.email || 'Not provided'}</div>
              <div><strong>Payee Type:</strong> {formData.payeeType}</div>
              <div><strong>Hire Date:</strong> {formData.hireDate || 'Not provided'}</div>
            </div>
          </div>
          
          <div className="summary-section">
            <h4>Classification</h4>
            <div className="summary-grid">
              <div><strong>Job Title:</strong> {formData.jobTitle || 'Not provided'}</div>
              <div><strong>Role:</strong> {formData.role || 'Not provided'}</div>
              <div><strong>Department:</strong> {formData.department || 'Not provided'}</div>
              <div><strong>Business Unit:</strong> {formData.businessUnit || 'Not provided'}</div>
            </div>
          </div>
          
          <div className="summary-section">
            <h4>Organization</h4>
            <div className="summary-grid">
              <div><strong>Region:</strong> {formData.region || 'Not provided'}</div>
              <div><strong>Direct Manager:</strong> {formData.directManager || 'Not provided'}</div>
              <div><strong>Territory:</strong> {formData.territory.join(', ') || 'Not provided'}</div>
            </div>
          </div>
          
          <div className="summary-section">
            <h4>Eligibility</h4>
            <div className="summary-grid">
              <div><strong>Status:</strong> {formData.eligibilityStatus}</div>
              <div><strong>Start Date:</strong> {formData.eligibilityStartDate || 'Not provided'}</div>
              <div><strong>Assigned Plans:</strong> {formData.assignedPlans.join(', ') || 'None'}</div>
            </div>
          </div>
        </div>
        
        <div className="confirmation-section">
          <label className="confirmation-checkbox">
            <input
              type="checkbox"
              checked={formData.confirmDetails}
              onChange={(e) => handleFieldChange('confirmDetails', e.target.checked)}
              className={errors.confirmDetails ? 'error' : ''}
            />
            <span>I confirm the above details are correct and complete</span>
          </label>
          {errors.confirmDetails && <span className="error-message">{errors.confirmDetails}</span>}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInformation();
      case 1: return renderClassification();
      case 2: return renderOrganization();
      case 3: return renderEligibility();
      case 4: return renderQuota();
      case 5: return renderPayment();
      case 6: return renderReview();
      default: return renderBasicInformation();
    }
  };

  return (
    <div className="add-payee-container">
      {/* Header */}
      <div className="add-payee-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Add New Payee</h1>
            <p>Create a new participant for incentive compensation</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={onBack}>
              Cancel
            </button>
            <button className="btn-secondary" onClick={() => handleSave(false)} disabled={isLoading}>
              <span className="btn-icon">💾</span>
              {isLoading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button 
              className={`btn-primary ${isLoading ? 'loading' : ''}`}
              onClick={() => handleSave(true)}
              disabled={!canSaveAndActivate() || isLoading}
            >
              <span className="btn-icon">✓</span>
              {isLoading ? 'Saving...' : 'Save & Activate'}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Step Progress Indicator */}
      <div className="progress-indicator">
        {steps.map((step, index) => (
          <div key={step.id} className={`progress-step ${getStepStatus(index)}`}>
            <div className={`step-circle ${getStepStatus(index)}`}>
              {getStepStatus(index) === 'completed' ? '✓' : step.icon}
            </div>
            <div className="step-label">{step.title}</div>
            {index < steps.length - 1 && (
              <div className={`step-connector ${completedSteps.includes(index) ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="step-content-container">
        {/* Step Content */}
        <div className="step-content-area">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="step-navigation-buttons">
            <button 
              className="btn-secondary" 
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              ← Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button 
                className="btn-primary" 
                onClick={handleNext}
              >
                Next →
              </button>
            ) : (
              <button 
                className={`btn-primary ${isLoading ? 'loading' : ''}`}
                onClick={() => handleSave(true)}
                disabled={!canSaveAndActivate() || isLoading}
              >
                <span className="btn-icon">✓</span>
                {isLoading ? 'Saving...' : 'Complete & Activate'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <button 
        className="floating-help"
        onClick={() => alert('Need help? Contact support at support@icm.com')}
        title="Get Help"
      >
        ?
      </button>
    </div>
  );
};

export default AddPayee;