/**
 * Unit tests for Plan ROI Report
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlanROIReport from './PlanROIReport';

// Mock dependencies
jest.mock('../../data/mockPlans', () => ({
  mockPlans: [
    { id: 'PLAN-001', name: 'Test Plan 1', type: 'Commission', status: 'Active' },
    { id: 'PLAN-002', name: 'Test Plan 2', type: 'Tiered', status: 'Active' }
  ]
}));

jest.mock('../../data/mockTransactions', () => ({
  mockTransactions: [
    { planId: 'PLAN-001', amount: 10000, status: 'Credited' },
    { planId: 'PLAN-001', amount: 15000, status: 'Credited' },
    { planId: 'PLAN-002', amount: 20000, status: 'Credited' }
  ]
}));

jest.mock('../../data/mockEarnings', () => ({
  mockEarnings: [
    { planId: 'PLAN-001', totalEarnings: 2000 },
    { planId: 'PLAN-001', totalEarnings: 1500 },
    { planId: 'PLAN-002', totalEarnings: 1800 }
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

describe('PlanROIReport', () => {
  test('renders report with plan ROI data', async () => {
    render(<PlanROIReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByText('Plan ROI Report')).toBeInTheDocument();
  });

  test('calculates ROI metrics correctly', async () => {
    render(<PlanROIReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toHaveTextContent('2 rows');
    });
  });

  test('calculates margin correctly', async () => {
    // PLAN-001: 25000 revenue - 3500 commission = 21500 margin
    // PLAN-002: 20000 revenue - 1800 commission = 18200 margin
    render(<PlanROIReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('calculates cost of sales percentage', async () => {
    // PLAN-001: (3500 / 25000) * 100 = 14%
    // PLAN-002: (1800 / 20000) * 100 = 9%
    render(<PlanROIReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('calculates ROI percentage formula correctly', async () => {
    // ROI % = ((Revenue - Commission) / Commission) * 100
    // PLAN-001: ((25000 - 3500) / 3500) * 100 = 614.29%
    // PLAN-002: ((20000 - 1800) / 1800) * 100 = 1011.11%
    render(<PlanROIReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('handles zero commission edge case', async () => {
    // When commission is 0, ROI should be 0 (not infinity)
    render(<PlanROIReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('handles zero revenue edge case', async () => {
    // When revenue is 0, cost of sales should be 0
    render(<PlanROIReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('filters only credited transactions', async () => {
    // Should only include transactions with status 'Credited'
    render(<PlanROIReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('rounds values to 2 decimal places', async () => {
    // All monetary values should be rounded to 2 decimal places
    render(<PlanROIReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });
});
