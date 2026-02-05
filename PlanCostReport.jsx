/**
 * Plan Cost Report Component
 * 
 * Displays cost metrics for each compensation plan including:
 * - Total commissions paid
 * - Participant count
 * - Average commission per participant
 * 
 * Requirements: 3.4.2 - Plan Cost report
 */

import React, { useState, useEffect } from 'react';
import ReportViewer from '../../components/reports/ReportViewer';
import { mockPlans } from '../data/mockPlans';
import { mockPayees } from '../../payees/data/mockPayees';
import { mockEarnings, mockPayments } from '../../data/mockEarnings';

/**
 * Calculate plan cost metrics
 * @param {Array} plans - Array of plans
 * @param {Array} payees - Array of payees
 * @param {Array} earnings - Array of earnings
 * @param {Array} payments - Array of payments
 * @param {Object} filters - Applied filters
 * @returns {Array} Plan cost data
 */
function calculatePlanCost(plans, payees, earnings, payments, filters) {
  // Filter active plans
  let filteredPlans = plans.filter(plan => plan.status === 'Active');

  // Apply plan filter if specified
  if (filters.plan && filters.plan.length > 0) {
    filteredPlans = filteredPlans.filter(plan => filters.plan.includes(plan.id));
  }

  return filteredPlans.map(plan => {
    // Get payees on this plan
    const planPayees = payees.filter(payee => payee.planId === plan.id);
    
    // Get earnings for this plan
    const planEarnings = earnings.filter(earning => earning.planId === plan.id);
    
    // Get payments for this plan
    const planPayments = payments.filter(payment => {
      const earning = earnings.find(e => e.earningId === payment.earningId);
      return earning && earning.planId === plan.id;
    });

    // Calculate metrics
    const totalCommissions = planEarnings.reduce((sum, earning) => sum + earning.totalEarnings, 0);
    const totalPaid = planPayments
      .filter(p => p.status === 'Paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const participantCount = planPayees.length;
    const avgCommissionPerParticipant = participantCount > 0 ? totalCommissions / participantCount : 0;

    return {
      planId: plan.id,
      planName: plan.name,
      planType: plan.type,
      totalCommissions: Math.round(totalCommissions * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      participantCount,
      avgCommissionPerParticipant: Math.round(avgCommissionPerParticipant * 100) / 100
    };
  });
}

/**
 * Plan Cost Report Component
 */
const PlanCostReport = () => {
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    const costData = calculatePlanCost(
      mockPlans,
      mockPayees,
      mockEarnings,
      mockPayments,
      filters
    );

    setReportData({
      title: 'Plan Cost Report',
      description: 'Commission cost metrics for each compensation plan',
      columns: [
        { key: 'planName', label: 'Plan Name', sortable: true },
        { key: 'planType', label: 'Type', sortable: true },
        { key: 'totalCommissions', label: 'Total Commissions', sortable: true, align: 'right', format: 'currency' },
        { key: 'totalPaid', label: 'Total Paid', sortable: true, align: 'right', format: 'currency' },
        { key: 'participantCount', label: 'Participants', sortable: true, align: 'right' },
        { key: 'avgCommissionPerParticipant', label: 'Avg per Participant', sortable: true, align: 'right', format: 'currency' }
      ],
      rows: costData,
      chartType: 'bar',
      chartConfig: {
        xAxis: 'planName',
        yAxis: 'totalCommissions',
        title: 'Total Commissions by Plan'
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
      reportType="plan-cost"
    />
  );
};

export default PlanCostReport;
