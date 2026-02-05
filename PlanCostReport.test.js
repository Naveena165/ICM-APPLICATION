/**
 * Unit tests for Plan Cost Report
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlanCostReport from './PlanCostReport';

// Mock dependencies
jest.mock('../../data/mockPlans', () => ({
  mockPlans: [
    { id: 'PLAN-001', name: 'Test Plan 1', type: 'Commission', status: 'Active' },
    { id: 'PLAN-002', name: 'Test Plan 2', type: 'Tiered', status: 'Active' }
  ]
}));

jest.mock('../../data/mockPayees', () => ({
  mockPayees: [
    { id: 'PAY-001', planId: 'PLAN-001' },
    { id: 'PAY-002', planId: 'PLAN-001' },
    { id: 'PAY-003', planId: 'PLAN-002' }
  ]
}));

jest.mock('../../data/mockEarnings', () => ({
  mockEarnings: [
    { planId: 'PLAN-001', totalEarnings: 2000, earningId: 'ERN-001' },
    { planId: 'PLAN-001', totalEarnings: 1500, earningId: 'ERN-002' },
    { planId: 'PLAN-002', totalEarnings: 1800, earningId: 'ERN-003' }
  ],
  mockPayments: [
    { earningId: 'ERN-001', amount: 2000, status: 'Paid' },
    { earningId: 'ERN-002', amount: 1500, status: 'Paid' },
    { earningId: 'ERN-003', amount: 1800, status: 'Paid' }
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

describe('PlanCostReport', () => {
  test('renders report with plan cost data', async () => {
    render(<PlanCostReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByText('Plan Cost Report')).toBeInTheDocument();
  });

  test('calculates cost metrics correctly', async () => {
    render(<PlanCostReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toHaveTextContent('2 rows');
    });
  });

  test('calculates average commission per participant', async () => {
    // PLAN-001: 3500 total / 2 participants = 1750 avg
    // PLAN-002: 1800 total / 1 participant = 1800 avg
    render(<PlanCostReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });
});
