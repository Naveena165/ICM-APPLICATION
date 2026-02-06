/**
 * Plan Performance Report Component
 * 
 * Displays performance metrics for each compensation plan including:
 * - Participants count
 * - Total sales
 * - Total earnings
 * - Average earnings per participant
 * - ROI percentage
 * 
 * Requirements: 3.4.1 - Plan Performance report
 */

import React, { useState, useEffect } from 'react';
import ReportViewer from '../../components/reports/ReportViewer';
import { mockPlans } from '../data/mockPlans';
import { mockPayees } from '../../payees/data/mockPayees';
import { mockTransactions } from '../../data/mockTransactions';
import { mockEarnings } from '../../data/mockEarnings';

/**
 * Calculate plan performance metrics
 * @param {Array} plans - Array of plans
 * @param {Array} payees - Array of payees
 * @param {Array} transactions - Array of transactions
 * @param {Array} earnings - Array of earnings
 * @param {Object} filters - Applied filters
 * @returns {Array} Plan performance data
 */
function calculatePlanPerformance(plans, payees, transactions, earnings, filters) {
  // Filter active plans
  let filteredPlans = plans.filter(plan => plan.status === 'Active');

  // Apply plan filter if specified
  if (filters.plan && filters.plan.length > 0) {
    filteredPlans = filteredPlans.filter(plan => filters.plan.includes(plan.id));
  }

  return filteredPlans.map(plan => {
    // Get payees on this plan
    const planPayees = payees.filter(payee => payee.planId === plan.id);
    
    // Get transactions for this plan
    const planTransactions = transactions.filter(txn => 
      txn.planId === plan.id && txn.status === 'Credited'
    );
    
    // Get earnings for this plan
    const planEarnings = earnings.filter(earning => earning.planId === plan.id);

    // Calculate metrics
    const totalSales = planTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalEarnings = planEarnings.reduce((sum, earning) => sum + earning.totalEarnings, 0);
    const participantCount = planPayees.length;
    const avgEarnings = participantCount > 0 ? totalEarnings / participantCount : 0;
    
    // Calculate ROI: (Revenue - Commission) / Commission * 100
    const roi = totalEarnings > 0 ? ((totalSales - totalEarnings) / totalEarnings) * 100 : 0;

    return {
      planId: plan.id,
      planName: plan.name,
      planType: plan.type,
      participants: participantCount,
      totalSales: Math.round(totalSales * 100) / 100,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      avgEarnings: Math.round(avgEarnings * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      attainment: plan.currentPeriod.attainment
    };
  });
}

/**
 * Plan Performance Report Component
 */
const PlanPerformanceReport = () => {
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    const performanceData = calculatePlanPerformance(
      mockPlans,
      mockPayees,
      mockTransactions,
      mockEarnings,
      filters
    );

    setReportData({
      title: 'Plan Performance Report',
      description: 'Performance metrics for each compensation plan',
      columns: [
        { key: 'planName', label: 'Plan Name', sortable: true },
        { key: 'planType', label: 'Type', sortable: true },
        { key: 'participants', label: 'Participants', sortable: true, align: 'right' },
        { key: 'totalSales', label: 'Total Sales', sortable: true, align: 'right', format: 'currency' },
        { key: 'totalEarnings', label: 'Total Earnings', sortable: true, align: 'right', format: 'currency' },
        { key: 'avgEarnings', label: 'Avg Earnings', sortable: true, align: 'right', format: 'currency' },
        { key: 'roi', label: 'ROI %', sortable: true, align: 'right', format: 'percentage' },
        { key: 'attainment', label: 'Attainment %', sortable: true, align: 'right' }
      ],
      rows: performanceData,
      chartType: 'bar',
      chartConfig: {
        xAxis: 'planName',
        yAxis: 'totalEarnings',
        title: 'Total Earnings by Plan'
      }
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (!reportData) {
    return <div>Loading...</div>;
  }

  return (
    <ReportViewer
      reportData={reportData}
      onFilterChange={handleFilterChange}
      reportType="plan-performance"
    />
  );
};

export default PlanPerformanceReport;
