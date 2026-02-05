/**
 * Mock Compensation Plan Data for Reports & Analytics Module
 * 
 * Provides sample compensation plan data with metrics and targets
 * Requirements: 3.4 - Plan Reports
 */

/**
 * Create a compensation plan object
 * @param {Object} data - Plan data
 * @returns {Object} Plan object
 */
export function createPlan(data) {
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    type: data.type, // 'Commission', 'Bonus', 'Tiered', 'Accelerator'
    status: data.status || 'Active', // 'Active', 'Inactive', 'Draft'
    effectiveDate: data.effectiveDate,
    endDate: data.endDate || null,
    // Plan configuration
    baseRate: data.baseRate || 0, // Base commission rate (%)
    tiers: data.tiers || [], // Tier structure
    accelerators: data.accelerators || [], // Accelerator rules
    // Participant metrics
    participantCount: data.participantCount || 0,
    activeParticipants: data.activeParticipants || 0,
    // Performance metrics
    targetRevenue: data.targetRevenue || 0,
    actualRevenue: data.actualRevenue || 0,
    targetCommission: data.targetCommission || 0,
    actualCommission: data.actualCommission || 0,
    // ROI metrics
    roi: data.roi || 0, // Return on investment (%)
    costOfSales: data.costOfSales || 0, // Commission as % of revenue
    // Period metrics
    currentPeriod: {
      revenue: data.currentPeriod?.revenue || 0,
      commission: data.currentPeriod?.commission || 0,
      participants: data.currentPeriod?.participants || 0,
      attainment: data.currentPeriod?.attainment || 0
    },
    // Historical performance
    historicalPerformance: data.historicalPerformance || [],
    // Custom rules applied
    customRules: data.customRules || [],
    // Metadata
    createdDate: data.createdDate || new Date().toISOString(),
    updatedDate: data.updatedDate || new Date().toISOString(),
    createdBy: data.createdBy || 'system',
    category: data.category || 'Sales'
  };
}

/**
 * Mock compensation plan data with various types and performance levels
 */
