/**
 * Mock Payee Data for Reports & Analytics Module
 * 
 * Provides sample payee data with roles, regions, quotas, and historical earnings
 * Requirements: 3.3 - Payee Reports
 */

/**
 * Create a payee object
 * @param {Object} data - Payee data
 * @returns {Object} Payee object
 */
export function createPayee(data) {
  return {
    id: data.id,
    name: data.name,
    email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    role: data.role, // 'Sales Rep', 'Manager', 'Director', 'VP Sales'
    region: data.region, // 'WEST', 'EAST', 'NORTH', 'CENTRAL', 'SOUTH'
    country: data.country || 'CA',
    status: data.status || 'Active', // 'Active', 'Inactive', 'On Leave'
    hireDate: data.hireDate,
    quota: data.quota || 0, // Monthly quota
    planId: data.planId,
    planName: data.planName,
    managerId: data.managerId || null,
    department: data.department || 'Sales',
    // Historical earnings data
    historicalEarnings: data.historicalEarnings || [],
    // Current period metrics
    currentPeriod: {
      actualSales: data.currentPeriod?.actualSales || 0,
      earnings: data.currentPeriod?.earnings || 0,
      paidAmount: data.currentPeriod?.paidAmount || 0,
      pendingAmount: data.currentPeriod?.pendingAmount || 0,
      attainment: data.currentPeriod?.attainment || 0
    },
    // Metadata
    createdDate: data.createdDate || new Date().toISOString(),
    updatedDate: data.updatedDate || new Date().toISOString()
  };
}

/**
 * Mock payee data with various roles, regions, and performance levels
 */
