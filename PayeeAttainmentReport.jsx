import React, { useState, useEffect } from 'react';
import ReportViewer from '../../components/reports/ReportViewer';
import { mockPayees } from '../data/mockPayees';
import { getFiltersForReportType } from '../../utils/reportFilterConfig';
import { applyFilters } from '../../utils/reportDataAggregator';
import './PayeeAttainmentReport.css';

/**
 * Payee Attainment Report
 * 
 * Displays each payee's performance against their quota with color coding
 * Requirements: 3.3.3 - Payee Reports
 */
const PayeeAttainmentReport = ({ onDrilldown }) => {
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
      key: 'planName', 
      label: 'Plan', 
      sortable: true,
      align: 'left'
    },
    { 
      key: 'quota', 
      label: 'Quota', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'actualSales', 
      label: 'Actual Sales', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'attainment', 
      label: 'Attainment %', 
      sortable: true,
      align: 'center',
      format: 'attainment' // Custom format for color coding
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
      // Build attainment data from payees
      let rows = mockPayees.map(payee => {
        const attainment = payee.currentPeriod.attainment;
        
        // Determine status based on attainment
        let status = 'On Track';
        let statusColor = 'yellow';
        
        if (attainment >= 100) {
          status = 'Achieved';
          statusColor = 'green';
        } else if (attainment >= 80) {
          status = 'On Track';
          statusColor = 'yellow';
        } else {
          status = 'Below Target';
          statusColor = 'red';
        }

        return {
          id: payee.id,
          name: payee.name,
          role: payee.role,
          region: payee.region.split('-')[0],
          planId: payee.planId,
          planName: payee.planName,
          quota: payee.quota,
          actualSales: payee.currentPeriod.actualSales,
          attainment,
          status,
          statusColor,
          earnings: payee.currentPeriod.earnings
        };
      });

      // Apply filters
      rows = applyFilters(rows, filters, {
        dateField: null,
        regionField: 'region',
        roleField: 'role',
        planField: 'planId',
        payeeField: 'id'
      });

      // Sort by attainment descending
      rows.sort((a, b) => b.attainment - a.attainment);

      // Calculate summary metrics
      const achievedCount = rows.filter(r => r.attainment >= 100).length;
      const onTrackCount = rows.filter(r => r.attainment >= 80 && r.attainment < 100).length;
      const belowTargetCount = rows.filter(r => r.attainment < 80).length;
      const avgAttainment = rows.length > 0
        ? Math.round((rows.reduce((sum, r) => sum + r.attainment, 0) / rows.length) * 10) / 10
        : 0;

      const summary = {
        totalPayees: rows.length,
        achievedCount,
        onTrackCount,
        belowTargetCount,
        avgAttainment,
        totalQuota: rows.reduce((sum, r) => sum + r.quota, 0),
        totalActualSales: rows.reduce((sum, r) => sum + r.actualSales, 0)
      };

      setReportData({
        title: 'Payee Attainment',
        columns,
        rows,
        summary,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading Payee Attainment report:', error);
      setReportData({
        title: 'Payee Attainment',
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
    console.log(`Exporting Payee Attainment report as ${format}`);
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
      reportId="payee-attainment"
      reportTitle="Payee Attainment"
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

export default PayeeAttainmentReport;
