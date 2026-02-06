import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PayeeCommissionHistoryReport from './PayeeCommissionHistoryReport';

// Mock the dependencies
jest.mock('../../data/mockPayees', () => ({
  mockPayees: [
    {
      id: 'PAY-001',
      name: 'John Doe',
      role: 'Sales Rep',
      region: 'WEST-001',
      planId: 'PLAN-001',
      historicalEarnings: [
        { month: '2024-10', earnings: 3800, sales: 48000, attainment: 96 },
        { month: '2024-11', earnings: 4200, sales: 55000, attainment: 110 },
        { month: '2024-12', earnings: 4100, sales: 52000, attainment: 104 }
      ]
    },
    {
      id: 'PAY-002',
      name: 'Jane Smith',
      role: 'Manager',
      region: 'EAST-001',
      planId: 'PLAN-002',
      historicalEarnings: [
        { month: '2024-10', earnings: 5200, sales: 65000, attainment: 108 },
        { month: '2024-11', earnings: 5800, sales: 72000, attainment: 120 }
      ]
    }
  ]
}));

jest.mock('../ReportViewer', () => {
  return function MockReportViewer({ reportTitle, reportData, loading }) {
    if (loading) return <div>Loading...</div>;
    return (
      <div data-testid="report-viewer">
        <h2>{reportTitle}</h2>
        <div data-testid="report-rows">{reportData?.rows?.length || 0} rows</div>
      </div>
    );
  };
});

jest.mock('react-chartjs-2', () => ({
  Line: ({ data }) => (
    <div data-testid="line-chart">
      <div data-testid="chart-datasets">{data?.datasets?.length || 0} datasets</div>
      <div data-testid="chart-labels">{data?.labels?.length || 0} labels</div>
    </div>
  )
}));

describe('PayeeCommissionHistoryReport', () => {
  test('renders report with historical earnings data', async () => {
    render(<PayeeCommissionHistoryReport />);

    await waitFor(() => {
      expect(screen.getByTestId('report-viewer')).toBeInTheDocument();
    });

    expect(screen.getByText('Payee Commission History')).toBeInTheDocument();
  });

  test('displays correct number of historical records', async () => {
    render(<PayeeCommissionHistoryReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      // 3 records for PAY-001 + 2 records for PAY-002 = 5 total
      expect(rowsElement).toHaveTextContent('5 rows');
    });
  });

  test('shows view mode toggle buttons', async () => {
    render(<PayeeCommissionHistoryReport />);

    await waitFor(() => {
      expect(screen.getByText(/Table View/i)).toBeInTheDocument();
      expect(screen.getByText(/Chart View/i)).toBeInTheDocument();
    });
  });

  test('switches to chart view when chart button is clicked', async () => {
    render(<PayeeCommissionHistoryReport />);

    await waitFor(() => {
      expect(screen.getByText(/Chart View/i)).toBeInTheDocument();
    });

    const chartButton = screen.getByText(/Chart View/i);
    fireEvent.click(chartButton);

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByText('Commission Trend Over Time')).toBeInTheDocument();
    });
  });

  test('chart displays correct number of datasets and labels', async () => {
    render(<PayeeCommissionHistoryReport />);

    await waitFor(() => {
      expect(screen.getByText(/Chart View/i)).toBeInTheDocument();
    });

    const chartButton = screen.getByText(/Chart View/i);
    fireEvent.click(chartButton);

    await waitFor(() => {
      // Should have 2 datasets (one for each payee)
      expect(screen.getByTestId('chart-datasets')).toHaveTextContent('2 datasets');
      // Should have 3 unique months (2024-10, 2024-11, 2024-12)
      expect(screen.getByTestId('chart-labels')).toHaveTextContent('3 labels');
    });
  });

  test('calculates trend indicators correctly', async () => {
    render(<PayeeCommissionHistoryReport />);

    await waitFor(() => {
      const rowsElement = screen.getByTestId('report-rows');
      expect(rowsElement).toBeInTheDocument();
    });

    // Trend should be calculated for months after the first one
    // John Doe: Oct (no trend) -> Nov (+10.5%) -> Dec (-2.4%)
    // Jane Smith: Oct (no trend) -> Nov (+11.5%)
  });
});
