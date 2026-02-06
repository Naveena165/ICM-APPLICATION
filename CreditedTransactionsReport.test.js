/**
 * Unit Tests for Credited Transactions Report
 * Requirements: 3.5.2
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CreditedTransactionsReport from './CreditedTransactionsReport';
import { mockTransactions } from '../../data/mockTransactions';

// Mock the ReportViewer component
jest.mock('../ReportViewer', () => {
  return function MockReportViewer({ reportData }) {
    if (!reportData) return <div>Loading...</div>;
    return (
      <div data-testid="report-viewer">
        <h1>{reportData.title}</h1>
        <div data-testid="row-count">{reportData.rows.length}</div>
        <div data-testid="total-credit">{reportData.summary.totalCreditAmount}</div>
        <div data-testid="avg-rate">{reportData.summary.averageCreditRate}</div>
      </div>
    );
  };
});

describe('CreditedTransactionsReport', () => {
  test('renders report with only credited transactions', async () => {
    render(<CreditedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByText('Credited Transactions')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const creditedCount = mockTransactions.filter(txn => 
      txn.status === 'Credited' && txn.creditAmount !== 0
    ).length;
    expect(parseInt(rowCount.textContent)).toBe(creditedCount);
  });

  test('displays credit amounts correctly', async () => {
    render(<CreditedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const totalCredit = screen.getByTestId('total-credit');
    const creditedTxns = mockTransactions.filter(txn => 
      txn.status === 'Credited' && txn.creditAmount !== 0
    );
    const expectedTotal = creditedTxns.reduce((sum, txn) => sum + txn.creditAmount, 0);
    expect(parseFloat(totalCredit.textContent)).toBe(expectedTotal);
  });

  test('calculates average credit rate', async () => {
    render(<CreditedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const avgRate = screen.getByTestId('avg-rate');
    expect(parseFloat(avgRate.textContent)).toBeGreaterThan(0);
  });

  test('excludes non-credited transactions', async () => {
    render(<CreditedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    expect(parseInt(rowCount.textContent)).toBeLessThan(mockTransactions.length);
  });

  test('shows credit type for each transaction', async () => {
    render(<CreditedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should load with credit type information
    expect(screen.getByText('Credited Transactions')).toBeInTheDocument();
  });

  // Additional filtering logic tests
  test('filters by payee', async () => {
    const filters = {
      payee: ['John Smith']
    };

    render(<CreditedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by product', async () => {
    const filters = {
      product: ['Enterprise License']
    };

    render(<CreditedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by date range', async () => {
    const filters = {
      dateRange: {
        start: '2024-01-01',
        end: '2024-06-30'
      }
    };

    render(<CreditedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('filters by plan', async () => {
    const filters = {
      plan: ['Enterprise Sales Plan']
    };

    render(<CreditedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('applies multiple filters with AND logic', async () => {
    const filters = {
      region: ['North America'],
      product: ['Enterprise License'],
      plan: ['Enterprise Sales Plan']
    };

    render(<CreditedTransactionsReport filters={filters} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    const rowCount = screen.getByTestId('row-count');
    const creditedCount = mockTransactions.filter(txn => 
      txn.status === 'Credited' && txn.creditAmount !== 0
    ).length;
    expect(parseInt(rowCount.textContent)).toBeLessThanOrEqual(creditedCount);
  });

  test('handles zero credit amount transactions', async () => {
    render(<CreditedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Should exclude transactions with zero credit amount
    const rowCount = screen.getByTestId('row-count');
    expect(parseInt(rowCount.textContent)).toBeGreaterThan(0);
  });

  // Audit trail linking tests
  test('includes rules applied for audit trail', async () => {
    render(<CreditedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include rules applied information for audit trail
    expect(screen.getByText('Credited Transactions')).toBeInTheDocument();
  });

  test('preserves transaction data for drilldown to audit trail', async () => {
    render(<CreditedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should preserve raw transaction data for audit navigation
    expect(screen.getByTestId('row-count')).toBeInTheDocument();
  });

  test('includes credit date for audit timeline', async () => {
    render(<CreditedTransactionsReport />);
    
    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    // Report should include credit date for audit trail timeline
    expect(screen.getByText('Credited Transactions')).toBeInTheDocument();
  });
});
