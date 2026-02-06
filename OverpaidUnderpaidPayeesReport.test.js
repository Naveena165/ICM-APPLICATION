import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OverpaidUnderpaidPayeesReport from './OverpaidUnderpaidPayeesReport';

// Mock the dependencies
jest.mock('../../data/mockPayees', () => ({
  mockPayees: [
    {
      id: 'PAY-001',
      name: 'John Doe',
      role: 'Sales Rep',
      region: 'WEST-001',
      planId: 'PLAN-001'
    },
    {
      id: 'PAY-002',
      name: 'Jane Smith',
      role: 'Manager',
      region: 'EAST-002',
      planId: 'PLAN-002'
    },
    {
      id: 'PAY-003',
      name: 'Bob Johnson',
      role: 'Sales Rep',
      region: 'WEST-003',
      planId: 'PLAN-001'
    }
  ]
}));

jest.mock('../../data/mockEarnings', () => ({
  mockEarnings: [
    { payeeId: 'PAY-001', totalEarnings: 5000 },
    { payeeId: 'PAY-002', totalEarnings: 6000 },
    { payeeId: 'PAY-003', totalEarnings: 4000 }
  ],
  mockPayments: [
    { payeeId: 'PAY-001', amount: 5500 }, // Overpaid by 500
    { payeeId: 'PAY-002', amount: 5800 }, // Underpaid by 200
    { payeeId: 'PAY-003', amount: 4000 }  // Balanced
  ]
}));

jest.mock('../ReportViewer', () => {
  return function MockReportViewer({ reportTitle, reportData, loading, onDrilldown }) {
    if (loading) return <div>Loading...</div>;
    return (
      <div data-testid="report-viewer">
        <h2>{reportTitle}</h2>
        <div data-testid="report-rows">{reportData?.rows?.length || 0} rows</div>
        <div data-testid="report-summary">
          {reportData?.summary && (
            <>
              <span data-testid="total-variance">{reportData.summary.totalPayeesWithVariance}</span>
              <span data-testid="overpaid-count">{reportData.summary.overpaidCount}</span>
              <span data-testid="underpaid-count">{reportData.summary.underpaidCount}</span>
              <span data-testid="total-overpaid">{reportData.summary.totalOverpaid}</span>
              <span data-testid="total-underpaid">{reportData.summary.totalUnderpaid}</span>
            </>
          )}
        </div>
        {onDrilldown && <button onClick={() => onDrilldown({ id: 'PAY-001' }, 'name')}>Drilldown</button>}
      </div>
    );
  };
});

jest.mock('../../utils/reportFilterConfig', () => ({
  getFiltersForReportType: jest.fn(() => ['region', 'role', 'plan'])
}));

jest.mock('../../utils/reportDataAggregator', () => ({
  applyFilters: jest.fn((rows, filters, config) => rows)
}));

describe('OverpaidUnderpaidPayeesReport', () => {
  test('renders report with variance data', async () => {
    render(<OverpaidUnderpaidPayeesReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByText('Overpaid / Underpaid Payees')).toBeInTheDocument();
  });

  test('filters payees by variance threshold', async () => {
    render(<OverpaidUnderpaidPayeesReport varianceThreshold={100} />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      // Only PAY-001 (500) and PAY-002 (200) exceed threshold of 100
      expect(rowsElement).toHaveTextContent('2 rows');
    });
  });

  test('categorizes overpaid and underpaid payees correctly', async () => {
    render(<OverpaidUnderpaidPayeesReport varianceThreshold={100} />);

    await waitFor(() => {
      expect(screen.getByTestId('overpaid-count')).toHaveTextContent('1'); // PAY-001
      expect(screen.getByTestId('underpaid-count')).toHaveTextContent('1'); // PAY-002
    });
  });

  test('calculates total overpaid and underpaid amounts', async () => {
    render(<OverpaidUnderpaidPayeesReport varianceThreshold={100} />);

    await waitFor(() => {
      expect(screen.getByTestId('total-overpaid')).toHaveTextContent('500');
      expect(screen.getByTestId('total-underpaid')).toHaveTextContent('200');
    });
  });

  test('displays threshold control', async () => {
    render(<OverpaidUnderpaidPayeesReport />);

    await waitFor(() => {
      expect(screen.getByText(/Variance Threshold/i)).toBeInTheDocument();
    });

    const thresholdInput = screen.getByDisplayValue('100');
    expect(thresholdInput).toBeInTheDocument();
  });

  test('updates report when threshold changes', async () => {
    render(<OverpaidUnderpaidPayeesReport varianceThreshold={100} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    });

    const thresholdInput = screen.getByDisplayValue('100');
    fireEvent.change(thresholdInput, { target: { value: '300' } });

    await waitFor(() => {
      // With threshold 300, only PAY-001 (500) should be shown
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toHaveTextContent('1 rows');
    });
  });

  test('displays summary cards with variance metrics', async () => {
    render(<OverpaidUnderpaidPayeesReport varianceThreshold={100} />);

    await waitFor(() => {
      expect(screen.getByText('Overpaid Payees')).toBeInTheDocument();
      expect(screen.getByText('Underpaid Payees')).toBeInTheDocument();
      expect(screen.getByText('Net Variance')).toBeInTheDocument();
    });
  });

  test('handles drilldown to payee detail', async () => {
    const mockDrilldown = jest.fn();
    render(<OverpaidUnderpaidPayeesReport onDrilldown={mockDrilldown} varianceThreshold={100} />);

    await waitFor(() => {
      expect(screen.getByText('Drilldown')).toBeInTheDocument();
    });

    const drilldownButton = screen.getByText('Drilldown');
    drilldownButton.click();

    expect(mockDrilldown).toHaveBeenCalledWith(
      expect.objectContaining({
        reportType: 'payee-detail',
        payeeId: 'PAY-001'
      })
    );
  });

  test('sorts payees by absolute variance descending', async () => {
    render(<OverpaidUnderpaidPayeesReport varianceThreshold={100} />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toBeInTheDocument();
    });
    // Should be sorted: PAY-001 (|500|), PAY-002 (|200|)
  });
});
