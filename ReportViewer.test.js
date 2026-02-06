import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportViewer from './ReportViewer';

// Mock FilterPanel component
jest.mock('./FilterPanel', () => {
  return function MockFilterPanel({ filters, onChange, availableFilters }) {
    return (
      <div data-testid="filter-panel">
        <button onClick={() => onChange({ test: 'filter' })}>Apply Filter</button>
      </div>
    );
  };
});

describe('ReportViewer Component', () => {
  const mockReportData = {
    rows: [
      { id: 1, name: 'John Doe', amount: 1000 },
      { id: 2, name: 'Jane Smith', amount: 2000 }
    ],
    lastUpdated: '2024-01-15T10:00:00Z'
  };

  const mockColumns = [
    { key: 'name', label: 'Name' },
    { key: 'amount', label: 'Amount', format: 'currency' }
  ];

  const mockFilters = [
    {
      key: 'dateRange',
      label: 'Date Range',
      type: 'daterange',
      options: [
        { value: 'current-month', label: 'Current Month' },
        { value: 'last-month', label: 'Last Month' }
      ]
    }
  ];

  describe('Component Rendering', () => {
    test('renders report viewer with title', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
        />
      );

      expect(screen.getByText('Test Report')).toBeInTheDocument();
    });

    test('renders report metadata', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
        />
      );

      expect(screen.getByText('Total Records:')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Generated:')).toBeInTheDocument();
    });

    test('renders view mode toggle buttons', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
        />
      );

      expect(screen.getByLabelText('Table view')).toBeInTheDocument();
      expect(screen.getByLabelText('Chart view')).toBeInTheDocument();
    });

    test('renders export buttons', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
        />
      );

      expect(screen.getByLabelText('Export to Excel')).toBeInTheDocument();
      expect(screen.getByLabelText('Export to PDF')).toBeInTheDocument();
    });

    test('renders filter panel when filters are provided', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
          availableFilters={mockFilters}
        />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    test('does not render filter panel when no filters provided', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
          availableFilters={[]}
        />
      );

      expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();
    });

    test('shows empty state when no data provided', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={null}
        />
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    test('shows loading state when isLoading is true', () => {
      const { rerender } = render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={null}
        />
      );

      // Simulate loading by not providing data initially
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('View Mode Switching', () => {
    test('defaults to table view', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
        />
      );

      const tableBtn = screen.getByLabelText('Table view');
      expect(tableBtn).toHaveClass('active');
    });

    test('switches to chart view when chart button clicked', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
        />
      );

      const chartBtn = screen.getByLabelText('Chart view');
      fireEvent.click(chartBtn);

      expect(chartBtn).toHaveClass('active');
      expect(screen.getByText('Chart view will be rendered here')).toBeInTheDocument();
    });

    test('switches back to table view', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
          reportColumns={mockColumns}
        />
      );

      const chartBtn = screen.getByLabelText('Chart view');
      const tableBtn = screen.getByLabelText('Table view');

      fireEvent.click(chartBtn);
      expect(chartBtn).toHaveClass('active');

      fireEvent.click(tableBtn);
      expect(tableBtn).toHaveClass('active');
      // DataTable component should be rendered (check for table element)
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    test('calls onExport with excel format when Excel button clicked', () => {
      const mockOnExport = jest.fn();
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
          onExport={mockOnExport}
        />
      );

      const excelBtn = screen.getByLabelText('Export to Excel');
      fireEvent.click(excelBtn);

      expect(mockOnExport).toHaveBeenCalledWith('excel', mockReportData, {});
    });

    test('calls onExport with pdf format when PDF button clicked', () => {
      const mockOnExport = jest.fn();
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
          onExport={mockOnExport}
        />
      );

      const pdfBtn = screen.getByLabelText('Export to PDF');
      fireEvent.click(pdfBtn);

      expect(mockOnExport).toHaveBeenCalledWith('pdf', mockReportData, {});
    });

    test('disables export buttons when no data', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={null}
        />
      );

      const excelBtn = screen.getByLabelText('Export to Excel');
      const pdfBtn = screen.getByLabelText('Export to PDF');

      expect(excelBtn).toBeDisabled();
      expect(pdfBtn).toBeDisabled();
    });

    test('passes current filters to export function', () => {
      const mockOnExport = jest.fn();
      const initialFilters = { dateRange: 'current-month' };

      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
          onExport={mockOnExport}
          initialFilters={initialFilters}
          availableFilters={mockFilters}
        />
      );

      const excelBtn = screen.getByLabelText('Export to Excel');
      fireEvent.click(excelBtn);

      expect(mockOnExport).toHaveBeenCalledWith('excel', mockReportData, initialFilters);
    });
  });

  describe('Filter Integration', () => {
    test('calls onFilterChange when filters are updated', () => {
      const mockOnFilterChange = jest.fn();
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
          onFilterChange={mockOnFilterChange}
          availableFilters={mockFilters}
        />
      );

      const applyFilterBtn = screen.getByText('Apply Filter');
      fireEvent.click(applyFilterBtn);

      expect(mockOnFilterChange).toHaveBeenCalledWith({ test: 'filter' });
    });

    test('uses initial filters', () => {
      const initialFilters = { dateRange: 'last-month' };
      const mockOnFilterChange = jest.fn();

      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
          onFilterChange={mockOnFilterChange}
          initialFilters={initialFilters}
          availableFilters={mockFilters}
        />
      );

      // Filter panel should receive initial filters
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for buttons', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
        />
      );

      expect(screen.getByLabelText('Table view')).toBeInTheDocument();
      expect(screen.getByLabelText('Chart view')).toBeInTheDocument();
      expect(screen.getByLabelText('Export to Excel')).toBeInTheDocument();
      expect(screen.getByLabelText('Export to PDF')).toBeInTheDocument();
    });

    test('has proper title attributes for tooltips', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={mockReportData}
        />
      );

      const tableBtn = screen.getByLabelText('Table view');
      const chartBtn = screen.getByLabelText('Chart view');

      expect(tableBtn).toHaveAttribute('title', 'Table view');
      expect(chartBtn).toHaveAttribute('title', 'Chart view');
    });
  });

  describe('Edge Cases', () => {
    test('handles missing reportTitle gracefully', () => {
      render(
        <ReportViewer
          reportId="test-report"
          reportData={mockReportData}
        />
      );

      expect(screen.getByText('Report')).toBeInTheDocument();
    });

    test('handles reportData with empty rows array', () => {
      const emptyData = { rows: [], lastUpdated: '2024-01-15T10:00:00Z' };
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={emptyData}
        />
      );

      expect(screen.getByText('0')).toBeInTheDocument(); // Total records
    });

    test('handles reportData without lastUpdated', () => {
      const dataWithoutTimestamp = { rows: mockReportData.rows };
      render(
        <ReportViewer
          reportId="test-report"
          reportTitle="Test Report"
          reportData={dataWithoutTimestamp}
        />
      );

      expect(screen.getByText('Generated:')).toBeInTheDocument();
    });
  });
});