export const mockPayees = [
  // West Region - Sales Reps
  createPayee({
    id: 'PAY-001',
    name: 'TELECOM INC',
    role: 'Sales Rep',
    region: 'WEST-001',
    hireDate: '2023-01-15',
    quota: 50000,
    planId: 'PLAN-TELECOM-001',
    planName: 'Telecom Sales Plan',
    currentPeriod: {
      actualSales: 62000,
      earnings: 4500,
      paidAmount: 4500,
      pendingAmount: 0,
      attainment: 124
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 3800, sales: 48000, attainment: 96 },
      { month: '2024-11', earnings: 4200, sales: 55000, attainment: 110 },
      { month: '2024-12', earnings: 4100, sales: 52000, attainment: 104 },
      { month: '2025-01', earnings: 4500, sales: 62000, attainment: 124 }
    ]
  }),

  createPayee({
    id: 'PAY-002',
    name: 'NEWHOOK TRENCHING',
    role: 'Sales Rep',
    region: 'WEST-002',
    hireDate: '2022-06-01',
    quota: 45000,
    planId: 'PLAN-CONTRACTOR-001',
    planName: 'Contractor Commission Plan',
    currentPeriod: {
      actualSales: 38000,
      earnings: 2850,
      paidAmount: 2850,
      pendingAmount: 0,
      attainment: 84
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 3200, sales: 42000, attainment: 93 },
      { month: '2024-11', earnings: 2900, sales: 39000, attainment: 87 },
      { month: '2024-12', earnings: 3100, sales: 41000, attainment: 91 },
      { month: '2025-01', earnings: 2850, sales: 38000, attainment: 84 }
    ]
  }),

  createPayee({
    id: 'PAY-005',
    name: 'COASTAL ENTERPRISES',
    role: 'Sales Rep',
    region: 'WEST-003',
    hireDate: '2023-09-10',
    quota: 55000,
    planId: 'PLAN-ENTERPRISE-001',
    planName: 'Enterprise Sales Plan',
    currentPeriod: {
      actualSales: 72000,
      earnings: 6200,
      paidAmount: 3100,
      pendingAmount: 3100,
      attainment: 131
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 4800, sales: 58000, attainment: 105 },
      { month: '2024-11', earnings: 5500, sales: 68000, attainment: 124 },
      { month: '2024-12', earnings: 5200, sales: 62000, attainment: 113 },
      { month: '2025-01', earnings: 6200, sales: 72000, attainment: 131 }
    ]
  }),

  createPayee({
    id: 'PAY-008',
    name: 'WEST COAST WIRELESS',
    role: 'Sales Rep',
    region: 'WEST-004',
    hireDate: '2024-02-01',
    quota: 40000,
    planId: 'PLAN-WIRELESS-001',
    planName: 'Wireless Sales Plan',
    currentPeriod: {
      actualSales: 35000,
      earnings: 2450,
      paidAmount: 2450,
      pendingAmount: 0,
      attainment: 88
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 2100, sales: 32000, attainment: 80 },
      { month: '2024-11', earnings: 2300, sales: 34000, attainment: 85 },
      { month: '2024-12', earnings: 2200, sales: 33000, attainment: 83 },
      { month: '2025-01', earnings: 2450, sales: 35000, attainment: 88 }
    ]
  }),

  createPayee({
    id: 'PAY-011',
    name: 'MOUNTAIN VIEW SYSTEMS',
    role: 'Sales Rep',
    region: 'WEST-005',
    hireDate: '2021-11-20',
    quota: 60000,
    planId: 'PLAN-PARTNER-003',
    planName: 'Partner Channel Plan',
    currentPeriod: {
      actualSales: 78000,
      earnings: 6800,
      paidAmount: 6800,
      pendingAmount: 0,
      attainment: 130
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 5900, sales: 68000, attainment: 113 },
      { month: '2024-11', earnings: 6400, sales: 74000, attainment: 123 },
      { month: '2024-12', earnings: 6200, sales: 71000, attainment: 118 },
      { month: '2025-01', earnings: 6800, sales: 78000, attainment: 130 }
    ]
  }),

  // East Region - Sales Reps
  createPayee({
    id: 'PAY-003',
    name: 'ATLANTIC COMMUNICATIONS',
    role: 'Sales Rep',
    region: 'EAST-001',
    hireDate: '2023-03-15',
    quota: 48000,
    planId: 'PLAN-TELECOM-001',
    planName: 'Telecom Sales Plan',
    currentPeriod: {
      actualSales: 51000,
      earnings: 3900,
      paidAmount: 3900,
      pendingAmount: 0,
      attainment: 106
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 3500, sales: 46000, attainment: 96 },
      { month: '2024-11', earnings: 3700, sales: 49000, attainment: 102 },
      { month: '2024-12', earnings: 3600, sales: 47000, attainment: 98 },
      { month: '2025-01', earnings: 3900, sales: 51000, attainment: 106 }
    ]
  }),

  createPayee({
    id: 'PAY-004',
    name: 'MARITIME SALES GROUP',
    role: 'Sales Rep',
    region: 'EAST-002',
    hireDate: '2022-08-10',
    quota: 52000,
    planId: 'PLAN-ENTERPRISE-001',
    planName: 'Enterprise Sales Plan',
    currentPeriod: {
      actualSales: 44000,
      earnings: 3200,
      paidAmount: 0,
      pendingAmount: 3200,
      attainment: 85
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 3800, sales: 50000, attainment: 96 },
      { month: '2024-11', earnings: 3400, sales: 46000, attainment: 88 },
      { month: '2024-12', earnings: 3600, sales: 48000, attainment: 92 },
      { month: '2025-01', earnings: 3200, sales: 44000, attainment: 85 }
    ]
  }),

  createPayee({
    id: 'PAY-007',
    name: 'EASTERN SOLUTIONS',
    role: 'Sales Rep',
    region: 'EAST-003',
    hireDate: '2023-05-20',
    quota: 58000,
    planId: 'PLAN-ENTERPRISE-002',
    planName: 'Enterprise Plus Plan',
    currentPeriod: {
      actualSales: 82000,
      earnings: 7500,
      paidAmount: 3750,
      pendingAmount: 3750,
      attainment: 141
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 6200, sales: 68000, attainment: 117 },
      { month: '2024-11', earnings: 6800, sales: 75000, attainment: 129 },
      { month: '2024-12', earnings: 6500, sales: 71000, attainment: 122 },
      { month: '2025-01', earnings: 7500, sales: 82000, attainment: 141 }
    ]
  }),

  // Central Region - Sales Reps
  createPayee({
    id: 'PAY-009',
    name: 'CENTRAL COMMUNICATIONS',
    role: 'Sales Rep',
    region: 'CENTRAL-001',
    hireDate: '2022-12-01',
    quota: 46000,
    planId: 'PLAN-TELECOM-001',
    planName: 'Telecom Sales Plan',
    currentPeriod: {
      actualSales: 49000,
      earnings: 3700,
      paidAmount: 3700,
      pendingAmount: 0,
      attainment: 107
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 3300, sales: 44000, attainment: 96 },
      { month: '2024-11', earnings: 3500, sales: 47000, attainment: 102 },
      { month: '2024-12', earnings: 3400, sales: 45000, attainment: 98 },
      { month: '2025-01', earnings: 3700, sales: 49000, attainment: 107 }
    ]
  }),

  createPayee({
    id: 'PAY-010',
    name: 'PRAIRIE TELECOM',
    role: 'Sales Rep',
    region: 'CENTRAL-002',
    hireDate: '2024-01-10',
    quota: 42000,
    planId: 'PLAN-WIRELESS-001',
    planName: 'Wireless Sales Plan',
    currentPeriod: {
      actualSales: 38000,
      earnings: 2800,
      paidAmount: 0,
      pendingAmount: 2800,
      attainment: 90
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 2400, sales: 35000, attainment: 83 },
      { month: '2024-11', earnings: 2600, sales: 37000, attainment: 88 },
      { month: '2024-12', earnings: 2500, sales: 36000, attainment: 86 },
      { month: '2025-01', earnings: 2800, sales: 38000, attainment: 90 }
    ]
  }),

  createPayee({
    id: 'PAY-012',
    name: 'VALLEY COMMUNICATIONS',
    role: 'Sales Rep',
    region: 'CENTRAL-003',
    hireDate: '2023-07-15',
    quota: 50000,
    planId: 'PLAN-ENTERPRISE-001',
    planName: 'Enterprise Sales Plan',
    currentPeriod: {
      actualSales: 65000,
      earnings: 5400,
      paidAmount: 5400,
      pendingAmount: 0,
      attainment: 130
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 4600, sales: 56000, attainment: 112 },
      { month: '2024-11', earnings: 5000, sales: 61000, attainment: 122 },
      { month: '2024-12', earnings: 4800, sales: 58000, attainment: 116 },
      { month: '2025-01', earnings: 5400, sales: 65000, attainment: 130 }
    ]
  }),

  // North Region - Sales Rep
  createPayee({
    id: 'PAY-006',
    name: 'NORTHERN NETWORKS',
    role: 'Sales Rep',
    region: 'NORTH-001',
    hireDate: '2023-04-01',
    quota: 44000,
    planId: 'PLAN-TELECOM-001',
    planName: 'Telecom Sales Plan',
    currentPeriod: {
      actualSales: 32000,
      earnings: 2100,
      paidAmount: 0,
      pendingAmount: 0,
      attainment: 73
    },
    status: 'On Leave',
    historicalEarnings: [
      { month: '2024-10', earnings: 3100, sales: 42000, attainment: 95 },
      { month: '2024-11', earnings: 3300, sales: 45000, attainment: 102 },
      { month: '2024-12', earnings: 2800, sales: 38000, attainment: 86 },
      { month: '2025-01', earnings: 2100, sales: 32000, attainment: 73 }
    ]
  }),

  // Managers
  createPayee({
    id: 'MGR-001',
    name: 'Sarah Johnson',
    role: 'Manager',
    region: 'WEST',
    hireDate: '2020-03-01',
    quota: 250000,
    planId: 'PLAN-MANAGER-001',
    planName: 'Sales Manager Plan',
    currentPeriod: {
      actualSales: 285000,
      earnings: 18500,
      paidAmount: 18500,
      pendingAmount: 0,
      attainment: 114
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 16200, sales: 248000, attainment: 99 },
      { month: '2024-11', earnings: 17800, sales: 272000, attainment: 109 },
      { month: '2024-12', earnings: 17200, sales: 262000, attainment: 105 },
      { month: '2025-01', earnings: 18500, sales: 285000, attainment: 114 }
    ]
  }),

  createPayee({
    id: 'MGR-002',
    name: 'Michael Chen',
    role: 'Manager',
    region: 'EAST',
    hireDate: '2019-08-15',
    quota: 260000,
    planId: 'PLAN-MANAGER-001',
    planName: 'Sales Manager Plan',
    currentPeriod: {
      actualSales: 242000,
      earnings: 15800,
      paidAmount: 15800,
      pendingAmount: 0,
      attainment: 93
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 17500, sales: 268000, attainment: 103 },
      { month: '2024-11', earnings: 16800, sales: 258000, attainment: 99 },
      { month: '2024-12', earnings: 16200, sales: 248000, attainment: 95 },
      { month: '2025-01', earnings: 15800, sales: 242000, attainment: 93 }
    ]
  }),

  createPayee({
    id: 'MGR-003',
    name: 'Jennifer Martinez',
    role: 'Manager',
    region: 'CENTRAL',
    hireDate: '2021-01-10',
    quota: 220000,
    planId: 'PLAN-MANAGER-001',
    planName: 'Sales Manager Plan',
    currentPeriod: {
      actualSales: 268000,
      earnings: 19200,
      paidAmount: 19200,
      pendingAmount: 0,
      attainment: 122
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 16500, sales: 235000, attainment: 107 },
      { month: '2024-11', earnings: 17800, sales: 252000, attainment: 115 },
      { month: '2024-12', earnings: 17200, sales: 245000, attainment: 111 },
      { month: '2025-01', earnings: 19200, sales: 268000, attainment: 122 }
    ]
  }),

  // Directors
  createPayee({
    id: 'DIR-001',
    name: 'Robert Williams',
    role: 'Director',
    region: 'WEST',
    hireDate: '2018-05-01',
    quota: 800000,
    planId: 'PLAN-DIRECTOR-001',
    planName: 'Sales Director Plan',
    currentPeriod: {
      actualSales: 920000,
      earnings: 45000,
      paidAmount: 45000,
      pendingAmount: 0,
      attainment: 115
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 38500, sales: 785000, attainment: 98 },
      { month: '2024-11', earnings: 42000, sales: 860000, attainment: 108 },
      { month: '2024-12', earnings: 40500, sales: 825000, attainment: 103 },
      { month: '2025-01', earnings: 45000, sales: 920000, attainment: 115 }
    ]
  }),

  createPayee({
    id: 'DIR-002',
    name: 'Lisa Anderson',
    role: 'Director',
    region: 'EAST',
    hireDate: '2017-09-15',
    quota: 850000,
    planId: 'PLAN-DIRECTOR-001',
    planName: 'Sales Director Plan',
    currentPeriod: {
      actualSales: 765000,
      earnings: 36500,
      paidAmount: 36500,
      pendingAmount: 0,
      attainment: 90
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 41200, sales: 845000, attainment: 99 },
      { month: '2024-11', earnings: 39800, sales: 815000, attainment: 96 },
      { month: '2024-12', earnings: 38500, sales: 790000, attainment: 93 },
      { month: '2025-01', earnings: 36500, sales: 765000, attainment: 90 }
    ]
  }),

  // VP Sales
  createPayee({
    id: 'VP-001',
    name: 'David Thompson',
    role: 'VP Sales',
    region: 'ALL',
    hireDate: '2016-01-01',
    quota: 2500000,
    planId: 'PLAN-VP-001',
    planName: 'VP Sales Plan',
    currentPeriod: {
      actualSales: 2850000,
      earnings: 125000,
      paidAmount: 125000,
      pendingAmount: 0,
      attainment: 114
    },
    historicalEarnings: [
      { month: '2024-10', earnings: 108000, sales: 2420000, attainment: 97 },
      { month: '2024-11', earnings: 118000, sales: 2650000, attainment: 106 },
      { month: '2024-12', earnings: 112000, sales: 2520000, attainment: 101 },
      { month: '2025-01', earnings: 125000, sales: 2850000, attainment: 114 }
    ]
  })
];

