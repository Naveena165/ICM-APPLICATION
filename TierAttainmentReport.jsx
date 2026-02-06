/**
 * Tier Attainment Report Component
 * 
 * Displays tier distribution for compensation plans showing:
 * - How many payees reached each tier level
 * - Percentage of total participants in each tier
 * - Average earnings per tier
 * - Stacked bar chart visualization
 * 
 * Requirements: 3.4.5 - Tier Attainment report
 */

import React, { useState, useEffect } from 'react';
import './TierAttainmentReport.css';
import { mockPlans } from '../../data/mockPlans';
import { mockPayees } from '../../data/mockPayees';
import { mockEarnings } from '../../data/mockEarnings';

/**
 * Calculate tier attainment distribution
 * @param {Array} plans - Array of plans
 * @param {Array} payees - Array of payees
 * @param {Array} earnings - Array of earnings
 * @param {Object} filters - Applied filters
 * @returns {Array} Tier attainment data
 */
function calculateTierAttainment(plans, payees, earnings, filters) {
  // Filter plans with tier structure
  let filteredPlans = plans.filter(plan => 
    plan.status === 'Active' && plan.tiers && plan.tiers.length > 0
  );

  // Apply plan filter if specified
  if (filters.plan && filters.plan.length > 0) {
    filteredPlans = filteredPlans.filter(plan => filters.plan.includes(plan.id));
  }

  const tierData = [];

  filteredPlans.forEach(plan => {
    // Get payees on this plan
    const planPayees = payees.filter(payee => payee.planId === plan.id);
    
    if (planPayees.length === 0) {
      return;
    }

    // Initialize tier distribution
    const tierDistribution = plan.tiers.map(tier => ({
      planId: plan.id,
      planName: plan.name,
      tierLevel: tier.level,
      tierLabel: tier.label,
      tierThreshold: tier.threshold,
      tierRate: tier.rate,
      payeeCount: 0,
      totalEarnings: 0,
      avgEarnings: 0,
      percentOfTotal: 0
    }));

    // Assign each payee to their tier based on sales
    planPayees.forEach(payee => {
      const sales = payee.currentPeriod.actualSales;
      const payeeEarnings = payee.currentPeriod.earnings;
      
      // Find which tier this payee is in (highest tier they qualify for)
      for (let i = tierDistribution.length - 1; i >= 0; i--) {
        if (sales >= tierDistribution[i].tierThreshold) {
          tierDistribution[i].payeeCount++;
          tierDistribution[i].totalEarnings += payeeEarnings;
          break;
        }
      }
    });

    // Calculate percentages and averages
    tierDistribution.forEach(tier => {
      tier.percentOfTotal = planPayees.length > 0 
        ? Math.round((tier.payeeCount / planPayees.length) * 10000) / 100 
        : 0;
      tier.avgEarnings = tier.payeeCount > 0 
        ? Math.round((tier.totalEarnings / tier.payeeCount) * 100) / 100 
        : 0;
      tier.totalEarnings = Math.round(tier.totalEarnings * 100) / 100;
    });

    tierData.push(...tierDistribution);
  });

  return tierData;
}

/**
 * Group tier data by plan for stacked visualization
 */
function groupTierDataByPlan(tierData) {
  const planMap = {};
  
  tierData.forEach(tier => {
    if (!planMap[tier.planId]) {
      planMap[tier.planId] = {
        planId: tier.planId,
        planName: tier.planName,
        tiers: []
      };
    }
    planMap[tier.planId].tiers.push(tier);
  });

  return Object.values(planMap);
}

/**
 * Tier Attainment Report Component
 */
const TierAttainmentReport = () => {
  const [tierData, setTierData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    const data = calculateTierAttainment(
      mockPlans,
      mockPayees,
      mockEarnings,
      filters
    );
    setTierData(data);
    setGroupedData(groupTierDataByPlan(data));
  };

  const getTierColor = (tierLevel) => {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    return colors[tierLevel - 1] || '#6b7280';
  };

  return (
    <div className="tier-attainment-report">
      <div className="report-header">
        <h2>Tier Attainment Report</h2>
        <p>Distribution of payees across tier levels by compensation plan</p>
      </div>

      {groupedData.length > 0 ? (
        <div className="tier-data-container">
          {groupedData.map(planData => (
            <div key={planData.planId} className="plan-tier-section">
              <h3>{planData.planName}</h3>
              
              {/* Stacked bar visualization */}
              <div className="tier-bar-chart">
                <div className="tier-bar">
                  {planData.tiers.map(tier => (
                    tier.payeeCount > 0 && (
                      <div
                        key={tier.tierLevel}
                        className="tier-segment"
                        style={{
                          width: `${tier.percentOfTotal}%`,
                          backgroundColor: getTierColor(tier.tierLevel)
                        }}
                        title={`${tier.tierLabel}: ${tier.payeeCount} payees (${tier.percentOfTotal}%)`}
                      >
                        {tier.percentOfTotal > 10 && (
                          <span className="tier-segment-label">
                            {tier.tierLabel}: {tier.payeeCount}
                          </span>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Tier details table */}
              <table className="tier-table">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Threshold</th>
                    <th>Rate</th>
                    <th>Payees</th>
                    <th>% of Total</th>
                    <th>Total Earnings</th>
                    <th>Avg Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {planData.tiers.map(tier => (
                    <tr key={tier.tierLevel}>
                      <td>
                        <span 
                          className="tier-badge"
                          style={{ backgroundColor: getTierColor(tier.tierLevel) }}
                        >
                          {tier.tierLabel}
                        </span>
                      </td>
                      <td>${tier.tierThreshold.toLocaleString()}</td>
                      <td>{tier.tierRate}%</td>
                      <td>{tier.payeeCount}</td>
                      <td>{tier.percentOfTotal}%</td>
                      <td>${tier.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td>${tier.avgEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No tier data available. Plans must have tier structures defined.</p>
        </div>
      )}
    </div>
  );
};

export default TierAttainmentReport;
