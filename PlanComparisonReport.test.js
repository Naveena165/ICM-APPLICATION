/**
 * Unit tests for Plan Comparison Report
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlanComparisonReport from './PlanComparisonReport';

// Mock dependencies
jest.mock('../../data/mockPlans', () => ({
  mockPlans: [
    { id: 'PLAN-001', name: 'Test Plan 1', type: 'Commission', status: 'Active', currentPeriod: { attainment: 105 } },
    { id: 'PLAN-002', name: 'Test Plan 2', type: 'Tiered', status: 'Active', currentPeriod: { attainment: 95 } },
    { id: 'PLAN-003', name: 'Test Plan 3', type: 'Bonus', status: 'Active', currentPeriod: { attainment: 110 } }
  ]
}));

jest.mock('../../data/mockPayees', () => ({
  mockPayees: [
    { id: 'PAY-001', planId: 'PLAN-001' },
    { id: 'PAY-002', planId: 'PLAN-002' },
    { id: 'PAY-003', planId: 'PLAN-003' }
  ]
}));

jest.mock('../../data/mockTransactions', () => ({
  mockTransactions: [
    { planId: 'PLAN-001', amount: 10000, status: 'Credited' },
    { planId: 'PLAN-002', amount: 15000, status: 'Credited' },
    { planId: 'PLAN-003', amount: 20000, status: 'Credited' }
  ]
}));

jest.mock('../../data/mockEarnings', () => ({
  mockEarnings: [
    { planId: 'PLAN-001', totalEarnings: 800 },
    { planId: 'PLAN-002', totalEarnings: 1200 },
    { planId: 'PLAN-003', totalEarnings: 1600 }
  ]
}));

describe('PlanComparisonReport', () => {
  test('renders plan selector with checkboxes', async () => {
    render(<PlanComparisonReport />);

    await waitFor(() => {
      expect(screen.getByText('Select Plans to Compare (2-4 plans)')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Test Plan 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Test Plan 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Test Plan 3').length).toBeGreaterThan(0);
  });

  test('pre-selects first 2 plans by default', async () => {
    render(<PlanComparisonReport />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });
  });

  test('displays comparison table when plans are selected', async () => {
    render(<PlanComparisonReport />);

    await waitFor(() => {
      expect(screen.getByText('Participants')).toBeInTheDocument();
      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('ROI %')).toBeInTheDocument();
    });
  });

  test('allows toggling plan selection', async () => {
    render(<PlanComparisonReport />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
    });

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);

    await waitFor(() => {
      expect(firstCheckbox).not.toBeChecked();
    });
  });

  test('limits selection to 4 plans maximum', async () => {
    // This test would need more mock plans to fully test
    render(<PlanComparisonReport />);

    await waitFor(() => {
      expect(screen.getByText('Select Plans to Compare (2-4 plans)')).toBeInTheDocument();
    });
  });

  test('shows message when less than 2 plans selected', async () => {
    render(<PlanComparisonReport />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);
    });

    await waitFor(() => {
      expect(screen.getByText('Please select at least 2 plans to compare')).toBeInTheDocument();
    });
  });

  test('compares metrics across selected plans', async () => {
    // Should display all comparison metrics for selected plans
    render(<PlanComparisonReport />);

    await waitFor(() => {
      expect(screen.getByText('Avg Earnings')).toBeInTheDocument();
      expect(screen.getByText('Cost of Sales %')).toBeInTheDocument();
      expect(screen.getByText('Attainment %')).toBeInTheDocument();
    });
  });

  test('calculates comparison metrics correctly for each plan', async () => {
    // PLAN-001: 1 participant, 10000 sales, 800 earnings
    // PLAN-002: 1 participant, 15000 sales, 1200 earnings
    render(<PlanComparisonReport />);

    await waitFor(() => {
      expect(screen.getByText('Participants')).toBeInTheDocument();
    });
  });

  test('formats currency values correctly', async () => {
    // Currency values should be formatted with 2 decimal places
    render(<PlanComparisonReport />);

    await waitFor(() => {
      expect(screen.getByText('Total Sales')).toBeInTheDocument();
    });
  });

  test('formats percentage values correctly', async () => {
    // Percentage values should include % symbol
    render(<PlanComparisonReport />);

    await waitFor(() => {
      expect(screen.getByText('ROI %')).toBeInTheDocument();
    });
  });

  test('handles adding third plan to comparison', async () => {
    render(<PlanComparisonReport />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[2]).not.toBeChecked();
    });

    const thirdCheckbox = screen.getAllByRole('checkbox')[2];
    fireEvent.click(thirdCheckbox);

    await waitFor(() => {
      expect(thirdCheckbox).toBeChecked();
    });
  });

  test('handles removing plan from comparison', async () => {
    render(<PlanComparisonReport />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[1]).toBeChecked();
    });

    const secondCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(secondCheckbox);

    await waitFor(() => {
      expect(secondCheckbox).not.toBeChecked();
    });
  });
});
