/**
 * Plan ROI Report Component
 * 
 * Displays ROI metrics for each compensation plan including:
 * - Revenue generated
 * - Commission paid
 * - ROI percentage
 * - Margin (revenue - commission)
 * 
 * Requirements: 3.4.3 - Plan ROI report
 */

import React, { useState, useEffect } from 'react';
import ReportViewer from '../../components/reports/ReportViewer';
import { mockPlans } from '../data/mockPlans';
import { mockTransactions } from '../../data/mockTransactions';
import { mockEarnings } from '../../data/mockEarnings';

/**
 * Calculate plan ROI metrics
 * @param {Array} plans - Array of plans
 * @param {Array} transactions - Array of transactions
 * @param {Array} earnings - Array of earnings
 * @param {Object} filters - Applied filters
 * @returns {Array} Plan ROI data
 */
function calculatePlanROI(plans, transactions, earnings, filters) {
  // Filter active plans
  let filteredPlans = plans.filter(plan => plan.status === 'Active');

  // Apply plan filter if specified
  if (filters.plan && filters.plan.length > 0) {
    filteredPlans = filteredPlans.filter(plan => filters.plan.includes(plan.id));
  }

  return filteredPlans.map(plan => {
    // Get transactions for this plan
    const planTransactions = transactions.filter(txn => 
      txn.planId === plan.id && txn.status === 'Credited'
    );
    
    // Get earnings for this plan
    const planEarnings = earnings.filter(earning => earning.planId === plan.id);

    // Calculate metrics
    const revenueGenerated = planTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const commissionPaid = planEarnings.reduce((sum, earning) => sum + earning.totalEarnings, 0);
    const margin = revenueGenerated - commissionPaid;
    
    // ROI % = ((Revenue - Commission) / Commission) * 100
    const roiPercent = commissionPaid > 0 ? ((revenueGenerated - commissionPaid) / commissionPaid) * 100 : 0;
    
    // Cost of Sales % = (Commission / Revenue) * 100
    const costOfSalesPercent = revenueGenerated > 0 ? (commissionPaid / revenueGenerated) * 100 : 0;

    return {
      planId: plan.id,
      planName: plan.name,
      planType: plan.type,
      revenueGenerated: Math.round(revenueGenerated * 100) / 100,
      commissionPaid: Math.round(commissionPaid * 100) / 100,
      margin: Math.round(margin * 100) / 100,
      roiPercent: Math.round(roiPercent * 100) / 100,
      costOfSalesPercent: Math.round(costOfSalesPercent * 100) / 100
    };
  });
}

/**
 * Plan ROI Report Component
 */
const PlanROIReport = () => {
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    const roiData = calculatePlanROI(
      mockPlans,
      mockTransactions,
      mockEarnings,
      filters
    );

    setReportData({
      title: 'Plan ROI Report',
      description: 'Return on investment metrics for each compensation plan',
      columns: [
        { key: 'planName', label: 'Plan Name', sortable: true },
        { key: 'planType', label: 'Type', sortable: true },
        { key: 'revenueGenerated', label: 'Revenue', sortable: true, align: 'right', format: 'currency' },
        { key: 'commissionPaid', label: 'Commission', sortable: true, align: 'right', format: 'currency' },
        { key: 'margin', label: 'Margin', sortable: true, align: 'right', format: 'currency' },
        { key: 'roiPercent', label: 'ROI %', sortable: true, align: 'right', format: 'percentage' },
        { key: 'costOfSalesPercent', label: 'Cost of Sales %', sortable: true, align: 'right', format: 'percentage' }
      ],
      rows: roiData,
      chartType: 'bar',
      chartConfig: {
        xAxis: 'planName',
        yAxis: 'roiPercent',
        title: 'ROI % by Plan'
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
      reportType="plan-roi"
    />
  );
};

export default PlanROIReport;
