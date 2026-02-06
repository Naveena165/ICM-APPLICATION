/**
 * Rule Impact Analysis Report Component
 * 
 * Displays the impact of custom rules on commission calculations:
 * - Rule name and type
 * - Number of transactions affected
 * - Total commission impact
 * - Percentage of total commission impact
 * 
 * Requirements: 3.4.6 - Rule Impact Analysis report
 */

import React, { useState, useEffect } from 'react';
import ReportViewer from '../shared/ReportViewer';
import { mockPlans } from '../../data/mockPlans';
import { mockTransactions } from '../../data/mockTransactions';
import { mockEarnings } from '../../data/mockEarnings';

/**
 * Calculate rule impact metrics
 * @param {Array} plans - Array of plans
 * @param {Array} transactions - Array of transactions
 * @param {Array} earnings - Array of earnings
 * @param {Object} filters - Applied filters
 * @returns {Array} Rule impact data
 */
function calculateRuleImpact(plans, transactions, earnings, filters) {
  // Collect all unique rules from plans
  const ruleMap = new Map();

  // Apply plan filter if specified
  let filteredPlans = plans.filter(plan => plan.status === 'Active');
  if (filters.plan && filters.plan.length > 0) {
    filteredPlans = filteredPlans.filter(plan => filters.plan.includes(plan.id));
  }

  // Initialize rule tracking
  filteredPlans.forEach(plan => {
    if (plan.customRules && plan.customRules.length > 0) {
      plan.customRules.forEach(ruleId => {
        if (!ruleMap.has(ruleId)) {
          ruleMap.set(ruleId, {
            ruleId,
            ruleName: getRuleName(ruleId),
            ruleType: getRuleType(ruleId),
            transactionsAffected: 0,
            commissionImpact: 0,
            plans: []
          });
        }
        ruleMap.get(ruleId).plans.push(plan.name);
      });
    }
  });

  // Calculate impact from transactions and earnings
  transactions.forEach(txn => {
    if (txn.rulesApplied && txn.rulesApplied.length > 0) {
      txn.rulesApplied.forEach(ruleId => {
        if (ruleMap.has(ruleId)) {
          const rule = ruleMap.get(ruleId);
          rule.transactionsAffected++;
          // Estimate impact as the credit amount
          rule.commissionImpact += txn.creditAmount || 0;
        }
      });
    }
  });

  // Calculate impact from earnings adjustments
  earnings.forEach(earning => {
    if (earning.rulesApplied && earning.rulesApplied.length > 0) {
      earning.rulesApplied.forEach(ruleId => {
        if (ruleMap.has(ruleId)) {
          const rule = ruleMap.get(ruleId);
          // Add bonus amounts attributed to rules
          if (earning.bonusAmount > 0) {
            rule.commissionImpact += earning.bonusAmount;
          }
        }
      });
    }
  });

  // Convert to array and calculate percentages
  const ruleData = Array.from(ruleMap.values());
  const totalImpact = ruleData.reduce((sum, rule) => sum + rule.commissionImpact, 0);

  return ruleData.map(rule => ({
    ...rule,
    commissionImpact: Math.round(rule.commissionImpact * 100) / 100,
    percentOfTotal: totalImpact > 0 
      ? Math.round((rule.commissionImpact / totalImpact) * 10000) / 100 
      : 0,
    plans: rule.plans.join(', ')
  })).sort((a, b) => b.commissionImpact - a.commissionImpact);
}

/**
 * Get rule name from rule ID
 */
function getRuleName(ruleId) {
  const ruleNames = {
    'RULE-TIER-001': 'Telecom Tier Structure',
    'RULE-TIER-002': 'Enterprise Tier Structure',
    'RULE-TIER-003': 'Enterprise Plus Tier Structure',
    'RULE-TIER-004': 'Wireless Tier Structure',
    'RULE-TIER-005': 'Partner Tier Structure',
    'RULE-ACCEL-001': 'Telecom Accelerator',
    'RULE-ACCEL-002': 'Enterprise Accelerator',
    'RULE-ACCEL-003': 'Enterprise Plus Accelerator',
    'RULE-BONUS-001': 'Enterprise Performance Bonus',
    'RULE-BONUS-002': 'Enterprise Plus Performance Bonus',
    'RULE-PARTNER-001': 'Partner Channel Bonus',
    'RULE-MANAGER-001': 'Manager Team Bonus',
    'RULE-TEAM-BONUS-001': 'Team Achievement Bonus',
    'RULE-DIRECTOR-001': 'Director Performance Bonus',
    'RULE-EXEC-BONUS-001': 'Executive Bonus Tier 1',
    'RULE-EXEC-BONUS-002': 'Executive Bonus Tier 2',
    'RULE-VP-001': 'VP Sales Bonus Structure'
  };
  return ruleNames[ruleId] || ruleId;
}

/**
 * Get rule type from rule ID
 */
function getRuleType(ruleId) {
  if (ruleId.includes('TIER')) return 'Tier';
  if (ruleId.includes('ACCEL')) return 'Accelerator';
  if (ruleId.includes('BONUS')) return 'Bonus';
  if (ruleId.includes('PARTNER')) return 'Partner';
  if (ruleId.includes('MANAGER') || ruleId.includes('DIRECTOR') || ruleId.includes('VP')) return 'Management';
  return 'Other';
}

/**
 * Rule Impact Analysis Report Component
 */
const RuleImpactAnalysisReport = () => {
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    const impactData = calculateRuleImpact(
      mockPlans,
      mockTransactions,
      mockEarnings,
      filters
    );

    setReportData({
      title: 'Rule Impact Analysis Report',
      description: 'Commission impact of custom rules across compensation plans',
      columns: [
        { key: 'ruleName', label: 'Rule Name', sortable: true },
        { key: 'ruleType', label: 'Type', sortable: true },
        { key: 'transactionsAffected', label: 'Transactions', sortable: true, align: 'right' },
        { key: 'commissionImpact', label: 'Commission Impact', sortable: true, align: 'right', format: 'currency' },
        { key: 'percentOfTotal', label: '% of Total', sortable: true, align: 'right', format: 'percentage' },
        { key: 'plans', label: 'Applied to Plans', sortable: true }
      ],
      rows: impactData,
      chartType: 'pie',
      chartConfig: {
        labelKey: 'ruleName',
        valueKey: 'commissionImpact',
        title: 'Commission Impact by Rule'
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
      reportType="rule-impact-analysis"
    />
  );
};

export default RuleImpactAnalysisReport;
