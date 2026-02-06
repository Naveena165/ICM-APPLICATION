import React, { useState, useEffect } from 'react';
import ReportViewer from '../shared/ReportViewer';
import { mockPayees } from '../../data/mockPayees';
import { mockEarnings } from '../../data/mockEarnings';
import { getFiltersForReportType } from '../utils/reportFilterConfig';
import { applyFilters } from '../utils/reportDataAggregator';

/**
 * Earnings by Role / Region Report
 * 
 * Aggregates earnings by payee role and region, displaying grouped data
 * Requirements: 3.3.2 - Payee Reports
 */
const EarningsByRoleRegionReport = ({ onDrilldown }) => {
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  // Define report columns
  const columns = [
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true,
      drilldown: true,
      align: 'left'
    },
    { 
      key: 'region', 
      label: 'Region', 
      sortable: true,
      drilldown: true,
      align: 'left'
    },
    { 
      key: 'payeeCount', 
      label: 'Payee Count', 
      sortable: true,
      align: 'center'
    },
    { 
      key: 'totalEarnings', 
      label: 'Total Earnings', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'avgEarnings', 
      label: 'Avg Earnings', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'minEarnings', 
      label: 'Min Earnings', 
      sortable: true,
      align: 'right',
      format: 'currency'
    },
    { 
      key: 'maxEarnings', 
      label: 'Max Earnings', 
      sortable: true,
      align: 'right',
      format: 'currency'
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
      // First, aggregate earnings by payee
      const payeeEarningsMap = {};

      mockPayees.forEach(payee => {
        const payeeEarnings = mockEarnings.filter(e => e.payeeId === payee.id);
        const totalEarnings = payeeEarnings.reduce((sum, e) => sum + e.totalEarnings, 0);

        payeeEarningsMap[payee.id] = {
          id: payee.id,
          name: payee.name,
          role: payee.role,
          region: payee.region.split('-')[0], // Extract region prefix
          totalEarnings,
          planId: payee.planId
        };
      });

      // Convert to array and apply filters
      let payeeData = Object.values(payeeEarningsMap);
      payeeData = applyFilters(payeeData, filters, {
        dateField: null,
        regionField: 'region',
        roleField: 'role',
        planField: 'planId',
        payeeField: 'id'
      });

      // Now group by role and region
      const groupedData = {};

      payeeData.forEach(payee => {
        const key = `${payee.role}|${payee.region}`;
        
        if (!groupedData[key]) {
          groupedData[key] = {
            role: payee.role,
            region: payee.region,
            payeeCount: 0,
            totalEarnings: 0,
            earningsArray: []
          };
        }

        groupedData[key].payeeCount++;
        groupedData[key].totalEarnings += payee.totalEarnings;
        groupedData[key].earningsArray.push(payee.totalEarnings);
      });

      // Convert to rows with calculated metrics
      const rows = Object.values(groupedData).map(group => {
        const avgEarnings = group.totalEarnings / group.payeeCount;
        const minEarnings = Math.min(...group.earningsArray);
        const maxEarnings = Math.max(...group.earningsArray);

        return {
          role: group.role,
          region: group.region,
          payeeCount: group.payeeCount,
          totalEarnings: group.totalEarnings,
          avgEarnings: Math.round(avgEarnings * 100) / 100,
          minEarnings,
          maxEarnings
        };
      });

      // Sort by total earnings descending
      rows.sort((a, b) => b.totalEarnings - a.totalEarnings);

      // Calculate summary metrics
      const summary = {
        totalGroups: rows.length,
        totalPayees: rows.reduce((sum, r) => sum + r.payeeCount, 0),
        totalEarnings: rows.reduce((sum, r) => sum + r.totalEarnings, 0),
        avgEarningsPerGroup: rows.length > 0 
          ? Math.round((rows.reduce((sum, r) => sum + r.totalEarnings, 0) / rows.length) * 100) / 100
          : 0
      };

      setReportData({
        title: 'Earnings by Role / Region',
        columns,
        rows,
        summary,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading Earnings by Role / Region report:', error);
      setReportData({
        title: 'Earnings by Role / Region',
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
    console.log(`Exporting Earnings by Role / Region report as ${format}`);
    // TODO: Implement export functionality in task 18
  };

  const handleDrilldown = (row, columnKey) => {
    if ((columnKey === 'role' || columnKey === 'region') && onDrilldown) {
      // Navigate to filtered payee list
      const drilldownFilters = { ...filters };
      
      if (columnKey === 'role') {
        drilldownFilters.role = [row.role];
      } else if (columnKey === 'region') {
        drilldownFilters.region = [row.region];
      }

      onDrilldown({
        reportType: 'earnings-by-payee',
        filters: drilldownFilters,
        context: {
          role: row.role,
          region: row.region
        }
      });
    }
  };

  return (
    <ReportViewer
      reportId="earnings-by-role-region"
      reportTitle="Earnings by Role / Region"
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

export default EarningsByRoleRegionReport;
