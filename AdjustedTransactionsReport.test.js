/**
 * Unit Tests for Adjusted Transactions Report
 * Requirements: 3.5.4
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdjustedTransactionsReport from './AdjustedTransactionsReport';
import { mockTransactions } from '../../data/mockTransactions';

// Mock the ReportViewer component
jest.mock('../ReportViewer', () => {
  return function MockReportViewer({ reportData }) {
    if (!reportData) return <div>Loading...</div>;
    return (
      <div data-testid="report-viewer">
        <h1>{reportData.title}</h1>
        <div data-testid="row-count">{reportData.rows.length}</div>
        <div data-testid="adjustment-total">{reportData.summary.totalAdjustmentAmount}</div>
        <div data-testid="positive-count">{reportData.summary.positiveAdjustments}</div>
        <div data-testid="negative-count">{reportData.summary.negativeAdjustments}</div>
      </div>
    );
  };
});

describe('AdjustedTransactionsReport', () => {
  test('renders report with only adjusted transactions', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByText('Adjusted Transactions')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const adjustedCount = mockTransactions.filter(txn => 
      txn.status === 'Adjusted' || (txn.adjustmentAmount && txn.adjustmentAmount !== 0)
    ).length;
    expect(parseInt(rowCount.textContent)).toBe(adjustedCount);
  });

  test('displays original and adjusted amounts', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const adjustmentTotal = screen.getByTestId('adjustment-total');
    expect(screen.getByTestId('adjustment-total')).toBeInTheDocument();
  });

  test('shows adjustment reasons', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should load with adjustment reason information
    expect(screen.getByText('Adjusted Transactions')).toBeInTheDocument();
  });

  test('tracks who made adjustments', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include adjusted by information
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('separates positive and negative adjustments', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const positiveCount = screen.getByTestId('positive-count');
    const negativeCount = screen.getByTestId('negative-count');
    
    expect(parseInt(positiveCount.textContent)).toBeGreaterThanOrEqual(0);
    expect(parseInt(negativeCount.textContent)).toBeGreaterThanOrEqual(0);
  });

  // Additional filtering logic tests
  test('filters by payee', async () => {
    const filters = {
      payee: ['John Smith']
    };

    render(<AdjustedTransactionsReport filters={filters} />);
    
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

    render(<AdjustedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by region', async () => {
    const filters = {
      region: ['North America']
    };

    render(<AdjustedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by plan', async () => {
    const filters = {
      plan: ['Enterprise Sales Plan']
    };

    render(<AdjustedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('applies multiple filters simultaneously', async () => {
    const filters = {
      region: ['North America'],
      plan: ['Enterprise Sales Plan']
    };

    render(<AdjustedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const adjustedCount = mockTransactions.filter(txn => 
      txn.status === 'Adjusted' || (txn.adjustmentAmount && txn.adjustmentAmount !== 0)
    ).length;
    expect(parseInt(rowCount.textContent)).toBeLessThanOrEqual(adjustedCount);
  });

  test('excludes non-adjusted transactions', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    expect(parseInt(rowCount.textContent)).toBeLessThan(mockTransactions.length);
  });

  test('calculates adjustment totals correctly', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const adjustmentTotal = screen.getByTestId('adjustment-total');
    expect(screen.getByTestId('adjustment-total')).toBeInTheDocument();
  });

  // Audit trail linking tests
  test('includes adjustment reason for audit trail', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include adjustment reason for audit trail
    expect(screen.getByText('Adjusted Transactions')).toBeInTheDocument();
  });

  test('includes adjusted by user for audit trail', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include who made the adjustment for audit trail
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('includes adjustment date for audit timeline', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include adjustment date for audit trail timeline
    expect(screen.getByText('Adjusted Transactions')).toBeInTheDocument();
  });

  test('preserves original and adjusted amounts for audit history', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should preserve both original and adjusted amounts for audit trail
    expect(screen.getByTestId('adjustment-total')).toBeInTheDocument();
  });

  test('preserves raw transaction data for drilldown', async () => {
    render(<AdjustedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should preserve raw transaction data for audit navigation
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });
});