/**
 * Get a payee by ID
 * @param {string} id - Payee ID
 * @returns {Object|undefined} The payee or undefined
 */
export function getPayeeById(id) {
  return mockPayees.find(payee => payee.id === id);
}

/**
 * Get payees by role
 * @param {string} role - Payee role
 * @returns {Array} Array of payees
 */
export function getPayeesByRole(role) {
  return mockPayees.filter(payee => payee.role === role);
}

/**
 * Get payees by region
 * @param {string} region - Region code
 * @returns {Array} Array of payees
 */
export function getPayeesByRegion(region) {
  return mockPayees.filter(payee => payee.region.startsWith(region) || payee.region === region);
}

/**
 * Get payees by plan
 * @param {string} planId - Plan ID
 * @returns {Array} Array of payees
 */
export function getPayeesByPlan(planId) {
  return mockPayees.filter(payee => payee.planId === planId);
}

/**
 * Get payees by status
 * @param {string} status - Status ('Active', 'Inactive', 'On Leave')
 * @returns {Array} Array of payees
 */
export function getPayeesByStatus(status) {
  return mockPayees.filter(payee => payee.status === status);
}

/**
 * Calculate payee summary statistics
 * @param {Array} payees - Array of payees (defaults to all mock payees)
 * @returns {Object} Summary statistics
 */
