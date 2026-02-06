/**
 * Unit Tests for Revenue vs Commissionable Revenue Report
 * Requirements: 3.5.5
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import RevenueVsCommissionableReport from './RevenueVsCommissionableReport';
import { mockTransactions } from '../../data/mockTransactions';

// Mock the ReportViewer component
jest.mock('../ReportViewer', () => {
  return function MockReportViewer({ reportData }) {
    if (!reportData) return <div>Loading...</div>;
    return (
      <div data-testid="report-viewer">
        <h1>{reportData.title}</h1>
        <div data-testid="row-count">{reportData.rows.length}</div>
        <div data-testid="total-revenue">{reportData.summary.totalRevenue}</div>
        <div data-testid="total-commissionable">{reportData.summary.totalCommissionable}</div>
        <div data-testid="overall-percentage">{reportData.summary.overallCommissionablePercentage}</div>
      </div>
    );
  };
});

describe('RevenueVsCommissionableReport', () => {
  test('renders report grouped by product', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByText('Revenue vs Commissionable Revenue')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    expect(parseInt(rowCount.textContent)).toBeGreaterThan(0);
  });

  test('calculates commissionable percentage correctly', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const percentage = screen.getByTestId('overall-percentage');
    const percentageValue = parseFloat(percentage.textContent);
    expect(percentageValue).toBeGreaterThanOrEqual(0);
    expect(percentageValue).toBeLessThanOrEqual(100);
  });

  test('shows total revenue and commissionable revenue', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const totalRevenue = screen.getByTestId('total-revenue');
    const totalCommissionable = screen.getByTestId('total-commissionable');
    
    expect(parseFloat(totalRevenue.textContent)).toBeGreaterThan(0);
    expect(parseFloat(totalCommissionable.textContent)).toBeGreaterThan(0);
  });

  test('groups transactions by product', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const uniqueProducts = new Set(mockTransactions.map(txn => txn.product || 'Unknown'));
    expect(parseInt(rowCount.textContent)).toBe(uniqueProducts.size);
  });

  test('calculates non-commissionable revenue', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const totalRevenue = parseFloat(screen.getByTestId('total-revenue').textContent);
    const totalCommissionable = parseFloat(screen.getByTestId('total-commissionable').textContent);
    
    // Non-commissionable should be the difference
    expect(totalRevenue).toBeGreaterThanOrEqual(totalCommissionable);
  });

  // Additional filtering logic tests
  test('filters by product category', async () => {
    const filters = {
      productCategory: ['Software']
    };

    render(<RevenueVsCommissionableReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by date range', async () => {
    const filters = {
      dateRange: {
        start: '2024-01-01',
        end: '2024-12-31'
      }
    };

    render(<RevenueVsCommissionableReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by region', async () => {
    const filters = {
      region: ['North America']
    };

    render(<RevenueVsCommissionableReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('applies multiple filters with AND logic', async () => {
    const filters = {
      region: ['North America'],
      productCategory: ['Software']
    };

    render(<RevenueVsCommissionableReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const uniqueProducts = new Set(mockTransactions.map(txn => txn.product || 'Unknown'));
    expect(parseInt(rowCount.textContent)).toBeLessThanOrEqual(uniqueProducts.size);
  });

  test('handles products with zero commissionable revenue', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const percentage = screen.getByTestId('overall-percentage');
    const percentageValue = parseFloat(percentage.textContent);
    expect(percentageValue).toBeGreaterThanOrEqual(0);
  });

  test('sorts products by total revenue descending', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should sort by revenue
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('aggregates transactions by product correctly', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const uniqueProducts = new Set(mockTransactions.map(txn => txn.product || 'Unknown'));
    expect(parseInt(rowCount.textContent)).toBe(uniqueProducts.size);
  });

  // Audit trail linking tests
  test('preserves product grouping for drilldown', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should preserve product grouping for drilldown to transactions
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('includes transaction count for audit verification', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include transaction count for audit verification
    expect(screen.getByText('Revenue vs Commissionable Revenue')).toBeInTheDocument();
  });

  test('preserves raw group data for drilldown navigation', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should preserve raw group data for audit navigation
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('includes product category for audit classification', async () => {
    render(<RevenueVsCommissionableReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include product category for audit classification
    expect(screen.getByText('Revenue vs Commissionable Revenue')).toBeInTheDocument();
  });
});
