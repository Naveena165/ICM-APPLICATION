import React, { useState, useEffect } from 'react';
import ReportViewer from '../../components/reports/ReportViewer';
import { mockPayees } from '../data/mockPayees';
import { getFiltersForReportType } from '../../utils/reportFilterConfig';
import { applyFilters } from '../../utils/reportDataAggregator';
import { Line } from 'react-chartjs-2';

/**
 * Payee Commission History Report
 * 
 * Shows historical earnings over time with line chart visualization
 * Requirements: 3.3.4 - Payee Reports
 */
const PayeeCommissionHistoryReport = ({ onDrilldown }) => {
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'

  // Define report columns
  const columns = [
    { 
      key: 'payeeName', 
      label: 'Payee Name', 
      sortable: true,
      drilldown: true,
      align: 'left'
    },
    { 
      key: 'month', 
      label: 'Month', 
      sortable: true,
      align: 'left'
    },
    { 
      key: 'earnings', 
      label: 'Earnings', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'sales', 
      label: 'Sales', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'attainment', 
      label: 'Attainment %', 
      sortable: true,
      align: 'center'
    },
    { 
      key: 'trend', 
      label: 'Trend', 
      sortable: false,
      align: 'center'
    }
  ];

  // Get available filters for this report type
  const availableFilters = getFiltersForReportType('payee');

  // Load and aggregate report data
  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    setLoading(true);

    try {
      // Flatten historical earnings data
      let rows = [];

      mockPayees.forEach(payee => {
        if (payee.historicalEarnings && payee.historicalEarnings.length > 0) {
          payee.historicalEarnings.forEach((history, index) => {
            // Calculate trend compared to previous month
            let trend = '—';
            if (index > 0) {
              const prevEarnings = payee.historicalEarnings[index - 1].earnings;
              const change = ((history.earnings - prevEarnings) / prevEarnings) * 100;
              if (change > 0) {
                trend = `↗ +${change.toFixed(1)}%`;
              } else if (change < 0) {
                trend = `↘ ${change.toFixed(1)}%`;
              } else {
                trend = '→ 0%';
              }
            }

            rows.push({
              payeeId: payee.id,
              payeeName: payee.name,
              role: payee.role,
              region: payee.region.split('-')[0],
              planId: payee.planId,
              month: history.month,
              earnings: history.earnings,
              sales: history.sales,
              attainment: history.attainment,
              trend
            });
          });
        }
      });

      // Apply filters
      rows = applyFilters(rows, filters, {
        dateField: 'month',
        regionField: 'region',
        roleField: 'role',
        planField: 'planId',
        payeeField: 'payeeId'
      });

      // Sort by month descending, then by payee name
      rows.sort((a, b) => {
        const monthCompare = b.month.localeCompare(a.month);
        if (monthCompare !== 0) return monthCompare;
        return a.payeeName.localeCompare(b.payeeName);
      });

      // Calculate summary metrics
      const summary = {
        totalRecords: rows.length,
        totalEarnings: rows.reduce((sum, r) => sum + r.earnings, 0),
        avgEarnings: rows.length > 0 
          ? Math.round((rows.reduce((sum, r) => sum + r.earnings, 0) / rows.length) * 100) / 100
          : 0,
        uniquePayees: new Set(rows.map(r => r.payeeId)).size,
        monthsTracked: new Set(rows.map(r => r.month)).size
      };

      setReportData({
        title: 'Payee Commission History',
        columns,
        rows,
        summary,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading Payee Commission History report:', error);
      setReportData({
        title: 'Payee Commission History',
        columns,
        rows: [],
        summary: {},
        error: 'Failed to load report data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExport = (format) => {
    console.log(`Exporting Payee Commission History report as ${format}`);
    // TODO: Implement export functionality in task 18
  };

  const handleDrilldown = (row, columnKey) => {
    if (columnKey === 'payeeName' && onDrilldown) {
      // Navigate to payee detail view
      onDrilldown({
        reportType: 'payee-detail',
        payeeId: row.payeeId,
        payeeName: row.payeeName,
        filters: { ...filters, payee: [row.payeeId] }
      });
    }
  };

  // Prepare chart data
  const getChartData = () => {
    if (!reportData || !reportData.rows || reportData.rows.length === 0) {
      return null;
    }

    // Group by payee and month
    const payeeData = {};
    reportData.rows.forEach(row => {
      if (!payeeData[row.payeeName]) {
        payeeData[row.payeeName] = [];
      }
      payeeData[row.payeeName].push({
        month: row.month,
        earnings: row.earnings
      });
    });

    // Get unique months sorted
    const months = [...new Set(reportData.rows.map(r => r.month))].sort();

    // Create datasets for each payee (limit to top 10 for readability)
    const topPayees = Object.entries(payeeData)
      .sort((a, b) => {
        const aTotal = a[1].reduce((sum, d) => sum + d.earnings, 0);
        const bTotal = b[1].reduce((sum, d) => sum + d.earnings, 0);
        return bTotal - aTotal;
      })
      .slice(0, 10);

    const colors = [
      '#0bafd5', '#26c07d', '#f59e0b', '#ef4444', '#8b5cf6',
      '#3b82f6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
    ];

    const datasets = topPayees.map(([payeeName, data], index) => {
      const monthlyData = months.map(month => {
        const record = data.find(d => d.month === month);
        return record ? record.earnings : null;
      });

      return {
        label: payeeName,
        data: monthlyData,
        borderColor: colors[index % colors.length],
        backgroundColor: `${colors[index % colors.length]}20`,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });

    return {
      labels: months.map(m => {
        const date = new Date(m + '-01');
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      }),
      datasets
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { size: 11 },
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#6b7280',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          color: '#6b7280',
          font: { size: 11 }
        }
      },
      y: {
        display: true,
        grid: { color: 'rgba(107, 114, 128, 0.1)' },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    }
  };

  const chartData = getChartData();

  return (
    <div>
      {/* View mode toggle */}
      {chartData && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'table' ? '#0bafd5' : '#f3f4f6',
              color: viewMode === 'table' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            📊 Table View
          </button>
          <button
            onClick={() => setViewMode('chart')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'chart' ? '#0bafd5' : '#f3f4f6',
              color: viewMode === 'chart' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            📈 Chart View
          </button>
        </div>
      )}

      {viewMode === 'chart' && chartData ? (
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#374151' }}>
            Commission Trend Over Time
          </h3>
          <div style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : null}

      <ReportViewer
        reportId="payee-commission-history"
        reportTitle="Payee Commission History"
        reportData={reportData}
        reportColumns={columns}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        onDrilldown={handleDrilldown}
        availableFilters={availableFilters}
        enableSelection={false}
        pageSize={25}
      />
    </div>
  );
};

export default PayeeCommissionHistoryReport;