export function calculatePayeeSummary(payees = mockPayees) {
  const summary = {
    totalPayees: payees.length,
    activePayees: 0,
    totalEarnings: 0,
    totalPaid: 0,
    totalPending: 0,
    averageAttainment: 0,
    byRole: {},
    byRegion: {},
    topEarners: []
  };

  let totalAttainment = 0;

  payees.forEach(payee => {
    if (payee.status === 'Active') {
      summary.activePayees++;
    }

    summary.totalEarnings += payee.currentPeriod.earnings;
    summary.totalPaid += payee.currentPeriod.paidAmount;
    summary.totalPending += payee.currentPeriod.pendingAmount;
    totalAttainment += payee.currentPeriod.attainment;

    // Group by role
    if (!summary.byRole[payee.role]) {
      summary.byRole[payee.role] = { count: 0, earnings: 0 };
    }
    summary.byRole[payee.role].count++;
    summary.byRole[payee.role].earnings += payee.currentPeriod.earnings;

    // Group by region
    const regionKey = payee.region.split('-')[0];
    if (!summary.byRegion[regionKey]) {
      summary.byRegion[regionKey] = { count: 0, earnings: 0 };
    }
    summary.byRegion[regionKey].count++;
    summary.byRegion[regionKey].earnings += payee.currentPeriod.earnings;
  });

  summary.averageAttainment = Math.round(totalAttainment / payees.length);

  // Get top 5 earners
  summary.topEarners = [...payees]
    .sort((a, b) => b.currentPeriod.earnings - a.currentPeriod.earnings)
    .slice(0, 5)
    .map(p => ({ id: p.id, name: p.name, earnings: p.currentPeriod.earnings }));

  return summary;
}

/**
 * Get overpaid/underpaid payees
 * @param {number} threshold - Variance threshold (default 100)
 * @returns {Array} Array of payees with significant variance
 */
export function getPayeesWithVariance(threshold = 100) {
  return mockPayees
    .map(payee => {
      const variance = payee.currentPeriod.paidAmount - payee.currentPeriod.earnings;
      return {
        ...payee,
        variance,
        status: variance > 0 ? 'Overpaid' : variance < 0 ? 'Underpaid' : 'Balanced'
      };
    })
    .filter(payee => Math.abs(payee.variance) >= threshold);
}
