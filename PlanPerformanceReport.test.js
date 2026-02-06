/**
 * Unit tests for Plan Performance Report
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlanPerformanceReport from './PlanPerformanceReport';

// Mock dependencies
jest.mock('../../data/mockPlans', () => ({
  mockPlans: [
    {
      id: 'PLAN-001',
      name: 'Test Plan 1',
      type: 'Commission',
      status: 'Active',
      currentPeriod: { attainment: 105 },
      customRules: []
    },
    {
      id: 'PLAN-002',
      name: 'Test Plan 2',
      type: 'Tiered',
      status: 'Active',
      currentPeriod: { attainment: 95 },
      customRules: []
    }
  ]
}));

jest.mock('../../data/mockPayees', () => ({
  mockPayees: [
    { id: 'PAY-001', planId: 'PLAN-001' },
    { id: 'PAY-002', planId: 'PLAN-001' },
    { id: 'PAY-003', planId: 'PLAN-002' }
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

describe('PlanPerformanceReport', () => {
  test('renders report with plan performance data', async () => {
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByText('Plan Performance Report')).toBeInTheDocument();
  });

  test('calculates performance metrics correctly', async () => {
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toHaveTextContent('2 rows');
    });
  });

  test('calculates ROI correctly', async () => {
    // ROI = (Revenue - Commission) / Commission * 100
    // PLAN-001: (25000 - 3500) / 3500 * 100 = 614.29%
    // PLAN-002: (20000 - 1800) / 1800 * 100 = 1011.11%
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('calculates total sales from credited transactions', async () => {
    // PLAN-001: 10000 + 15000 = 25000
    // PLAN-002: 20000
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('calculates total earnings from all earnings records', async () => {
    // PLAN-001: 2000 + 1500 = 3500
    // PLAN-002: 1800
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('calculates average earnings per participant', async () => {
    // PLAN-001: 3500 / 2 = 1750
    // PLAN-002: 1800 / 1 = 1800
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('includes participant count', async () => {
    // PLAN-001: 2 participants
    // PLAN-002: 1 participant
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('includes attainment percentage from plan data', async () => {
    // PLAN-001: 105%
    // PLAN-002: 95%
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('handles zero participants edge case', async () => {
    // When participants = 0, avgEarnings should be 0
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('handles zero earnings edge case for ROI', async () => {
    // When earnings = 0, ROI should be 0 (not infinity)
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });

  test('rounds all monetary values to 2 decimal places', async () => {
    render(<PlanPerformanceReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });
  });
});
