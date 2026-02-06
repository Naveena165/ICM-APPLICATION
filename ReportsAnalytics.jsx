import { useState } from 'react';
import '../ReportsAnalytics.css';
import useReportFilters from '../hooks/useReportFilters';

// Import individual report components
import ImportedTransactionsReport from '../transaction-reports/ImportedTransactionsReport';
import CreditedTransactionsReport from '../transaction-reports/CreditedTransactionsReport';
import RejectedTransactionsReport from '../transaction-reports/RejectedTransactionsReport';
import AdjustedTransactionsReport from '../transaction-reports/AdjustedTransactionsReport';
import RevenueVsCommissionableReport from '../transaction-reports/RevenueVsCommissionableReport';

const ReportsAnalytics = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or report ID
  const [selectedReportId, setSelectedReportId] = useState(null);

  // Use the filter state management hook
  const {
    filters,
    setFilters
  } = useReportFilters('reports-analytics-dashboard', {
    dateRange: 'current-month'
  });

  // Sample data
  const summaryData = {
    payoutSummary: {
      totalCommissions: '$2.4M',
      change: '+12.5%',
      topRegion: 'North America'
    },
    planPerformance: {
      attainment: '87%',
      achievers: 245,
      underAchievers: 97
    },
    costOfSales: {
      commissionPercent: '5.3%',
      revenue: '$45.2M'
    }
  };

  const reportsData = [
    { id: 1, name: 'Monthly Commission Summary', category: 'Payee Reports', dateRange: 'Jan 2024', records: 342, lastUpdated: '2024-01-25', component: 'ImportedTransactionsReport' },
    { id: 2, name: 'Plan Attainment Analysis', category: 'Plan Reports', dateRange: 'Q1 2024', records: 15, lastUpdated: '2024-01-24', component: 'CreditedTransactionsReport' },
    { id: 3, name: 'Territory Performance', category: 'Territory Reports', dateRange: 'Jan 2024', records: 8, lastUpdated: '2024-01-23', component: 'RejectedTransactionsReport' },
    { id: 4, name: 'Product Sales Commission', category: 'Product Reports', dateRange: 'Jan 2024', records: 156, lastUpdated: '2024-01-22', component: 'AdjustedTransactionsReport' },
    { id: 5, name: 'Payout Reconciliation', category: 'Payout Reports', dateRange: 'Jan 2024', records: 342, lastUpdated: '2024-01-21', component: 'RevenueVsCommissionableReport' }
  ];

  // Filter reports based on search term
  const filteredReports = reportsData.filter(report => {
    const searchTerm = (filters.searchTerm || '').toLowerCase();
    if (!searchTerm) return true;
    
    return (
      report.name.toLowerCase().includes(searchTerm) ||
      report.category.toLowerCase().includes(searchTerm) ||
      report.dateRange.toLowerCase().includes(searchTerm)
    );
  });

  const handleExport = () => {
    alert('Exporting reports...');
  };

  const handleViewReport = (reportId) => {
    const report = reportsData.find(r => r.id === reportId);
    if (report) {
      setSelectedReportId(reportId);
      setCurrentView('report');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedReportId(null);
  };

  const handleExportReport = (reportId) => {
    alert(`Exporting report ${reportId}`);
  };

  // Render individual report component
  const renderReportComponent = () => {
    const report = reportsData.find(r => r.id === selectedReportId);
    if (!report) return null;

    switch (report.component) {
      case 'ImportedTransactionsReport':
        return <ImportedTransactionsReport onBack={handleBackToDashboard} />;
      case 'CreditedTransactionsReport':
        return <CreditedTransactionsReport onBack={handleBackToDashboard} />;
      case 'RejectedTransactionsReport':
        return <RejectedTransactionsReport onBack={handleBackToDashboard} />;
      case 'AdjustedTransactionsReport':
        return <AdjustedTransactionsReport onBack={handleBackToDashboard} />;
      case 'RevenueVsCommissionableReport':
        return <RevenueVsCommissionableReport onBack={handleBackToDashboard} />;
      default:
        return null;
    }
  };

  // If viewing a specific report, render that component
  if (currentView === 'report') {
    return (
      <div className="reports-analytics-container">
        <div className="report-back-button">
          <button className="btn-back" onClick={handleBackToDashboard}>
            ← Back to Reports Dashboard
          </button>
        </div>
        {renderReportComponent()}
      </div>
    );
  }

  return (
    <div className="reports-analytics-container">
      {/* Header with Export button in top right */}
      <div className="reports-header">
        <div className="header-title">
          <h1>Reports & Analytics</h1>
          <p>Analyze compensation trends and performance</p>
        </div>
        <button className="btn-primary" onClick={handleExport}>
          📥 Export All
        </button>
      </div>

      {/* Summary KPI Cards - Above filters */}
      <div className="plan-stats">
        <div className="stat-card">
          <div className="stat-value">{summaryData.payoutSummary.totalCommissions}</div>
          <div className="stat-label">Total Commissions</div>
          <div className="stat-change positive">{summaryData.payoutSummary.change}</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{summaryData.planPerformance.attainment}</div>
          <div className="stat-label">Plan Attainment</div>
          <div className="stat-meta">{summaryData.planPerformance.achievers} achievers</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{summaryData.costOfSales.commissionPercent}</div>
          <div className="stat-label">Cost of Sales</div>
          <div className="stat-meta">Revenue: {summaryData.costOfSales.revenue}</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{reportsData.length}</div>
          <div className="stat-label">Available Reports</div>
          <div className="stat-meta">{summaryData.payoutSummary.topRegion}</div>
        </div>
      </div>

      {/* Search and Filter Panel - Below KPI cards */}
      <div className="plan-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search reports..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          />
        </div>
        <select 
          value={filters.dateRange || 'current-month'} 
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
        >
          <option value="current-month">Current Month</option>
          <option value="last-month">Last Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
        <select 
          value={filters.region || 'all'} 
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
        >
          <option value="all">All Regions</option>
          <option value="north">North</option>
          <option value="south">South</option>
          <option value="east">East</option>
          <option value="west">West</option>
        </select>
        <select 
          value={filters.category || 'all'} 
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="payee">Payee Reports</option>
          <option value="plan">Plan Reports</option>
          <option value="transaction">Transaction Reports</option>
        </select>
      </div>

      {/* Report Categories - Removed (as per requirement 3) */}

      {/* Data Table - Matching CompensationPlans table styling */}
      <div className="plans-table-container">
        <table className="plans-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Category</th>
              <th>Date Range</th>
              <th>Records</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map(report => (
              <tr 
                key={report.id}
                className="clickable-row"
                onClick={() => handleViewReport(report.id)}
              >
                <td className="plan-name">{report.name}</td>
                <td>{report.category}</td>
                <td>{report.dateRange}</td>
                <td>{report.records}</td>
                <td>{report.lastUpdated}</td>
                <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => handleViewReport(report.id)} title="View">
                    👁️
                  </button>
                  <button className="btn-icon" onClick={() => handleExportReport(report.id)} title="Export">
                    📥
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

export default ReportsAnalytics;