export const mockPlans = [
  createPlan({
    id: 'PLAN-TELECOM-001',
    name: 'Telecom Sales Plan',
    description: 'Standard commission plan for telecom sales representatives',
    type: 'Commission',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseRate: 8.0,
    tiers: [
      { level: 1, threshold: 0, rate: 8.0, label: 'Base' },
      { level: 2, threshold: 50000, rate: 10.0, label: 'Achiever' },
      { level: 3, threshold: 75000, rate: 12.0, label: 'Top Performer' }
    ],
    participantCount: 5,
    activeParticipants: 5,
    targetRevenue: 240000,
    actualRevenue: 252000,
    targetCommission: 19200,
    actualCommission: 20800,
    roi: 1112,
    costOfSales: 8.25,
    currentPeriod: {
      revenue: 252000,
      commission: 20800,
      participants: 5,
      attainment: 105
    },
    historicalPerformance: [
      { month: '2024-10', revenue: 228000, commission: 18500, attainment: 95 },
      { month: '2024-11', revenue: 245000, commission: 20100, attainment: 102 },
      { month: '2024-12', revenue: 238000, commission: 19400, attainment: 99 },
      { month: '2025-01', revenue: 252000, commission: 20800, attainment: 105 }
    ],
    customRules: ['RULE-TIER-001', 'RULE-ACCEL-001'],
    category: 'Sales'
  }),

  createPlan({
    id: 'PLAN-CONTRACTOR-001',
    name: 'Contractor Commission Plan',
    description: 'Commission plan for contractor-based sales',
    type: 'Commission',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseRate: 7.5,
    tiers: [
      { level: 1, threshold: 0, rate: 7.5, label: 'Standard' }
    ],
    participantCount: 1,
    activeParticipants: 1,
    targetRevenue: 45000,
    actualRevenue: 38000,
    targetCommission: 3375,
    actualCommission: 2850,
    roi: 1233,
    costOfSales: 7.5,
    currentPeriod: {
      revenue: 38000,
      commission: 2850,
      participants: 1,
      attainment: 84
    },
    historicalPerformance: [
      { month: '2024-10', revenue: 42000, commission: 3150, attainment: 93 },
      { month: '2024-11', revenue: 39000, commission: 2925, attainment: 87 },
      { month: '2024-12', revenue: 41000, commission: 3075, attainment: 91 },
      { month: '2025-01', revenue: 38000, commission: 2850, attainment: 84 }
    ],
    customRules: [],
    category: 'Sales'
  }),

  createPlan({
    id: 'PLAN-ENTERPRISE-001',
    name: 'Enterprise Sales Plan',
    description: 'High-value enterprise sales commission plan',
    type: 'Tiered',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseRate: 9.0,
    tiers: [
      { level: 1, threshold: 0, rate: 9.0, label: 'Base' },
      { level: 2, threshold: 60000, rate: 11.0, label: 'Achiever' },
      { level: 3, threshold: 90000, rate: 13.5, label: 'Elite' }
    ],
    accelerators: [
      { threshold: 100000, multiplier: 1.2, label: 'Accelerator' }
    ],
    participantCount: 3,
    activeParticipants: 3,
    targetRevenue: 165000,
    actualRevenue: 181000,
    targetCommission: 15675,
    actualCommission: 17450,
    roi: 937,
    costOfSales: 9.64,
    currentPeriod: {
      revenue: 181000,
      commission: 17450,
      participants: 3,
      attainment: 110
    },
    historicalPerformance: [
      { month: '2024-10', revenue: 164000, commission: 15200, attainment: 99 },
      { month: '2024-11', revenue: 175000, commission: 16400, attainment: 106 },
      { month: '2024-12', revenue: 168000, commission: 15800, attainment: 102 },
      { month: '2025-01', revenue: 181000, commission: 17450, attainment: 110 }
    ],
    customRules: ['RULE-TIER-002', 'RULE-ACCEL-002', 'RULE-BONUS-001'],
    category: 'Sales'
  }),

  createPlan({
    id: 'PLAN-ENTERPRISE-002',
    name: 'Enterprise Plus Plan',
    description: 'Premium enterprise sales plan with enhanced rates',
    type: 'Tiered',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseRate: 10.0,
    tiers: [
      { level: 1, threshold: 0, rate: 10.0, label: 'Base' },
      { level: 2, threshold: 70000, rate: 12.5, label: 'Achiever' },
      { level: 3, threshold: 100000, rate: 15.0, label: 'Elite' }
    ],
    accelerators: [
      { threshold: 120000, multiplier: 1.25, label: 'Super Accelerator' }
    ],
    participantCount: 1,
    activeParticipants: 1,
    targetRevenue: 58000,
    actualRevenue: 82000,
    targetCommission: 6380,
    actualCommission: 9375,
    roi: 775,
    costOfSales: 11.43,
    currentPeriod: {
      revenue: 82000,
      commission: 9375,
      participants: 1,
      attainment: 141
    },
    historicalPerformance: [
      { month: '2024-10', revenue: 68000, commission: 7650, attainment: 117 },
      { month: '2024-11', revenue: 75000, commission: 8625, attainment: 129 },
      { month: '2024-12', revenue: 71000, commission: 8100, attainment: 122 },
      { month: '2025-01', revenue: 82000, commission: 9375, attainment: 141 }
    ],
    customRules: ['RULE-TIER-003', 'RULE-ACCEL-003', 'RULE-BONUS-002'],
    category: 'Sales'
  }),

  createPlan({
    id: 'PLAN-WIRELESS-001',
    name: 'Wireless Sales Plan',
    description: 'Commission plan for wireless product sales',
    type: 'Commission',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseRate: 7.0,
    tiers: [
      { level: 1, threshold: 0, rate: 7.0, label: 'Standard' },
      { level: 2, threshold: 45000, rate: 8.5, label: 'Achiever' }
    ],
    participantCount: 2,
    activeParticipants: 2,
    targetRevenue: 82000,
    actualRevenue: 73000,
    targetCommission: 5945,
    actualCommission: 5250,
    roi: 1290,
    costOfSales: 7.19,
    currentPeriod: {
      revenue: 73000,
      commission: 5250,
      participants: 2,
      attainment: 89
    },
    historicalPerformance: [
      { month: '2024-10', revenue: 67000, commission: 4820, attainment: 82 },
      { month: '2024-11', revenue: 71000, commission: 5100, attainment: 87 },
      { month: '2024-12', revenue: 69000, commission: 4950, attainment: 84 },
      { month: '2025-01', revenue: 73000, commission: 5250, attainment: 89 }
    ],
    customRules: ['RULE-TIER-004'],
    category: 'Sales'
  }),

  createPlan({
    id: 'PLAN-PARTNER-003',
    name: 'Partner Channel Plan',
    description: 'Commission plan for partner channel sales',
    type: 'Tiered',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseRate: 8.5,
    tiers: [
      { level: 1, threshold: 0, rate: 8.5, label: 'Base' },
      { level: 2, threshold: 65000, rate: 10.5, label: 'Partner Plus' },
      { level: 3, threshold: 85000, rate: 12.5, label: 'Elite Partner' }
    ],
    participantCount: 1,
    activeParticipants: 1,
    targetRevenue: 60000,
    actualRevenue: 78000,
    targetCommission: 5700,
    actualCommission: 7800,
    roi: 900,
    costOfSales: 10.0,
    currentPeriod: {
      revenue: 78000,
      commission: 7800,
      participants: 1,
      attainment: 130
    },
    historicalPerformance: [
      { month: '2024-10', revenue: 68000, commission: 6800, attainment: 113 },
      { month: '2024-11', revenue: 74000, commission: 7400, attainment: 123 },
      { month: '2024-12', revenue: 71000, commission: 7100, attainment: 118 },
      { month: '2025-01', revenue: 78000, commission: 7800, attainment: 130 }
    ],
    customRules: ['RULE-TIER-005', 'RULE-PARTNER-001'],
    category: 'Partner'
  }),

  createPlan({
    id: 'PLAN-MANAGER-001',
    name: 'Sales Manager Plan',
    description: 'Commission plan for sales managers based on team performance',
    type: 'Bonus',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseRate: 6.5,
    tiers: [
      { level: 1, threshold: 0, rate: 6.5, label: 'Base' },
      { level: 2, threshold: 250000, rate: 7.5, label: 'Team Achiever' },
      { level: 3, threshold: 350000, rate: 8.5, label: 'Team Elite' }
    ],
    participantCount: 3,
    activeParticipants: 3,
    targetRevenue: 730000,
    actualRevenue: 795000,
    targetCommission: 49450,
    actualCommission: 53500,
    roi: 1386,
    costOfSales: 6.73,
    currentPeriod: {
      revenue: 795000,
      commission: 53500,
      participants: 3,
      attainment: 109
    },
    historicalPerformance: [
      { month: '2024-10', revenue: 751000, commission: 50300, attainment: 103 },
      { month: '2024-11', revenue: 782000, commission: 52400, attainment: 107 },
      { month: '2024-12', revenue: 755000, commission: 50600, attainment: 103 },
      { month: '2025-01', revenue: 795000, commission: 53500, attainment: 109 }
    ],
    customRules: ['RULE-MANAGER-001', 'RULE-TEAM-BONUS-001'],
    category: 'Management'
  }),

  createPlan({
    id: 'PLAN-DIRECTOR-001',
    name: 'Sales Director Plan',
    description: 'Executive compensation plan for sales directors',
    type: 'Bonus',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseRate: 5.0,
    tiers: [
      { level: 1, threshold: 0, rate: 5.0, label: 'Base' },
      { level: 2, threshold: 850000, rate: 5.5, label: 'Director Achiever' },
      { level: 3, threshold: 1200000, rate: 6.0, label: 'Director Elite' }
    ],
    participantCount: 2,
    activeParticipants: 2,
    targetRevenue: 1650000,
    actualRevenue: 1685000,
    targetCommission: 84750,
    actualCommission: 81500,
    roi: 1967,
    costOfSales: 4.84,
    currentPeriod: {
      revenue: 1685000,
      commission: 81500,
      participants: 2,
      attainment: 102
    },
    historicalPerformance: [
      { month: '2024-10', revenue: 1630000, commission: 79700, attainment: 99 },
      { month: '2024-11', revenue: 1675000, commission: 81800, attainment: 101 },
      { month: '2024-12', revenue: 1615000, commission: 78900, attainment: 98 },
      { month: '2025-01', revenue: 1685000, commission: 81500, attainment: 102 }
    ],
    customRules: ['RULE-DIRECTOR-001', 'RULE-EXEC-BONUS-001'],
    category: 'Executive'
  }),

  createPlan({
    id: 'PLAN-VP-001',
    name: 'VP Sales Plan',
    description: 'Executive compensation plan for VP of Sales',
    type: 'Bonus',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseRate: 4.5,
    tiers: [
      { level: 1, threshold: 0, rate: 4.5, label: 'Base' },
      { level: 2, threshold: 2500000, rate: 5.0, label: 'VP Achiever' },
      { level: 3, threshold: 3500000, rate: 5.5, label: 'VP Elite' }
    ],
    participantCount: 1,
    activeParticipants: 1,
    targetRevenue: 2500000,
    actualRevenue: 2850000,
    targetCommission: 112500,
    actualCommission: 125000,
    roi: 2180,
    costOfSales: 4.39,
    currentPeriod: {
      revenue: 2850000,
      commission: 125000,
      participants: 1,
      attainment: 114
    },
    historicalPerformance: [
      { month: '2024-10', revenue: 2420000, commission: 108000, attainment: 97 },
      { month: '2024-11', revenue: 2650000, commission: 118000, attainment: 106 },
      { month: '2024-12', revenue: 2520000, commission: 112000, attainment: 101 },
      { month: '2025-01', revenue: 2850000, commission: 125000, attainment: 114 }
    ],
    customRules: ['RULE-VP-001', 'RULE-EXEC-BONUS-002'],
    category: 'Executive'
  }),

  // Inactive plan for testing
  createPlan({
    id: 'PLAN-LEGACY-001',
    name: 'Legacy Sales Plan',
    description: 'Deprecated sales plan - replaced by new structure',
    type: 'Commission',
    status: 'Inactive',
    effectiveDate: '2023-01-01',
    endDate: '2023-12-31',
    baseRate: 6.0,
    tiers: [
      { level: 1, threshold: 0, rate: 6.0, label: 'Standard' }
    ],
    participantCount: 0,
    activeParticipants: 0,
    targetRevenue: 0,
    actualRevenue: 0,
    targetCommission: 0,
    actualCommission: 0,
    roi: 0,
    costOfSales: 0,
    currentPeriod: {
      revenue: 0,
      commission: 0,
      participants: 0,
      attainment: 0
    },
    historicalPerformance: [],
    customRules: [],
    category: 'Sales'
  })
];

