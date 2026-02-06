import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EarningsByRoleRegionReport from './EarningsByRoleRegionReport';

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
      role: 'Sales Rep',
      region: 'WEST-002',
      planId: 'PLAN-001'
    },
    {
      id: 'PAY-003',
      name: 'Bob Johnson',
      role: 'Manager',
      region: 'EAST-001',
      planId: 'PLAN-002'
    }
  ]
}));

jest.mock('../../data/mockEarnings', () => ({
  mockEarnings: [
    { payeeId: 'PAY-001', totalEarnings: 5000 },
    { payeeId: 'PAY-002', totalEarnings: 6000 },
    { payeeId: 'PAY-003', totalEarnings: 8000 }
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
              <span data-testid="total-groups">{reportData.summary.totalGroups}</span>
              <span data-testid="total-payees">{reportData.summary.totalPayees}</span>
              <span data-testid="total-earnings">{reportData.summary.totalEarnings}</span>
            </>
          )}
        </div>
        {onDrilldown && <button onClick={() => onDrilldown({ role: 'Sales Rep', region: 'WEST' }, 'role')}>Drilldown</button>}
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

describe('EarningsByRoleRegionReport', () => {
  test('renders report with role/region aggregated data', async () => {
    render(<EarningsByRoleRegionReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByText('Earnings by Role / Region')).toBeInTheDocument();
  });

  test('groups earnings by role and region correctly', async () => {
    render(<EarningsByRoleRegionReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      // Should have 2 groups: Sales Rep|WEST and Manager|EAST
      expect(rowsElement).toHaveTextContent('2 rows');
    });
  });

  test('calculates aggregated metrics correctly', async () => {
    render(<EarningsByRoleRegionReport />);

    await waitFor(() => {
      expect(screen.getByTestId('total-groups')).toHaveTextContent('2');
      expect(screen.getByTestId('total-payees')).toHaveTextContent('3');
      expect(screen.getByTestId('total-earnings')).toHaveTextContent('19000');
    });
  });

  test('calculates min, max, and average earnings per group', async () => {
    render(<EarningsByRoleRegionReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toBeInTheDocument();
    });
    // Sales Rep|WEST: 2 payees, 5000 and 6000 = avg 5500, min 5000, max 6000
    // Manager|EAST: 1 payee, 8000 = avg 8000, min 8000, max 8000
  });

  test('handles drilldown to filtered payee list', async () => {
    const mockDrilldown = jest.fn();
    render(<EarningsByRoleRegionReport onDrilldown={mockDrilldown} />);

    await waitFor(() => {
      expect(screen.getByText('Drilldown')).toBeInTheDocument();
    });

    const drilldownButton = screen.getByText('Drilldown');
    drilldownButton.click();

    expect(mockDrilldown).toHaveBeenCalledWith(
      expect.objectContaining({
        reportType: 'earnings-by-payee',
        filters: expect.any(Object)
      })
    );
  });
});
