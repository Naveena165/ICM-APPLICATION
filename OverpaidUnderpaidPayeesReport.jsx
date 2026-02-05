import React, { useState, useEffect } from 'react';
import ReportViewer from '../../components/reports/ReportViewer';
import { mockPayees } from '../data/mockPayees';
import { mockEarnings, mockPayments } from '../../data/mockEarnings';
import { getFiltersForReportType } from '../../utils/reportFilterConfig';
import { applyFilters } from '../../utils/reportDataAggregator';

/**
 * Overpaid / Underpaid Payees Report
 * 
 * Identifies payees with significant variance between expected and actual payments
 * Requirements: 3.3.5 - Payee Reports
 */
const OverpaidUnderpaidPayeesReport = ({ onDrilldown, varianceThreshold = 100 }) => {
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(varianceThreshold);

  // Define report columns
  const columns = [
    { 
      key: 'name', 
      label: 'Payee Name', 
      sortable: true,
      drilldown: true,
      align: 'left'
    },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true,
      align: 'left'
    },
    { 
      key: 'region', 
      label: 'Region', 
      sortable: true,
      align: 'left'
    },
    { 
      key: 'expectedEarnings', 
      label: 'Expected Earnings', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'actualPayments', 
      label: 'Actual Payments', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'variance', 
      label: 'Variance', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'variancePercent', 
      label: 'Variance %', 
      sortable: true,
      align: 'center'
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      align: 'center',
      format: 'badge'
    }
  ];

  // Get available filters for this report type
  const availableFilters = getFiltersForReportType('payee');

  // Load and aggregate report data
  useEffect(() => {
    loadReportData();
  }, [filters, threshold]);

  const loadReportData = () => {
    setLoading(true);

    try {
      // Calculate variance for each payee
      const payeeVariances = mockPayees.map(payee => {
        // Get total earnings for this payee
        const payeeEarnings = mockEarnings.filter(e => e.payeeId === payee.id);
        const expectedEarnings = payeeEarnings.reduce((sum, e) => sum + e.totalEarnings, 0);

        // Get total payments for this payee
        const payeePayments = mockPayments.filter(p => p.payeeId === payee.id);
        const actualPayments = payeePayments.reduce((sum, p) => sum + p.amount, 0);

        // Calculate variance
        const variance = actualPayments - expectedEarnings;
        const variancePercent = expectedEarnings !== 0 
          ? Math.round((variance / expectedEarnings) * 1000) / 10
          : 0;

        // Determine status
        let status = 'Balanced';
        let statusColor = 'green';
        
        if (variance > threshold) {
          status = 'Overpaid';
          statusColor = 'red';
        } else if (variance < -threshold) {
          status = 'Underpaid';
          statusColor = 'yellow';
        }

        return {
          id: payee.id,
          name: payee.name,
          role: payee.role,
          region: payee.region.split('-')[0],
          planId: payee.planId,
          expectedEarnings,
          actualPayments,
          variance,
          variancePercent,
          status,
          statusColor
        };
      });

      // Filter to show only significant variances
      let rows = payeeVariances.filter(p => Math.abs(p.variance) >= threshold);

      // Apply additional filters
      rows = applyFilters(rows, filters, {
        dateField: null,
        regionField: 'region',
        roleField: 'role',
        planField: 'planId',
        payeeField: 'id'
      });

      // Sort by absolute variance descending
      rows.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));

      // Calculate summary metrics
      const overpaidCount = rows.filter(r => r.variance > 0).length;
      const underpaidCount = rows.filter(r => r.variance < 0).length;
      const totalOverpaid = rows
        .filter(r => r.variance > 0)
        .reduce((sum, r) => sum + r.variance, 0);
      const totalUnderpaid = Math.abs(rows
        .filter(r => r.variance < 0)
        .reduce((sum, r) => sum + r.variance, 0));

      const summary = {
        totalPayeesWithVariance: rows.length,
        overpaidCount,
        underpaidCount,
        totalOverpaid,
        totalUnderpaid,
        netVariance: totalOverpaid - totalUnderpaid,
        threshold
      };

      setReportData({
        title: 'Overpaid / Underpaid Payees',
        columns,
        rows,
        summary,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading Overpaid / Underpaid Payees report:', error);
      setReportData({
        title: 'Overpaid / Underpaid Payees',
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
    console.log(`Exporting Overpaid / Underpaid Payees report as ${format}`);
    // TODO: Implement export functionality in task 18
  };

  const handleDrilldown = (row, columnKey) => {
    if (columnKey === 'name' && onDrilldown) {
      // Navigate to payee detail view
      onDrilldown({
        reportType: 'payee-detail',
        payeeId: row.id,
        payeeName: row.name,
        filters: { ...filters, payee: [row.id] }
      });
    }
  };

  const handleThresholdChange = (e) => {
    const newThreshold = Number(e.target.value);
    if (!isNaN(newThreshold) && newThreshold >= 0) {
      setThreshold(newThreshold);
    }
  };

  return (
    <div>
      {/* Threshold control */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        background: '#f9fafb', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          Variance Threshold: $
          <input
            type="number"
            value={threshold}
            onChange={handleThresholdChange}
            min="0"
            step="50"
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              width: '120px'
            }}
          />
          <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'normal' }}>
            (Only showing payees with variance ≥ ${threshold.toLocaleString()})
          </span>
        </label>
      </div>

      {/* Summary cards */}
      {reportData && reportData.summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Overpaid Payees
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>
              {reportData.summary.overpaidCount}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              Total: ${reportData.summary.totalOverpaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Underpaid Payees
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
              {reportData.summary.underpaidCount}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              Total: ${reportData.summary.totalUnderpaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Net Variance
            </div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: reportData.summary.netVariance > 0 ? '#ef4444' : reportData.summary.netVariance < 0 ? '#f59e0b' : '#10b981'
            }}>
              ${Math.abs(reportData.summary.netVariance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              {reportData.summary.netVariance > 0 ? 'Overpaid' : reportData.summary.netVariance < 0 ? 'Underpaid' : 'Balanced'}
            </div>
          </div>
        </div>
      )}

      <ReportViewer
        reportId="overpaid-underpaid-payees"
        reportTitle="Overpaid / Underpaid Payees"
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

export default OverpaidUnderpaidPayeesReport;
