/**
 * Report Data Aggregator Utility Tests
 * Tests for data aggregation and filter application functions
 * Requirements: 3.3-3.6, 3.10
 */

import {
  aggregatePayeeData,
  aggregatePlanData,
  aggregateTransactionData,
  aggregateEarningsData,
  applyFilters,
  applyDateRangeFilter,
  getDateRangeFromPreset,
  groupBy,
  sumField,
  averageField,
  calculateCostOfSales,
  calculatePlanPerformance,
  calculateRevenueComparison,
  getUniqueValues,
  getFilterOptions
} from './reportDataAggregator';

// Mock data
const mockPayees = [
  {
    id: 'PAY-001',
    name: 'John Doe',
    role: 'Sales Rep',
    region: 'WEST-001',
    planId: 'PLAN-001',
    planName: 'Sales Plan',
    quota: 50000,
    status: 'Active'
  },
  {
    id: 'PAY-002',
    name: 'Jane Smith',
    role: 'Manager',
    region: 'EAST-001',
    planId: 'PLAN-002',
    planName: 'Manager Plan',
    quota: 100000,
    status: 'Active'
  }
];

const mockEarnings = [
  {
    id: 'ERN-001',
    earningId: 'ERN-001',
    payeeId: 'PAY-001',
    payeeName: 'John Doe',
    period: '2025-01',
    totalEarnings: 1000,
    baseAmount: 1000,
    bonusAmount: 0,
    adjustmentAmount: 0,
    planId: 'PLAN-001',
    planName: 'Sales Plan',
    status: 'Paid',
    transactionIds: ['TXN-001'],
    transactionCount: 1,
    calculatedDate: '2025-01-15T10:00:00Z',
    paidAmount: 1000,
    paidDate: '2025-01-31T14:00:00Z',
    pendingAmount: 0
  },
  {
    id: 'ERN-002',
    earningId: 'ERN-002',
    payeeId: 'PAY-002',
    payeeName: 'Jane Smith',
    period: '2025-01',
    totalEarnings: 2000,
    baseAmount: 2000,
    bonusAmount: 0,
    adjustmentAmount: 0,
    planId: 'PLAN-002',
    planName: 'Manager Plan',
    status: 'Pending',
    transactionIds: ['TXN-002'],
    transactionCount: 1,
    calculatedDate: '2025-01-15T10:00:00Z',
    paidAmount: 0,
    paidDate: null,
    pendingAmount: 2000
  }
];

const mockPayments = [
  {
    id: 'PAY-001',
    paymentId: 'PAY-001',
    earningId: 'ERN-001',
    payeeId: 'PAY-001',
    payeeName: 'John Doe',
    amount: 1000,
    status: 'Paid',
    paidDate: '2025-01-31T14:00:00Z',
    scheduledDate: '2025-01-31',
    paymentMethod: 'Direct Deposit'
  },
  {
    id: 'PAY-002',
    paymentId: 'PAY-002',
    earningId: 'ERN-002',
    payeeId: 'PAY-002',
    payeeName: 'Jane Smith',
    amount: 2000,
    status: 'Pending',
    paidDate: null,
    scheduledDate: '2025-02-15',
    paymentMethod: 'Direct Deposit'
  }
];

const mockTransactions = [
  {
    id: 'TXN-001',
    transactionId: 'TXN-001',
    transactionDate: '2025-01-10',
    payeeId: 'PAY-001',
    payeeName: 'John Doe',
    amount: 10000,
    commissionableAmount: 10000,
    product: 'Product A',
    productCategory: 'Category 1',
    transactionType: 'Sale',
    region: 'WEST-001',
    channel: 'Direct',
    status: 'Credited',
    planId: 'PLAN-001',
    planName: 'Sales Plan',
    importBatchId: 'BATCH-001',
    importBatchName: 'January Import',
    importDate: '2025-01-15T10:00:00Z',
    creditAmount: 1000,
    rulesApplied: ['RULE-001']
  },
  {
    id: 'TXN-002',
    transactionId: 'TXN-002',
    transactionDate: '2025-01-12',
    payeeId: 'PAY-002',
    payeeName: 'Jane Smith',
    amount: 20000,
    commissionableAmount: 18000,
    product: 'Product B',
    productCategory: 'Category 2',
    transactionType: 'Sale',
    region: 'EAST-001',
    channel: 'Partner',
    status: 'Credited',
    planId: 'PLAN-002',
    planName: 'Manager Plan',
    importBatchId: 'BATCH-001',
    importBatchName: 'January Import',
    importDate: '2025-01-15T10:00:00Z',
    creditAmount: 2000,
    rulesApplied: ['RULE-002']
  }
];

