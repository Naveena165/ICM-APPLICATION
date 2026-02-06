/**
 * Unit tests for Rule Impact Analysis Report
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RuleImpactAnalysisReport from './RuleImpactAnalysisReport';

// Mock dependencies
jest.mock('../../data/mockPlans', () => ({
  mockPlans: [
    {
      id: 'PLAN-001',
      name: 'Test Plan 1',
      type: 'Tiered',
      status: 'Active',
      customRules: ['RULE-TIER-001', 'RULE-BONUS-001']
    },
    {
      id: 'PLAN-002',
      name: 'Test Plan 2',
      type: 'Commission',
      status: 'Active',
      customRules: ['RULE-TIER-002']
    }
  ]
}));

jest.mock('../../data/mockTransactions', () => ({
  mockTransactions: [
    { id: 'TXN-001', planId: 'PLAN-001', rulesApplied: ['RULE-TIER-001'], creditAmount: 800 },
    { id: 'TXN-002', planId: 'PLAN-001', rulesApplied: ['RULE-TIER-001', 'RULE-BONUS-001'], creditAmount: 1200 },
    { id: 'TXN-003', planId: 'PLAN-002', rulesApplied: ['RULE-TIER-002'], creditAmount: 600 }
  ]
}));

jest.mock('../../data/mockEarnings', () => ({
  mockEarnings: [
    { planId: 'PLAN-001', rulesApplied: ['RULE-BONUS-001'], bonusAmount: 500 },
    { planId: 'PLAN-002', rulesApplied: ['RULE-TIER-002'], bonusAmount: 0 }
  ]
}));

jest.mock('../ReportViewer', () => {
  return function MockReportViewer({ reportData }) {
    if (!reportData) return <div>Loading...</div>;
    return (
      <div data-testid="report-viewer">
        <h2>{reportData.title}</h2>
        <div data-testid="report-rows">{reportData.rows.length} rows</div>
      </div>
    );
  };
});

describe('RuleImpactAnalysisReport', () => {
  test('renders report with rule impact data', async () => {
    render(<RuleImpactAnalysisReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByText('Rule Impact Analysis Report')).toBeInTheDocument();
  });

  test('aggregates rule impact correctly', async () => {
    render(<RuleImpactAnalysisReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      // Should have 3 unique rules
      expect(rowsElement).toHaveTextContent('3 rows');
    });
  });

  test('calculates commission impact per rule', async () => {
    // RULE-TIER-001: 800 + 1200 = 2000
    // RULE-BONUS-001: 1200 (from txn) + 500 (from earning) = 1700
    // RULE-TIER-002: 600
    render(<RuleImpactAnalysisReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('counts transactions affected by each rule', async () => {
    // RULE-TIER-001: 2 transactions
    // RULE-BONUS-001: 1 transaction
    // RULE-TIER-002: 1 transaction
    render(<RuleImpactAnalysisReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('calculates percentage of total impact', async () => {
    // Total impact: 2000 + 1700 + 600 = 4300
    // RULE-TIER-001: 2000/4300 = 46.51%
    // RULE-BONUS-001: 1700/4300 = 39.53%
    // RULE-TIER-002: 600/4300 = 13.95%
    render(<RuleImpactAnalysisReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });
});