/**
 * Get a plan by ID
 * @param {string} id - Plan ID
 * @returns {Object|undefined} The plan or undefined
 */
export function getPlanById(id) {
  return mockPlans.find(plan => plan.id === id);
}

/**
 * Get plans by type
 * @param {string} type - Plan type
 * @returns {Array} Array of plans
 */
export function getPlansByType(type) {
  return mockPlans.filter(plan => plan.type === type);
}

/**
 * Get plans by status
 * @param {string} status - Plan status
 * @returns {Array} Array of plans
 */
export function getPlansByStatus(status) {
  return mockPlans.filter(plan => plan.status === status);
}

/**
 * Get plans by category
 * @param {string} category - Plan category
 * @returns {Array} Array of plans
 */
export function getPlansByCategory(category) {
  return mockPlans.filter(plan => plan.category === category);
}

/**
 * Calculate plan summary statistics
 * @param {Array} plans - Array of plans (defaults to all active mock plans)
 * @returns {Object} Summary statistics
 */
export function calculatePlanSummary(plans = mockPlans.filter(p => p.status === 'Active')) {
  const summary = {
    totalPlans: plans.length,
    totalParticipants: 0,
    totalRevenue: 0,
    totalCommission: 0,
    averageROI: 0,
    averageCostOfSales: 0,
    byType: {},
    byCategory: {},
    topPerformingPlans: []
  };

  let totalROI = 0;
  let totalCostOfSales = 0;

  plans.forEach(plan => {
    summary.totalParticipants += plan.participantCount;
    summary.totalRevenue += plan.actualRevenue;
    summary.totalCommission += plan.actualCommission;
    totalROI += plan.roi;
    totalCostOfSales += plan.costOfSales;

    // Group by type
    if (!summary.byType[plan.type]) {
      summary.byType[plan.type] = { count: 0, revenue: 0, commission: 0 };
    }
    summary.byType[plan.type].count++;
    summary.byType[plan.type].revenue += plan.actualRevenue;
    summary.byType[plan.type].commission += plan.actualCommission;

    // Group by category
    if (!summary.byCategory[plan.category]) {
      summary.byCategory[plan.category] = { count: 0, revenue: 0, commission: 0 };
    }
    summary.byCategory[plan.category].count++;
    summary.byCategory[plan.category].revenue += plan.actualRevenue;
    summary.byCategory[plan.category].commission += plan.actualCommission;
  });

  if (plans.length > 0) {
    summary.averageROI = Math.round(totalROI / plans.length);
    summary.averageCostOfSales = Math.round((totalCostOfSales / plans.length) * 100) / 100;
  }

  // Get top 5 performing plans by ROI
  summary.topPerformingPlans = [...plans]
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 5)
    .map(p => ({ id: p.id, name: p.name, roi: p.roi, revenue: p.actualRevenue }));

  return summary;
}

