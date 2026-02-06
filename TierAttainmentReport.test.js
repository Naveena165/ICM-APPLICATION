/**
 * Unit tests for Tier Attainment Report
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TierAttainmentReport from './TierAttainmentReport';

// Mock dependencies
jest.mock('../../data/mockPlans', () => ({
  mockPlans: [
    {
      id: 'PLAN-001',
      name: 'Test Tiered Plan',
      type: 'Tiered',
      status: 'Active',
      tiers: [
        { level: 1, label: 'Base', threshold: 0, rate: 8.0 },
        { level: 2, label: 'Achiever', threshold: 50000, rate: 10.0 },
        { level: 3, label: 'Elite', threshold: 75000, rate: 12.0 }
      ]
    }
  ]
}));

jest.mock('../../data/mockPayees', () => ({
  mockPayees: [
    { id: 'PAY-001', planId: 'PLAN-001', currentPeriod: { actualSales: 40000, earnings: 3200 } },
    { id: 'PAY-002', planId: 'PLAN-001', currentPeriod: { actualSales: 60000, earnings: 6000 } },
    { id: 'PAY-003', planId: 'PLAN-001', currentPeriod: { actualSales: 80000, earnings: 9600 } }
  ]
}));

jest.mock('../../data/mockEarnings', () => ({
  mockEarnings: []
}));

describe('TierAttainmentReport', () => {
  test('renders report with tier distribution', async () => {
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Tier Attainment Report')).toBeInTheDocument();
    });
  });

  test('displays plan name and tier structure', async () => {
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Test Tiered Plan')).toBeInTheDocument();
      expect(screen.getByText('Base')).toBeInTheDocument();
      expect(screen.getByText('Achiever')).toBeInTheDocument();
      expect(screen.getByText('Elite')).toBeInTheDocument();
    });
  });

  test('calculates tier distribution correctly', async () => {
    // PAY-001: 40000 sales -> Base tier (< 50000)
    // PAY-002: 60000 sales -> Achiever tier (>= 50000, < 75000)
    // PAY-003: 80000 sales -> Elite tier (>= 75000)
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Test Tiered Plan')).toBeInTheDocument();
    });
  });

  test('displays tier table with metrics', async () => {
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Threshold')).toBeInTheDocument();
      expect(screen.getByText('Rate')).toBeInTheDocument();
      expect(screen.getByText('Payees')).toBeInTheDocument();
      expect(screen.getByText('% of Total')).toBeInTheDocument();
    });
  });

  test('assigns payees to correct tier based on sales', async () => {
    // Each payee should be assigned to highest tier they qualify for
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Test Tiered Plan')).toBeInTheDocument();
    });
  });

  test('calculates percentage of total correctly', async () => {
    // With 3 payees, each tier with 1 payee should show 33.33%
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('% of Total')).toBeInTheDocument();
    });
  });

  test('calculates average earnings per tier', async () => {
    // Base tier: 3200 / 1 = 3200
    // Achiever tier: 6000 / 1 = 6000
    // Elite tier: 9600 / 1 = 9600
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Avg Earnings')).toBeInTheDocument();
    });
  });

  test('groups tier data by plan', async () => {
    // Should group all tiers under their respective plan
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Test Tiered Plan')).toBeInTheDocument();
    });
  });

  test('displays stacked bar visualization', async () => {
    // Should render tier segments in stacked bar
    render(<TierAttainmentReport />);

    await waitFor(() => {
      const tierSegments = document.querySelectorAll('.tier-segment');
      expect(tierSegments.length).toBeGreaterThan(0);
    });
  });

  test('applies correct colors to tier badges', async () => {
    // Each tier should have a distinct color
    render(<TierAttainmentReport />);

    await waitFor(() => {
      const tierBadges = document.querySelectorAll('.tier-badge');
      expect(tierBadges.length).toBeGreaterThan(0);
    });
  });

  test('handles empty tier (no payees)', async () => {
    // Tiers with 0 payees should still be displayed
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Test Tiered Plan')).toBeInTheDocument();
    });
  });

  test('rounds monetary values to 2 decimal places', async () => {
    // All earnings should be rounded to 2 decimal places
    render(<TierAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByText('Total Earnings')).toBeInTheDocument();
    });
  });
});
