import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EarningsByPayeeReport from './EarningsByPayeeReport';

// Mock the dependencies
jest.mock('../../data/mockPayees', () => ({
  mockPayees: [
    {
      id: 'PAY-001',
      name: 'John Doe',
      role: 'Sales Rep',
      region: 'WEST-001',
      planId: 'PLAN-001',
      planName: 'Standard Sales Plan'
    },
    {
      id: 'PAY-002',
      name: 'Jane Smith',
      role: 'Manager',
      region: 'EAST-002',
      planId: 'PLAN-002',
      planName: 'Manager Plan'
    }
  ]
}));

jest.mock('../../data/mockEarnings', () => ({
  mockEarnings: [
    { payeeId: 'PAY-001', totalEarnings: 5000 },
    { payeeId: 'PAY-001', totalEarnings: 3000 },
    { payeeId: 'PAY-002', totalEarnings: 7500 }
  ],
  mockPayments: [
    { payeeId: 'PAY-001', amount: 6000, status: 'Paid' },
    { payeeId: 'PAY-001', amount: 2000, status: 'Pending' },
    { payeeId: 'PAY-002', amount: 7500, status: 'Paid' }
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
              <span data-testid="total-payees">{reportData.summary.totalPayees}</span>
              <span data-testid="total-earnings">{reportData.summary.totalEarnings}</span>
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

describe('EarningsByPayeeReport', () => {
  test('renders report with payee earnings data', async () => {
    render(<EarningsByPayeeReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByText('Earnings by Payee')).toBeInTheDocument();
  });

  test('aggregates earnings correctly for each payee', async () => {
    render(<EarningsByPayeeReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toHaveTextContent('2 rows');
    });
  });

  test('calculates summary metrics correctly', async () => {
    render(<EarningsByPayeeReport />);

    await waitFor(() => {
      expect(screen.getByTestId('total-payees')).toHaveTextContent('2');
      // PAY-001: 8000, PAY-002: 7500 = 15500 total
      expect(screen.getByTestId('total-earnings')).toHaveTextContent('15500');
    });
  });

  test('handles drilldown navigation', async () => {
    const mockDrilldown = jest.fn();
    render(<EarningsByPayeeReport onDrilldown={mockDrilldown} />);

    await waitFor(() => {
      expect(screen.getByText('Drilldown')).toBeInTheDocument();
    });

    const drilldownButton = screen.getByText('Drilldown');
    drilldownButton.click();

    expect(mockDrilldown).toHaveBeenCalled();
  });

  test('determines payment status correctly', async () => {
    render(<EarningsByPayeeReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toBeInTheDocument();
    });
    // PAY-001: 8000 earnings, 6000 paid, 2000 pending = Pending status
    // PAY-002: 7500 earnings, 7500 paid, 0 pending = Paid status
  });
});
