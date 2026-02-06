import React, { useState, useEffect } from 'react';
import PayeeDetail from './PayeeDetail';
import AddPayee from './AddPayee';
import './PayeesList.css';

const PayeesList = () => {
  const [payees, setPayees] = useState([]);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddPayee, setShowAddPayee] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    payeeType: '',
    businessUnit: '',
    region: '',
    eligibilityStatus: ''
  });

  // Mock data for payees
  useEffect(() => {
    const mockPayees = [
      {
        payeeId: 'PAY-001',
        displayName: 'John Smith',
        employeeCode: 'EMP001',
        payeeType: 'Employee',
        role: 'Account Executive',
        businessUnit: 'Sales - West',
        region: 'West Coast',
        status: 'Active',
        eligibility: 'Eligible',
        effectiveStartDate: '2024-01-01',
        email: 'john.smith@company.com',
        phone: '+1-555-0123',
        hireDate: '2024-01-01',
        firstName: 'John',
        lastName: 'Smith',
        jobTitle: 'Senior Account Executive',
        department: 'Sales',
        manager: 'Sarah Johnson',
        baseSalary: 85000,
        targetIncentive: 42500
      },
      {
        payeeId: 'PAY-002',
        displayName: 'Sarah Johnson',
        employeeCode: 'EMP002',
        payeeType: 'Employee',
        role: 'Sales Manager',
        businessUnit: 'Sales - West',
        region: 'West Coast',
        status: 'Active',
        eligibility: 'Eligible',
        effectiveStartDate: '2023-06-15',
        email: 'sarah.johnson@company.com',
        phone: '+1-555-0124',
        hireDate: '2023-06-15',
        firstName: 'Sarah',
        lastName: 'Johnson',
        jobTitle: 'Regional Sales Manager',
        department: 'Sales',
        manager: 'Michael Chen',
        baseSalary: 120000,
        targetIncentive: 60000
      },
      {
        payeeId: 'PAY-003',
        displayName: 'Mike Wilson',
        employeeCode: 'EMP003',
        payeeType: 'Partner',
        role: 'Partner Rep',
        businessUnit: 'Channel Partners',
        region: 'East Coast',
        status: 'Inactive',
        eligibility: 'Not Eligible',
        effectiveStartDate: '2023-03-01',
        email: 'mike.wilson@partner.com',
        phone: '+1-555-0125',
        hireDate: '2023-03-01',
        firstName: 'Mike',
        lastName: 'Wilson',
        jobTitle: 'Channel Partner Representative',
        department: 'Partnerships',
        manager: 'Lisa Davis',
        baseSalary: 0,
        targetIncentive: 25000
      },
      {
        payeeId: 'PAY-004',
        displayName: 'Emily Chen',
        employeeCode: 'EMP004',
        payeeType: 'Employee',
        role: 'SDR',
        businessUnit: 'Sales - East',
        region: 'East Coast',
        status: 'Active',
        eligibility: 'Eligible',
        effectiveStartDate: '2024-02-01',
        email: 'emily.chen@company.com',
        phone: '+1-555-0126',
        hireDate: '2024-02-01',
        firstName: 'Emily',
        lastName: 'Chen',
        jobTitle: 'Sales Development Representative',
        department: 'Sales',
        manager: 'David Rodriguez',
        baseSalary: 55000,
        targetIncentive: 27500
      }
    ];
    setPayees(mockPayees);
  }, []);

  const filteredPayees = payees.filter(payee => {
    return (
      (!filters.search || 
        payee.displayName.toLowerCase().includes(filters.search.toLowerCase()) ||
        payee.payeeId.toLowerCase().includes(filters.search.toLowerCase()) ||
        payee.employeeCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        payee.email.toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (!filters.status || payee.status === filters.status) &&
      (!filters.payeeType || payee.payeeType === filters.payeeType) &&
      (!filters.businessUnit || payee.businessUnit === filters.businessUnit) &&
      (!filters.region || payee.region === filters.region) &&
      (!filters.eligibilityStatus || payee.eligibility === filters.eligibilityStatus)
    );
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      payeeType: '',
      businessUnit: '',
      region: '',
      eligibilityStatus: ''
    });
  };

  const handleAddPayee = (payeeData) => {
    const newPayee = {
      payeeId: payeeData.payeeId,
      displayName: payeeData.displayName,
      employeeCode: payeeData.employeeCode,
      payeeType: payeeData.payeeType,
      role: payeeData.role,
      businessUnit: payeeData.businessUnit,
      region: payeeData.region,
      status: payeeData.status,
      eligibility: payeeData.eligibilityStatus,
      effectiveStartDate: payeeData.eligibilityStartDate,
      email: payeeData.email,
      phone: payeeData.phone,
      hireDate: payeeData.hireDate,
      firstName: payeeData.firstName,
      lastName: payeeData.lastName,
      jobTitle: payeeData.jobTitle,
      department: payeeData.department,
      manager: payeeData.directManager,
      baseSalary: payeeData.baseSalary,
      targetIncentive: payeeData.targetIncentive
    };
    
    setPayees(prev => [...prev, newPayee]);
    setShowAddPayee(false);
  };

  if (showAddPayee) {
    return (
      <AddPayee 
        onBack={() => setShowAddPayee(false)}
        onSave={handleAddPayee}
      />
    );
  }

  if (selectedPayee) {
    return (
      <PayeeDetail 
        payee={selectedPayee} 
        onBack={() => setSelectedPayee(null)}
        onUpdate={(updatedPayee) => {
          setPayees(prev => prev.map(p => p.payeeId === updatedPayee.payeeId ? updatedPayee : p));
          setSelectedPayee(updatedPayee);
        }}
      />
    );
  }

  return (
    <div className="payees-container">
      {/* Header */}
      <div className="payees-header">
        <div className="header-left">
          <h1 className="page-title">Payees</h1>
          <span className="payee-count">{filteredPayees.length} payees</span>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => console.log('Import')}>
            <span className="btn-icon">📤</span> Import
          </button>
          <button className="btn-secondary" onClick={() => console.log('Export')}>
            <span className="btn-icon">📥</span> Export
          </button>
          <button className="btn-primary" onClick={() => setShowAddPayee(true)}>
            <span className="btn-icon">+</span> Add Payee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <button 
            className="filters-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="filter-icon">🔍</span>
            Filters 
            <span className="toggle-icon">{showFilters ? '▼' : '▶'}</span>
          </button>
          {Object.values(filters).some(f => f) && (
            <button className="clear-filters" onClick={clearFilters}>
              <span className="clear-icon">✕</span>
              Clear All
            </button>
          )}
        </div>

        {showFilters && (
          <div className="filters-content">
            <div className="filter-row">
              <div className="filter-group">
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Name, Payee ID, Employee Code, Email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Payee Type</label>
                <select
                  value={filters.payeeType}
                  onChange={(e) => handleFilterChange('payeeType', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Employee">Employee</option>
                  <option value="Partner">Partner</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>
            </div>
            <div className="filter-row">
              <div className="filter-group">
                <label>Business Unit</label>
                <select
                  value={filters.businessUnit}
                  onChange={(e) => handleFilterChange('businessUnit', e.target.value)}
                >
                  <option value="">All Business Units</option>
                  <option value="Sales - West">Sales - West</option>
                  <option value="Sales - East">Sales - East</option>
                  <option value="Channel Partners">Channel Partners</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Region</label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                >
                  <option value="">All Regions</option>
                  <option value="West Coast">West Coast</option>
                  <option value="East Coast">East Coast</option>
                  <option value="Central">Central</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Eligibility</label>
                <select
                  value={filters.eligibilityStatus}
                  onChange={(e) => handleFilterChange('eligibilityStatus', e.target.value)}
                >
                  <option value="">All Eligibility</option>
                  <option value="Eligible">Eligible</option>
                  <option value="Not Eligible">Not Eligible</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="filter-actions">
              <button className="btn-secondary" onClick={clearFilters}>
                <span className="btn-icon">🔄</span>
                Reset
              </button>
              <button className="btn-primary" onClick={() => console.log('Apply filters')}>
                <span className="btn-icon">✓</span>
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payees Table */}
      <div className="payees-table-container">
        <div className="table-wrapper">
          <table className="payees-table">
            <thead>
              <tr>
                <th className="col-payee-id">Payee ID</th>
                <th className="col-display-name">Display Name</th>
                <th className="col-employee-code">Employee Code</th>
                <th className="col-payee-type">Payee Type</th>
                <th className="col-role">Role</th>
                <th className="col-business-unit">Business Unit</th>
                <th className="col-region">Region</th>
                <th className="col-status">Status</th>
                <th className="col-eligibility">Eligibility</th>
                <th className="col-effective-start">Effective Start</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayees.map((payee, index) => (
                <tr key={payee.payeeId || index} className="payee-row" onClick={() => setSelectedPayee(payee)}>
                  <td className="col-payee-id">{payee.payeeId}</td>
                  <td className="col-display-name">{payee.displayName}</td>
                  <td className="col-employee-code">{payee.employeeCode}</td>
                  <td className="col-payee-type">{payee.payeeType}</td>
                  <td className="col-role">{payee.role}</td>
                  <td className="col-business-unit">{payee.businessUnit}</td>
                  <td className="col-region">{payee.region}</td>
                  <td className="col-status">
                    <span className={`status-badge ${payee.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {payee.status}
                    </span>
                  </td>
                  <td className="col-eligibility">
                    <span className={`eligibility-badge ${payee.eligibility === 'Eligible' ? 'eligibility-eligible' : 'eligibility-not-eligible'}`}>
                      {payee.eligibility}
                    </span>
                  </td>
                  <td className="col-effective-start">{payee.effectiveStartDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Dynamic data message */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#64748b',
          fontSize: '14px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <p style={{margin: 0}}>✅ Table populated with {filteredPayees.length} dynamic payee records</p>
        </div>
      </div>
    </div>
  );
};

export default PayeesList;