/**
 * Compare multiple plans
 * @param {Array} planIds - Array of plan IDs to compare
 * @returns {Object} Comparison data
 */
export function comparePlans(planIds) {
  const plans = planIds.map(id => getPlanById(id)).filter(p => p);
  
  if (plans.length === 0) {
    return null;
  }

  const comparison = {
    plans: plans.map(p => p.name),
    metrics: {
      participants: plans.map(p => p.participantCount),
      revenue: plans.map(p => p.actualRevenue),
      commission: plans.map(p => p.actualCommission),
      roi: plans.map(p => p.roi),
      costOfSales: plans.map(p => p.costOfSales),
      attainment: plans.map(p => p.currentPeriod.attainment)
    }
  };

  return comparison;
}

/**
 * Get tier attainment distribution for a plan
 * @param {string} planId - Plan ID
 * @param {Array} payees - Array of payees on this plan
 * @returns {Object} Tier distribution
 */
export function getTierAttainment(planId, payees) {
  const plan = getPlanById(planId);
  if (!plan || !plan.tiers) {
    return null;
  }

  const distribution = plan.tiers.map(tier => ({
    level: tier.level,
    label: tier.label,
    threshold: tier.threshold,
    rate: tier.rate,
    payeeCount: 0,
    totalEarnings: 0
  }));

  payees.forEach(payee => {
    if (payee.planId === planId) {
      const sales = payee.currentPeriod.actualSales;
      // Find which tier this payee is in
      for (let i = distribution.length - 1; i >= 0; i--) {
        if (sales >= distribution[i].threshold) {
          distribution[i].payeeCount++;
          distribution[i].totalEarnings += payee.currentPeriod.earnings;
          break;
        }
      }
    }
  });

  return {
    planId,
    planName: plan.name,
    tiers: distribution
  };
}
