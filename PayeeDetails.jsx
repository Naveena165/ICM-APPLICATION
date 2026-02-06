import React, { useState } from 'react';
import EditPanel from '../../components/EditPanel';

function PayeeDetails({ payee, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditPanel, setShowEditPanel] = useState(false);

  return (
    <div className="payee-details">
      <button className="btn-back" onClick={onBack}>
        ← Back to Payees
      </button>

      <div className="details-card">
        <div className="details-header">
          <div className="profile-section">
            <div className="profile-icon">
              {payee.name.charAt(0)}
            </div>
            <div className="profile-info">
              <h2>{payee.name}</h2>
              <p className="role">{payee.role} • Worker ID: {payee.workerNumber}</p>
              <p className="business-unit">{payee.businessUnit}</p>
              <span className="status-badge active">Active</span>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowEditPanel(true)}>
            Edit Payee
          </button>
        </div>

        <div className="tabs-pills">
          <button 
            className={activeTab === 'overview' ? 'tab-pill active' : 'tab-pill'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'roles' ? 'tab-pill active' : 'tab-pill'}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
          <button 
            className={activeTab === 'transactions' ? 'tab-pill active' : 'tab-pill'}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={activeTab === 'earnings' ? 'tab-pill active' : 'tab-pill'}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </button>
          <button 
            className={activeTab === 'history' ? 'tab-pill active' : 'tab-pill'}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Person Number</label>
                  <p>{payee.personNumber}</p>
                </div>
                <div className="info-item">
                  <label>Worker Number</label>
                  <p>{payee.workerNumber}</p>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <p>{payee.email}</p>
                </div>
                <div className="info-item">
                  <label>Business Unit</label>
                  <p>{payee.businessUnit}</p>
                </div>
                <div className="info-item">
                  <label>Compensation Plan</label>
                  <p>{payee.compensationPlan}</p>
                </div>
                <div className="info-item">
                  <label>Active Start Date</label>
                  <p>{payee.activeStart}</p>
                </div>
                <div className="info-item">
                  <label>Active End Date</label>
                  <p>{payee.activeEnd || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Analyst</label>
                  <p>{payee.analyst || 'Not Assigned'}</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'roles' && (
            <div>
              <h4 style={{marginBottom: '20px', color: '#0f172a'}}>Assigned Roles</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Role Name</th>
                    <th>Compensation Plan</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {(payee.roles || []).map((role, index) => (
                <tr className="role-row" key={index}>
                <td>{role.roleName || 'N/A'}</td>
                <td>{role.compensationPlan || 'N/A'}</td>
                <td>{role.startDate || 'N/A'}</td>
                <td>{role.endDate || 'N/A'}</td>
                <td>
                  <span className={`status-badge status-${(role.status || 'active').toLowerCase()}`}>
                    {role.status || 'Active'}
                  </span>
                </td>
             </tr>
              ))}

                  <tr>
                    <td><strong>TXN-2025-001234</strong></td>
                    <td>12/1/2024</td>
                    <td>New Sale</td>
                    <td>ABC Corporation</td>
                    <td>Wireless Plan Premium</td>
                    <td>$2,500.00</td>
                    <td>$250.00</td>
                    <td><span className="status-badge active">Approved</span></td>
                  </tr>
                  <tr>
                    <td><strong>TXN-2025-001235</strong></td>
                    <td>12/2/2024</td>
                    <td>Renewal</td>
                    <td>XYZ Industries</td>
                    <td>Wireless Plan Standard</td>
                    <td>$1,800.00</td>
                    <td>$180.00</td>
                    <td><span className="status-badge active">Approved</span></td>
                  </tr>
                  <tr>
                    <td><strong>TXN-2025-001236</strong></td>
                    <td>12/3/2024</td>
                    <td>Upgrade</td>
                    <td>Tech Solutions Ltd</td>
                    <td>Wireless Plan Enterprise</td>
                    <td>$4,200.00</td>
                    <td>$420.00</td>
                    <td><span style={{background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>Pending</span></td>
                  </tr>
                  <tr>
                    <td><strong>TXN-2025-001237</strong></td>
                    <td>12/4/2024</td>
                    <td>New Sale</td>
                    <td>Global Enterprises</td>
                    <td>Wireless Plan Premium</td>
                    <td>$3,100.00</td>
                    <td>$310.00</td>
                    <td><span className="status-badge active">Approved</span></td>
                  </tr>
               </tbody>
              </table>
            </div>
          )}
          {activeTab === 'earnings' && (
            <div>
              <div style={{marginBottom: '30px'}}>
                <h4 style={{marginBottom: '20px', color: '#0f172a'}}>Earnings Summary</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Current Period Earnings</label>
                    <p style={{fontSize: '24px', color: '#2563eb'}}>$1,160.00</p>
                  </div>
                  <div className="info-item">
                    <label>Year-to-Date Earnings</label>
                    <p style={{fontSize: '24px', color: '#2563eb'}}>$45,230.00</p>
                  </div>
                  <div className="info-item">
                    <label>Last Payment Date</label>
                    <p>11/30/2024</p>
                  </div>
                  <div className="info-item">
                    <label>Next Payment Date</label>
                    <p>12/31/2024</p>
                  </div>
                </div>
              </div>
              
              <h4 style={{marginBottom: '20px', color: '#0f172a'}}>Payment History</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Payment Period</th>
                    <th>Payment Date</th>
                    <th>Gross Amount</th>
                    <th>Deductions</th>
                    <th>Net Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>November 2024</td>
                    <td>11/30/2024</td>
                    <td>$4,250.00</td>
                    <td>$125.00</td>
                    <td>$4,125.00</td>
                    <td><span className="status-badge active">Paid</span></td>
                  </tr>
                  <tr>
                    <td>October 2024</td>
                    <td>10/31/2024</td>
                    <td>$3,890.00</td>
                    <td>$110.00</td>
                    <td>$3,780.00</td>
                    <td><span className="status-badge active">Paid</span></td>
                  </tr>
                  <tr>
                    <td>September 2024</td>
                    <td>9/30/2024</td>
                    <td>$4,100.00</td>
                    <td>$120.00</td>
                    <td>$3,980.00</td>
                    <td><span className="status-badge active">Paid</span></td>
                  </tr>
                  <tr>
                    <td>August 2024</td>
                    <td>8/31/2024</td>
                    <td>$3,750.00</td>
                    <td>$105.00</td>
                    <td>$3,645.00</td>
                    <td><span className="status-badge active">Paid</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'history' && (
            <div>
              <h4 style={{marginBottom: '20px', color: '#0f172a'}}>Activity History</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Action</th>
                    <th>Field Changed</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                    <th>Changed By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>12/4/2024 10:30 AM</td>
                    <td>Updated</td>
                    <td>Email Address</td>
                    <td>telecom@old.com</td>
                    <td>TELECOM@example.com</td>
                    <td>Admin User</td>
                  </tr>
                  <tr>
                    <td>12/1/2024 2:15 PM</td>
                    <td>Role Assigned</td>
                    <td>Role</td>
                    <td>-</td>
                    <td>Sales Representative</td>
                    <td>System</td>
                  </tr>
                  <tr>
                    <td>11/28/2024 9:00 AM</td>
                    <td>Updated</td>
                    <td>Compensation Plan</td>
                    <td>FY-24 Wireless Plan</td>
                    <td>FY-25 Wireless Plan</td>
                    <td>HR Manager</td>
                  </tr>
                  <tr>
                    <td>11/15/2024 3:45 PM</td>
                    <td>Updated</td>
                    <td>Business Unit</td>
                    <td>East Unit Based Contractors</td>
                    <td>West Unit Based Contractors</td>
                    <td>Admin User</td>
                  </tr>
                  <tr>
                    <td>1/1/2024 8:00 AM</td>
                    <td>Created</td>
                    <td>Payee Record</td>
                    <td>-</td>
                    <td>New Payee</td>
                    <td>System</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showEditPanel && (
        <EditPanel 
          payee={payee} 
          onClose={() => setShowEditPanel(false)} 
        />
      )}
    </div>
  );
}

export default PayeeDetails;
