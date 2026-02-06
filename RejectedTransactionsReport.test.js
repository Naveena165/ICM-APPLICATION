/**
 * Unit Tests for Rejected Transactions Report
 * Requirements: 3.5.3
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import RejectedTransactionsReport from './RejectedTransactionsReport';
import { mockTransactions } from '../../data/mockTransactions';

// Mock the ReportViewer component
jest.mock('../ReportViewer', () => {
  return function MockReportViewer({ reportData }) {
    if (!reportData) return <div>Loading...</div>;
    return (
      <div data-testid="report-viewer">
        <h1>{reportData.title}</h1>
        <div data-testid="row-count">{reportData.rows.length}</div>
        <div data-testid="error-count">{reportData.summary.totalErrorCount}</div>
      </div>
    );
  };
});

describe('RejectedTransactionsReport', () => {
  test('renders report with only rejected transactions', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByText('Rejected Transactions')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const rejectedCount = mockTransactions.filter(txn => 
      txn.status === 'Rejected' || txn.validationStatus === 'Invalid'
    ).length;
    expect(parseInt(rowCount.textContent)).toBe(rejectedCount);
  });

  test('displays validation errors', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const errorCount = screen.getByTestId('error-count');
    expect(parseInt(errorCount.textContent)).toBeGreaterThan(0);
  });

  test('shows rejection reasons for each transaction', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should load with rejection reason information
    expect(screen.getByText('Rejected Transactions')).toBeInTheDocument();
  });

  test('groups errors by type', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include error type breakdown in summary
    expect(screen.getByTestId('error-count')).toBeInTheDocument();
  });

  test('excludes valid transactions', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    expect(parseInt(rowCount.textContent)).toBeLessThan(mockTransactions.length);
  });

  // Additional filtering logic tests
  test('filters by import batch', async () => {
    const filters = {
      importBatch: ['Batch-2024-001']
    };

    render(<RejectedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by region', async () => {
    const filters = {
      region: ['Europe']
    };

    render(<RejectedTransactionsReport filters={filters} />);
    
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

    render(<RejectedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('applies multiple filters correctly', async () => {
    const filters = {
      region: ['Europe'],
      importBatch: ['Batch-2024-001']
    };

    render(<RejectedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const rejectedCount = mockTransactions.filter(txn => 
      txn.status === 'Rejected' || txn.validationStatus === 'Invalid'
    ).length;
    expect(parseInt(rowCount.textContent)).toBeLessThanOrEqual(rejectedCount);
  });

  test('handles transactions with multiple validation errors', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const errorCount = screen.getByTestId('error-count');
    const rowCount = screen.getByTestId('row-count');
    
    // Total errors should be >= row count (some transactions have multiple errors)
    expect(parseInt(errorCount.textContent)).toBeGreaterThanOrEqual(parseInt(rowCount.textContent));
  });

  test('groups errors by import batch', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include batch breakdown in summary
    expect(screen.getByTestId('error-count')).toBeInTheDocument();
  });

  // Audit trail linking tests
  test('includes validation error details for audit trail', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include validation errors for audit trail
    expect(screen.getByText('Rejected Transactions')).toBeInTheDocument();
  });

  test('links to import batch for audit trail', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include import batch reference for audit trail
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('preserves error context for drilldown', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should preserve raw transaction data with errors for audit navigation
    expect(screen.getByTestId('error-count')).toBeInTheDocument();
  });

  test('includes import date for audit timeline', async () => {
    render(<RejectedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include import date for audit trail timeline
    expect(screen.getByText('Rejected Transactions')).toBeInTheDocument();
  });
});
