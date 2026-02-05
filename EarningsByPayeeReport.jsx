import React, { useState, useEffect } from 'react';
import ReportViewer from '../../components/reports/ReportViewer';
import { mockPayees } from '../data/mockPayees';
import { mockEarnings, mockPayments } from '../../data/mockEarnings';
import { getFiltersForReportType } from '../../utils/reportFilterConfig';
import { applyFilters } from '../../utils/reportDataAggregator';

/**
 * Earnings by Payee Report
 * 
 * Displays total earnings for each payee with role, region, and payment status
 * Requirements: 3.3.1, 3.3.7 - Payee Reports
 */
const EarningsByPayeeReport = ({ onDrilldown }) => {
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

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
      key: 'totalEarnings', 
      label: 'Total Earnings', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'paidAmount', 
      label: 'Paid', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'pendingAmount', 
      label: 'Pending', 
      sortable: true,
      align: 'right',
      format: 'currency'
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
  }, [filters]);

  const loadReportData = () => {
    setLoading(true);

    try {
      // Aggregate earnings by payee
      const payeeEarningsMap = {};

      mockPayees.forEach(payee => {
        const payeeEarnings = mockEarnings.filter(e => e.payeeId === payee.id);
        const payeePayments = mockPayments.filter(p => p.payeeId === payee.id);

        const totalEarnings = payeeEarnings.reduce((sum, e) => sum + e.totalEarnings, 0);
        const paidAmount = payeePayments
          .filter(p => p.status === 'Paid')
          .reduce((sum, p) => sum + p.amount, 0);
        const pendingAmount = payeePayments
          .filter(p => p.status === 'Pending' || p.status === 'Approved')
          .reduce((sum, p) => sum + p.amount, 0);

        // Determine payment status
        let status = 'Paid';
        if (pendingAmount > 0) {
          status = 'Pending';
        } else if (totalEarnings > paidAmount) {
          status = 'Unpaid';
        }

        payeeEarningsMap[payee.id] = {
          id: payee.id,
          name: payee.name,
          role: payee.role,
          region: payee.region.split('-')[0], // Extract region prefix
          totalEarnings,
          paidAmount,
          pendingAmount,
          status,
          // Additional data for filtering
          planId: payee.planId,
          planName: payee.planName
        };
      });

      // Convert to array
      let rows = Object.values(payeeEarningsMap);

      // Apply filters
      rows = applyFilters(rows, filters, {
        dateField: null, // No date filtering for this aggregated view
        regionField: 'region',
        roleField: 'role',
        planField: 'planId',
        payeeField: 'id'
      });

      // Calculate summary metrics
      const summary = {
        totalPayees: rows.length,
        totalEarnings: rows.reduce((sum, r) => sum + r.totalEarnings, 0),
        totalPaid: rows.reduce((sum, r) => sum + r.paidAmount, 0),
        totalPending: rows.reduce((sum, r) => sum + r.pendingAmount, 0)
      };

      setReportData({
        title: 'Earnings by Payee',
        columns,
        rows,
        summary,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading Earnings by Payee report:', error);
      setReportData({
        title: 'Earnings by Payee',
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
    console.log(`Exporting Earnings by Payee report as ${format}`);
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

  return (
    <ReportViewer
      reportId="earnings-by-payee"
      reportTitle="Earnings by Payee"
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
  );
};

export default EarningsByPayeeReport;
