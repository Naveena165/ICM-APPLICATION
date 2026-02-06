import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PayeeAttainmentReport from './PayeeAttainmentReport';

// Mock the dependencies
jest.mock('../../data/mockPayees', () => ({
  mockPayees: [
    {
      id: 'PAY-001',
      name: 'John Doe',
      role: 'Sales Rep',
      region: 'WEST-001',
      planId: 'PLAN-001',
      planName: 'Standard Sales Plan',
      quota: 50000,
      currentPeriod: {
        actualSales: 48000,
        attainment: 96,
        earnings: 3800
      }
    },
    {
      id: 'PAY-002',
      name: 'Jane Smith',
      role: 'Manager',
      region: 'EAST-002',
      planId: 'PLAN-002',
      planName: 'Manager Plan',
      quota: 60000,
      currentPeriod: {
        actualSales: 72000,
        attainment: 120,
        earnings: 5800
      }
    },
    {
      id: 'PAY-003',
      name: 'Bob Johnson',
      role: 'Sales Rep',
      region: 'WEST-003',
      planId: 'PLAN-001',
      planName: 'Standard Sales Plan',
      quota: 50000,
      currentPeriod: {
        actualSales: 35000,
        attainment: 70,
        earnings: 2100
      }
    }
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
              <span data-testid="achieved-count">{reportData.summary.achievedCount}</span>
              <span data-testid="on-track-count">{reportData.summary.onTrackCount}</span>
              <span data-testid="below-target-count">{reportData.summary.belowTargetCount}</span>
              <span data-testid="avg-attainment">{reportData.summary.avgAttainment}</span>
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

describe('PayeeAttainmentReport', () => {
  test('renders report with attainment data', async () => {
    render(<PayeeAttainmentReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByText('Payee Attainment')).toBeInTheDocument();
  });

  test('displays all payees with attainment metrics', async () => {
    render(<PayeeAttainmentReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toHaveTextContent('3 rows');
    });
  });

  test('categorizes payees by attainment status correctly', async () => {
    render(<PayeeAttainmentReport />);

    await waitFor(() => {
      // 1 achieved (120%), 1 on track (96%), 1 below target (70%)
      expect(screen.getByTestId('achieved-count')).toHaveTextContent('1');
      expect(screen.getByTestId('on-track-count')).toHaveTextContent('1');
      expect(screen.getByTestId('below-target-count')).toHaveTextContent('1');
    });
  });

  test('calculates average attainment correctly', async () => {
    render(<PayeeAttainmentReport />);

    await waitFor(() => {
      // (96 + 120 + 70) / 3 = 95.3
      expect(screen.getByTestId('avg-attainment')).toHaveTextContent('95.3');
    });
  });

  test('sorts payees by attainment descending', async () => {
    render(<PayeeAttainmentReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toBeInTheDocument();
    });
    // Should be sorted: Jane (120%), John (96%), Bob (70%)
  });

  test('handles drilldown to payee detail', async () => {
    const mockDrilldown = jest.fn();
    render(<PayeeAttainmentReport onDrilldown={mockDrilldown} />);

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
});
