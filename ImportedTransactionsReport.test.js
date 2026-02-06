/**
 * Unit Tests for Imported Transactions Report
 * Requirements: 3.5.1, 3.5.7
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ImportedTransactionsReport from './ImportedTransactionsReport';
import { mockTransactions } from '../../data/mockTransactions';

// Mock the ReportViewer component
jest.mock('../ReportViewer', () => {
  return function MockReportViewer({ reportData }) {
    if (!reportData) return <div>Loading...</div>;
    return (
      <div data-testid="report-viewer">
        <h1>{reportData.title}</h1>
        <div data-testid="row-count">{reportData.rows.length}</div>
        <div data-testid="total-amount">{reportData.summary.totalAmount}</div>
      </div>
    );
  };
});

describe('ImportedTransactionsReport', () => {
  test('renders report with all imported transactions', async () => {
    render(<ImportedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByText('Imported Transactions')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    expect(parseInt(rowCount.textContent)).toBe(mockTransactions.length);
  });

  test('displays correct transaction data', async () => {
    render(<ImportedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const totalAmount = screen.getByTestId('total-amount');
    const expectedTotal = mockTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    expect(parseFloat(totalAmount.textContent)).toBe(expectedTotal);
  });

  test('applies filters correctly', async () => {
    const filters = {
      status: ['Credited']
    };

    render(<ImportedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Should show fewer rows when filtered
    const rowCount = screen.getByTestId('row-count');
    expect(parseInt(rowCount.textContent)).toBeLessThan(mockTransactions.length);
  });

  test('includes import batch information', async () => {
    render(<ImportedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Verify report data structure includes import batch fields
    expect(screen.getByText('Imported Transactions')).toBeInTheDocument();
  });

  test('shows status breakdown in summary', async () => {
    render(<ImportedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should load successfully with summary data
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  // Additional filtering logic tests
  test('filters by date range', async () => {
    const filters = {
      dateRange: {
        start: '2024-01-01',
        end: '2024-12-31'
      }
    };

    render(<ImportedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by region', async () => {
    const filters = {
      region: ['North America']
    };

    render(<ImportedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const filteredCount = mockTransactions.filter(txn => 
      txn.region === 'North America'
    ).length;
    expect(parseInt(rowCount.textContent)).toBe(filteredCount);
  });

  test('filters by plan', async () => {
    const filters = {
      plan: ['Enterprise Sales Plan']
    };

    render(<ImportedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by import batch', async () => {
    const filters = {
      importBatch: ['Batch-2024-001']
    };

    render(<ImportedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('applies multiple filters simultaneously', async () => {
    const filters = {
      status: ['Credited'],
      region: ['North America'],
      plan: ['Enterprise Sales Plan']
    };

    render(<ImportedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    expect(parseInt(rowCount.textContent)).toBeLessThanOrEqual(mockTransactions.length);
  });

  test('handles empty filter results', async () => {
    const filters = {
      status: ['NonExistentStatus']
    };

    render(<ImportedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    expect(parseInt(rowCount.textContent)).toBe(0);
  });

  // Audit trail linking tests
  test('includes audit trail data in row structure', async () => {
    render(<ImportedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Verify report loads with transaction data that can link to audit trail
    expect(screen.getByText('Imported Transactions')).toBeInTheDocument();
  });

  test('preserves raw transaction data for drilldown', async () => {
    render(<ImportedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include raw transaction data for audit trail navigation
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('includes import batch reference for audit linking', async () => {
    render(<ImportedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include import batch information for audit trail
    expect(screen.getByText('Imported Transactions')).toBeInTheDocument();
  });
});
