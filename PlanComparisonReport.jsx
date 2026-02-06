/**
 * Plan Comparison Report Component
 * 
 * Displays side-by-side comparison of multiple compensation plans.
 * Allows selection of 2-4 plans to compare across key metrics.
 * 
 * Requirements: 3.4.4 - Plan Comparison report
 */

import React, { useState, useEffect } from 'react';
import './PlanComparisonReport.css';
import { mockPlans } from '../data/mockPlans';
import { mockPayees } from '../../payees/data/mockPayees';
import { mockTransactions } from '../../data/mockTransactions';
import { mockEarnings } from '../../data/mockEarnings';

/**
 * Calculate comparison metrics for selected plans
 * @param {Array} selectedPlanIds - Array of plan IDs to compare
 * @param {Array} plans - Array of all plans
 * @param {Array} payees - Array of payees
 * @param {Array} transactions - Array of transactions
 * @param {Array} earnings - Array of earnings
 * @returns {Object} Comparison data
 */
function calculatePlanComparison(selectedPlanIds, plans, payees, transactions, earnings) {
  const selectedPlans = selectedPlanIds
    .map(id => plans.find(p => p.id === id))
    .filter(p => p);

  if (selectedPlans.length === 0) {
    return null;
  }

  const metrics = [
    { key: 'participants', label: 'Participants' },
    { key: 'totalSales', label: 'Total Sales', format: 'currency' },
    { key: 'totalEarnings', label: 'Total Earnings', format: 'currency' },
    { key: 'avgEarnings', label: 'Avg Earnings', format: 'currency' },
    { key: 'roi', label: 'ROI %', format: 'percentage' },
    { key: 'costOfSales', label: 'Cost of Sales %', format: 'percentage' },
    { key: 'attainment', label: 'Attainment %' }
  ];

  const comparisonData = metrics.map(metric => {
    const row = { metric: metric.label, format: metric.format };
    
    selectedPlans.forEach(plan => {
      const planPayees = payees.filter(p => p.planId === plan.id);
      const planTransactions = transactions.filter(t => t.planId === plan.id && t.status === 'Credited');
      const planEarnings = earnings.filter(e => e.planId === plan.id);

      const totalSales = planTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalEarnings = planEarnings.reduce((sum, e) => sum + e.totalEarnings, 0);
      const participants = planPayees.length;
      const avgEarnings = participants > 0 ? totalEarnings / participants : 0;
      const roi = totalEarnings > 0 ? ((totalSales - totalEarnings) / totalEarnings) * 100 : 0;
      const costOfSales = totalSales > 0 ? (totalEarnings / totalSales) * 100 : 0;
      const attainment = plan.currentPeriod.attainment;

      const values = {
        participants,
        totalSales,
        totalEarnings,
        avgEarnings,
        roi,
        costOfSales,
        attainment
      };

      row[plan.id] = values[metric.key];
    });

    return row;
  });

  return {
    plans: selectedPlans,
    comparisonData
  };
}

/**
 * Format value based on format type
 */
function formatValue(value, format) {
  if (value === null || value === undefined) return '-';
  
  switch (format) {
    case 'currency':
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'percentage':
      return `${value.toFixed(2)}%`;
    default:
      return typeof value === 'number' ? value.toLocaleString('en-US') : value;
  }
}

/**
 * Plan Comparison Report Component
 */
const PlanComparisonReport = () => {
  const [selectedPlanIds, setSelectedPlanIds] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);

  useEffect(() => {
    // Load available plans
    const activePlans = mockPlans.filter(p => p.status === 'Active');
    setAvailablePlans(activePlans);
    
    // Pre-select first 2 plans
    if (activePlans.length >= 2) {
      setSelectedPlanIds([activePlans[0].id, activePlans[1].id]);
    }
  }, []);

  useEffect(() => {
    if (selectedPlanIds.length > 0) {
      const data = calculatePlanComparison(
        selectedPlanIds,
        mockPlans,
        mockPayees,
        mockTransactions,
        mockEarnings
      );
      setComparisonData(data);
    } else {
      setComparisonData(null);
    }
  }, [selectedPlanIds]);

  const handlePlanToggle = (planId) => {
    setSelectedPlanIds(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 plans at a time');
          return prev;
        }
        return [...prev, planId];
      }
    });
  };

  return (
    <div className="plan-comparison-report">
      <div className="report-header">
        <h2>Plan Comparison Report</h2>
        <p>Compare performance metrics across multiple compensation plans</p>
      </div>

      <div className="plan-selector">
        <h3>Select Plans to Compare (2-4 plans)</h3>
        <div className="plan-checkboxes">
          {availablePlans.map(plan => (
            <label key={plan.id} className="plan-checkbox">
              <input
                type="checkbox"
                checked={selectedPlanIds.includes(plan.id)}
                onChange={() => handlePlanToggle(plan.id)}
              />
              <span>{plan.name}</span>
            </label>
          ))}
        </div>
      </div>

      {comparisonData && comparisonData.plans.length >= 2 ? (
        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                {comparisonData.plans.map(plan => (
                  <th key={plan.id}>{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonData.comparisonData.map((row, index) => (
                <tr key={index}>
                  <td className="metric-label">{row.metric}</td>
                  {comparisonData.plans.map(plan => (
                    <td key={plan.id} className="metric-value">
                      {formatValue(row[plan.id], row.format)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">
          <p>Please select at least 2 plans to compare</p>
        </div>
      )}
    </div>
  );
};

export default PlanComparisonReport;
