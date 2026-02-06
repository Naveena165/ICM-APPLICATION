import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTable from './DataTable';

describe('DataTable Component', () => {
  const mockColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'amount', label: 'Amount', format: 'currency', sortable: true, align: 'right' },
    { key: 'status', label: 'Status', sortable: false }
  ];

  const mockData = [
    { id: 1, name: 'John Doe', amount: 1000, status: 'Active' },
    { id: 2, name: 'Jane Smith', amount: 2000, status: 'Pending' },
    { id: 3, name: 'Bob Johnson', amount: 1500, status: 'Active' },
    { id: 4, name: 'Alice Williams', amount: 3000, status: 'Completed' },
    { id: 5, name: 'Charlie Brown', amount: 2500, status: 'Active' }
  ];

  describe('Component Rendering', () => {
    test('renders table with columns', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    test('renders table rows with data', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    test('formats currency values correctly', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      expect(screen.getByText('$1,000.00')).toBeInTheDocument();
      expect(screen.getByText('$2,000.00')).toBeInTheDocument();
    });

    test('shows empty state when no data', () => {
      render(<DataTable columns={mockColumns} data={[]} />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    test('shows empty state when data is null', () => {
      render(<DataTable columns={mockColumns} data={null} />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    test('renders sort indicators for sortable columns', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const headers = screen.getAllByRole('columnheader');
      const nameHeader = headers.find(h => h.textContent.includes('Name'));
      
      expect(nameHeader).toHaveClass('sortable');
    });
  });

  describe('Sorting Functionality', () => {
    test('sorts data ascending when column header clicked', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const nameHeader = screen.getByText('Name').closest('th');
      fireEvent.click(nameHeader);

      const rows = screen.getAllByRole('row');
      // First row is header, second should be Alice (alphabetically first)
      expect(rows[1]).toHaveTextContent('Alice Williams');
    });

    test('sorts data descending when column header clicked twice', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const nameHeader = screen.getByText('Name').closest('th');
      fireEvent.click(nameHeader); // Ascending
      fireEvent.click(nameHeader); // Descending

      const rows = screen.getAllByRole('row');
      // First row is header, second should be John (alphabetically last)
      expect(rows[1]).toHaveTextContent('John Doe');
    });

    test('sorts numeric values correctly', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const amountHeader = screen.getByText('Amount').closest('th');
      fireEvent.click(amountHeader);

      const rows = screen.getAllByRole('row');
      // Should show lowest amount first (1000)
      expect(rows[1]).toHaveTextContent('$1,000.00');
    });

    test('does not sort when clicking non-sortable column', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const statusHeader = screen.getByText('Status').closest('th');
      const initialFirstRow = screen.getAllByRole('row')[1].textContent;

      fireEvent.click(statusHeader);

      const afterClickFirstRow = screen.getAllByRole('row')[1].textContent;
      expect(afterClickFirstRow).toBe(initialFirstRow);
    });

    test('shows correct sort indicator', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      const nameHeader = screen.getByText('Name').closest('th');
      fireEvent.click(nameHeader);

      expect(nameHeader).toHaveClass('sorted');
      expect(nameHeader).toHaveTextContent('▲');
    });
  });

  describe('Pagination', () => {
    const largeDataSet = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Person ${i + 1}`,
      amount: (i + 1) * 100,
      status: 'Active'
    }));

    test('shows pagination controls for large datasets', () => {
      render(<DataTable columns={mockColumns} data={largeDataSet} pageSize={25} />);

      expect(screen.getByText(/Showing 1-25 of 100 records/)).toBeInTheDocument();
    });

    test('navigates to next page', () => {
      render(<DataTable columns={mockColumns} data={largeDataSet} pageSize={25} />);

      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);

      expect(screen.getByText(/Showing 26-50 of 100 records/)).toBeInTheDocument();
      expect(screen.getByText('Person 26')).toBeInTheDocument();
    });

    test('navigates to previous page', () => {
      render(<DataTable columns={mockColumns} data={largeDataSet} pageSize={25} />);

      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);

      const prevButton = screen.getByLabelText('Previous page');
      fireEvent.click(prevButton);

      expect(screen.getByText(/Showing 1-25 of 100 records/)).toBeInTheDocument();
    });

    test('navigates to first page', () => {
      render(<DataTable columns={mockColumns} data={largeDataSet} pageSize={25} />);

      // Go to page 3
      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      const firstButton = screen.getByLabelText('First page');
      fireEvent.click(firstButton);

      expect(screen.getByText(/Showing 1-25 of 100 records/)).toBeInTheDocument();
    });

    test('navigates to last page', () => {
      render(<DataTable columns={mockColumns} data={largeDataSet} pageSize={25} />);

      const lastButton = screen.getByLabelText('Last page');
      fireEvent.click(lastButton);

      expect(screen.getByText(/Showing 76-100 of 100 records/)).toBeInTheDocument();
    });

    test('disables previous button on first page', () => {
      render(<DataTable columns={mockColumns} data={largeDataSet} pageSize={25} />);

      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
    });

    test('disables next button on last page', () => {
      render(<DataTable columns={mockColumns} data={largeDataSet} pageSize={25} />);

      const lastButton = screen.getByLabelText('Last page');
      fireEvent.click(lastButton);

      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });

    test('does not show pagination for small datasets', () => {
      render(<DataTable columns={mockColumns} data={mockData} pageSize={25} />);

      expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    });
  });

  describe('Row Selection', () => {
    test('shows selection checkboxes when enableSelection is true', () => {
      render(<DataTable columns={mockColumns} data={mockData} enableSelection={true} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    test('does not show selection checkboxes when enableSelection is false', () => {
      render(<DataTable columns={mockColumns} data={mockData} enableSelection={false} />);

      const checkboxes = screen.queryAllByRole('checkbox');
      expect(checkboxes.length).toBe(0);
    });

    test('selects individual row when checkbox clicked', () => {
      const mockOnSelectionChange = jest.fn();
      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          enableSelection={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // First data row (index 0 is select all)

      expect(mockOnSelectionChange).toHaveBeenCalledWith([0]);
    });

    test('deselects row when clicked again', () => {
      const mockOnSelectionChange = jest.fn();
      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          enableSelection={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // Select
      fireEvent.click(checkboxes[1]); // Deselect

      expect(mockOnSelectionChange).toHaveBeenLastCalledWith([]);
    });

    test('selects all rows when select all checkbox clicked', () => {
      const mockOnSelectionChange = jest.fn();
      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          enableSelection={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(selectAllCheckbox);

      expect(mockOnSelectionChange).toHaveBeenCalledWith([0, 1, 2, 3, 4]);
    });

    test('deselects all rows when select all clicked again', () => {
      const mockOnSelectionChange = jest.fn();
      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          enableSelection={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(selectAllCheckbox); // Select all
      fireEvent.click(selectAllCheckbox); // Deselect all

      expect(mockOnSelectionChange).toHaveBeenLastCalledWith([]);
    });
  });

  describe('Drilldown Functionality', () => {
    const drilldownColumns = [
      { key: 'id', label: 'ID', drilldown: true },
      { key: 'name', label: 'Name', drilldown: true },
      { key: 'amount', label: 'Amount', format: 'currency' }
    ];

    test('calls onDrilldown when drilldown cell clicked', () => {
      const mockOnDrilldown = jest.fn();
      render(
        <DataTable
          columns={drilldownColumns}
          data={mockData}
          onDrilldown={mockOnDrilldown}
        />
      );

      const johnDoeCell = screen.getByText('John Doe');
      fireEvent.click(johnDoeCell);

      expect(mockOnDrilldown).toHaveBeenCalledWith(
        mockData[0],
        'name'
      );
    });

    test('applies drilldown-cell class to drilldown columns', () => {
      render(
        <DataTable
          columns={drilldownColumns}
          data={mockData}
          onDrilldown={jest.fn()}
        />
      );

      const johnDoeCell = screen.getByText('John Doe').closest('td');
      expect(johnDoeCell).toHaveClass('drilldown-cell');
    });

    test('does not call onDrilldown for non-drilldown cells', () => {
      const mockOnDrilldown = jest.fn();
      render(
        <DataTable
          columns={drilldownColumns}
          data={mockData}
          onDrilldown={mockOnDrilldown}
        />
      );

      const amountCell = screen.getByText('$1,000.00');
      fireEvent.click(amountCell);

      expect(mockOnDrilldown).not.toHaveBeenCalled();
    });
  });

  describe('Data Formatting', () => {
    const formattingColumns = [
      { key: 'currency', label: 'Currency', format: 'currency' },
      { key: 'percentage', label: 'Percentage', format: 'percentage' },
      { key: 'number', label: 'Number', format: 'number' },
      { key: 'date', label: 'Date', format: 'date' },
      { key: 'text', label: 'Text' }
    ];

    const formattingData = [
      {
        currency: 1234.56,
        percentage: 75.5,
        number: 1000000,
        date: '2024-01-15',
        text: 'Sample Text'
      }
    ];

    test('formats currency correctly', () => {
      render(<DataTable columns={formattingColumns} data={formattingData} />);
      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });

    test('formats percentage correctly', () => {
      render(<DataTable columns={formattingColumns} data={formattingData} />);
      expect(screen.getByText('75.5%')).toBeInTheDocument();
    });

    test('formats number with thousands separator', () => {
      render(<DataTable columns={formattingColumns} data={formattingData} />);
      expect(screen.getByText('1,000,000')).toBeInTheDocument();
    });

    test('formats date correctly', () => {
      render(<DataTable columns={formattingColumns} data={formattingData} />);
      // Date format may vary by locale, just check it's formatted
      const dateCell = screen.getByText(/1\/15\/2024|15\/1\/2024/);
      expect(dateCell).toBeInTheDocument();
    });

    test('handles null values', () => {
      const nullData = [{ currency: null, percentage: null, number: null, date: null, text: null }];
      render(<DataTable columns={formattingColumns} data={nullData} />);
      
      const cells = screen.getAllByText('-');
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for pagination buttons', () => {
      const largeDataSet = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Person ${i + 1}`,
        amount: (i + 1) * 100,
        status: 'Active'
      }));

      render(<DataTable columns={mockColumns} data={largeDataSet} pageSize={25} />);

      expect(screen.getByLabelText('First page')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Last page')).toBeInTheDocument();
    });

    test('has proper ARIA labels for selection checkboxes', () => {
      render(<DataTable columns={mockColumns} data={mockData} enableSelection={true} />);

      expect(screen.getByLabelText('Select all rows')).toBeInTheDocument();
      expect(screen.getByLabelText('Select row 1')).toBeInTheDocument();
    });
  });
});