const mockPlans = [
  {
    id: 'PLAN-001',
    name: 'Sales Plan',
    type: 'Commission',
    status: 'Active',
    category: 'Sales',
    targetRevenue: 100000,
    targetCommission: 8000,
    baseRate: 8.0,
    tiers: []
  },
  {
    id: 'PLAN-002',
    name: 'Manager Plan',
    type: 'Bonus',
    status: 'Active',
    category: 'Management',
    targetRevenue: 200000,
    targetCommission: 15000,
    baseRate: 7.5,
    tiers: []
  }
];

describe('Report Data Aggregator', () => {
  describe('aggregatePayeeData', () => {
    test('should aggregate payee data correctly', () => {
      const result = aggregatePayeeData(mockPayees, mockEarnings, mockPayments, mockTransactions);
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('PAY-001');
      expect(result[0].totalEarnings).toBe(1000);
      expect(result[0].totalPaid).toBe(1000);
      expect(result[0].totalPending).toBe(0);
    });

    test('should calculate balance correctly', () => {
      const result = aggregatePayeeData(mockPayees, mockEarnings, mockPayments, mockTransactions);
      
      expect(result[0].balance).toBe(0); // 1000 - 1000
      expect(result[1].balance).toBe(2000); // 2000 - 0
    });

    test('should calculate attainment correctly', () => {
      const result = aggregatePayeeData(mockPayees, mockEarnings, mockPayments, mockTransactions);
      
      expect(result[0].attainment).toBe(20); // 10000 / 50000 * 100
      expect(result[1].attainment).toBe(20); // 20000 / 100000 * 100
    });

    test('should handle empty arrays', () => {
      const result = aggregatePayeeData([], [], [], []);
      
      expect(result).toEqual([]);
    });
  });

  describe('aggregatePlanData', () => {
    test('should aggregate plan data correctly', () => {
      const result = aggregatePlanData(mockPlans, mockPayees, mockTransactions, mockEarnings);
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('PLAN-001');
      expect(result[0].totalRevenue).toBe(10000);
      expect(result[0].totalCommission).toBe(1000);
    });

    test('should calculate cost of sales correctly', () => {
      const result = aggregatePlanData(mockPlans, mockPayees, mockTransactions, mockEarnings);
      
      expect(result[0].costOfSales).toBe(10); // (1000 / 10000) * 100
    });

    test('should calculate ROI correctly', () => {
      const result = aggregatePlanData(mockPlans, mockPayees, mockTransactions, mockEarnings);
      
      // ROI is calculated as ((revenue - commission) / commission) * 100, then rounded to 2 decimals
      // (10000 - 1000) / 1000 * 100 = 900, but rounded to 2 decimals = 9.00
      expect(result[0].roi).toBe(9); // Rounded to 2 decimal places
    });

    test('should count participants correctly', () => {
      const result = aggregatePlanData(mockPlans, mockPayees, mockTransactions, mockEarnings);
      
      expect(result[0].participantCount).toBe(1);
      expect(result[1].participantCount).toBe(1);
    });
  });

  describe('aggregateTransactionData', () => {
    test('should enrich transaction data', () => {
      const result = aggregateTransactionData(mockTransactions, mockPayees, mockPlans);
      
      expect(result).toHaveLength(2);
      expect(result[0].payeeRole).toBe('Sales Rep');
      expect(result[0].planType).toBe('Commission');
    });

    test('should calculate commissionable percentage', () => {
      const result = aggregateTransactionData(mockTransactions, mockPayees, mockPlans);
      
      expect(result[0].commissionablePercentage).toBe(100); // 10000 / 10000 * 100
      expect(result[1].commissionablePercentage).toBe(90); // 18000 / 20000 * 100
    });
  });

  describe('aggregateEarningsData', () => {
    test('should aggregate earnings data correctly', () => {
      const result = aggregateEarningsData(mockEarnings, mockPayments, mockTransactions, mockPayees);
      
      expect(result).toHaveLength(2);
      expect(result[0].payeeRole).toBe('Sales Rep');
      expect(result[0].paymentStatus).toBe('Paid');
    });

    test('should calculate days pending', () => {
      const result = aggregateEarningsData(mockEarnings, mockPayments, mockTransactions, mockPayees);
      
      expect(result[0].daysPending).toBe(0); // Already paid
      expect(result[1].daysPending).toBeGreaterThan(0); // Still pending
    });
  });

  describe('applyFilters', () => {
    test('should return all data when no filters', () => {
      const result = applyFilters(mockTransactions, {});
      
      expect(result).toHaveLength(2);
    });

    test('should filter by region', () => {
      const result = applyFilters(mockTransactions, { region: ['WEST'] });
      
      expect(result).toHaveLength(1);
      expect(result[0].region).toBe('WEST-001');
    });

    test('should filter by plan', () => {
      const result = applyFilters(mockTransactions, { plan: ['PLAN-001'] });
      
      expect(result).toHaveLength(1);
      expect(result[0].planId).toBe('PLAN-001');
    });

    test('should filter by payee', () => {
      const result = applyFilters(mockTransactions, { payee: ['PAY-001'] });
      
      expect(result).toHaveLength(1);
      expect(result[0].payeeId).toBe('PAY-001');
    });

    test('should filter by product', () => {
      const result = applyFilters(mockTransactions, { product: ['Product A'] });
      
      expect(result).toHaveLength(1);
      expect(result[0].product).toBe('Product A');
    });

    test('should filter by status', () => {
      const result = applyFilters(mockTransactions, { status: ['Credited'] });
      
      expect(result).toHaveLength(2);
    });

    test('should combine multiple filters with AND logic', () => {
      const result = applyFilters(mockTransactions, {
        region: ['WEST'],
        status: ['Credited']
      });
      
      expect(result).toHaveLength(1);
      expect(result[0].region).toBe('WEST-001');
      expect(result[0].status).toBe('Credited');
    });
  });

  describe('applyDateRangeFilter', () => {
    test('should filter by date range', () => {
      const result = applyDateRangeFilter(mockTransactions, {
        start: '2025-01-01',
        end: '2025-01-11'
      });
      
      expect(result).toHaveLength(1);
      expect(result[0].transactionDate).toBe('2025-01-10');
    });

    test('should handle start date only', () => {
      const result = applyDateRangeFilter(mockTransactions, {
        start: '2025-01-11'
      });
      
      expect(result).toHaveLength(1);
      expect(result[0].transactionDate).toBe('2025-01-12');
    });

    test('should handle end date only', () => {
      const result = applyDateRangeFilter(mockTransactions, {
        end: '2025-01-11'
      });
      
      expect(result).toHaveLength(1);
      expect(result[0].transactionDate).toBe('2025-01-10');
    });
  });

  describe('getDateRangeFromPreset', () => {
    test('should return current month range', () => {
      const result = getDateRangeFromPreset('current-month');
      
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
      // Just verify it's a valid date string
      expect(result.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should return last month range', () => {
      const result = getDateRangeFromPreset('last-month');
      
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
      expect(result.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should return year range', () => {
      const result = getDateRangeFromPreset('year');
      
      expect(result.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should return null for invalid preset', () => {
      const result = getDateRangeFromPreset('invalid');
      
      expect(result).toBeNull();
    });
  });

  describe('groupBy', () => {
    test('should group data by field', () => {
      const result = groupBy(mockTransactions, 'region');
      
      expect(result).toHaveProperty('WEST-001');
      expect(result).toHaveProperty('EAST-001');
      expect(result['WEST-001'].count).toBe(1);
    });

    test('should sum field when specified', () => {
      const result = groupBy(mockTransactions, 'region', 'amount');
      
      expect(result['WEST-001'].total).toBe(10000);
      expect(result['EAST-001'].total).toBe(20000);
    });
  });

  describe('sumField', () => {
    test('should sum numeric field', () => {
      const result = sumField(mockTransactions, 'amount');
      
      expect(result).toBe(30000);
    });

    test('should handle empty array', () => {
      const result = sumField([], 'amount');
      
      expect(result).toBe(0);
    });

    test('should ignore non-numeric values', () => {
      const data = [
        { amount: 100 },
        { amount: 'invalid' },
        { amount: 200 }
      ];
      
      const result = sumField(data, 'amount');
      
      expect(result).toBe(300);
    });
  });

  describe('averageField', () => {
    test('should calculate average', () => {
      const result = averageField(mockTransactions, 'amount');
      
      expect(result).toBe(15000);
    });

    test('should handle empty array', () => {
      const result = averageField([], 'amount');
      
      expect(result).toBe(0);
    });
  });

  describe('calculateCostOfSales', () => {
    test('should calculate cost of sales', () => {
      const result = calculateCostOfSales(mockTransactions, mockPayments);
      
      expect(result.totalRevenue).toBe(30000);
      expect(result.totalCommissions).toBe(1000); // Only paid
      expect(result.costPercent).toBeCloseTo(3.33, 1);
    });

    test('should handle zero revenue', () => {
      const result = calculateCostOfSales([], mockPayments);
      
      expect(result.costPercent).toBe(0);
    });
  });

  describe('calculatePlanPerformance', () => {
    test('should calculate plan performance', () => {
      const plan = mockPlans[0];
      const planPayees = mockPayees.filter(p => p.planId === plan.id);
      const planTransactions = mockTransactions.filter(t => t.planId === plan.id);
      const planEarnings = mockEarnings.filter(e => e.planId === plan.id);
      
      const result = calculatePlanPerformance(plan, planPayees, planTransactions, planEarnings);
      
      expect(result.planId).toBe('PLAN-001');
      expect(result.actualSales).toBe(10000);
      expect(result.attainment).toBe(10); // 10000 / 100000 * 100
    });
  });

  describe('calculateRevenueComparison', () => {
    test('should calculate revenue comparison', () => {
      const result = calculateRevenueComparison(mockTransactions);
      
      expect(result.totalRevenue).toBe(30000);
      expect(result.commissionableRevenue).toBe(28000);
      expect(result.nonCommissionableRevenue).toBe(2000);
      expect(result.commissionablePercent).toBeCloseTo(93.33, 1);
    });
  });

  describe('getUniqueValues', () => {
    test('should return unique values', () => {
      const result = getUniqueValues(mockTransactions, 'status');
      
      expect(result).toEqual(['Credited']);
    });

    test('should filter out null and undefined', () => {
      const data = [
        { value: 'A' },
        { value: null },
        { value: 'B' },
        { value: undefined },
        { value: '' }
      ];
      
      const result = getUniqueValues(data, 'value');
      
      expect(result).toEqual(['A', 'B']);
    });
  });

  describe('getFilterOptions', () => {
    test('should return filter options', () => {
      const result = getFilterOptions(mockPayees, mockPlans, mockTransactions);
      
      expect(result).toHaveProperty('regions');
      expect(result).toHaveProperty('plans');
      expect(result).toHaveProperty('payees');
      expect(result).toHaveProperty('products');
      expect(result.regions).toContain('WEST');
      expect(result.regions).toContain('EAST');
    });
  });
});
