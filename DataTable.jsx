import React, { useState, useMemo } from 'react';
import './DataTable.css';

/**
 * DataTable Component
 * Displays report data in a sortable, paginated table with row selection
 * Requirements: 3.14.3
 */
const DataTable = ({ 
  columns = [], 
  data = [], 
  onDrilldown,
  pageSize = 25,
  enableSelection = false,
  onSelectionChange
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Sort data
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, sortedData.length);

  // Handle column sort
  const handleSort = (columnKey) => {
    setSortConfig(prevConfig => ({
      key: columnKey,
      direction: prevConfig.key === columnKey && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle row selection
  const handleRowSelect = (rowIndex) => {
    if (!enableSelection) return;

    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelectedRows));
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!enableSelection) return;

    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    } else {
      const allRows = new Set(paginatedData.map((_, index) => index));
      setSelectedRows(allRows);
      if (onSelectionChange) {
        onSelectionChange(Array.from(allRows));
      }
    }
  };

  // Handle cell click for drilldown
  const handleCellClick = (row, column) => {
    if (column.drilldown && onDrilldown) {
      onDrilldown(row, column.key);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSelectedRows(new Set()); // Clear selection on page change
    }
  };

  // Format cell value
  const formatCellValue = (value, column, row) => {
    if (value == null) return '-';

    if (column.format === 'currency') {
      return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (column.format === 'percentage') {
      return `${Number(value).toFixed(1)}%`;
    }

    if (column.format === 'number') {
      return Number(value).toLocaleString('en-US');
    }

    if (column.format === 'date') {
      return new Date(value).toLocaleDateString('en-US');
    }

    if (column.format === 'attainment') {
      // Color-coded attainment percentage
      const attainment = Number(value);
      let className = 'attainment-cell';
      
      if (attainment >= 100) {
        className += ' attainment-achieved';
      } else if (attainment >= 80) {
        className += ' attainment-on-track';
      } else {
        className += ' attainment-below-target';
      }
      
      return <span className={className}>{attainment}%</span>;
    }

    if (column.format === 'badge') {
      // Status badge with color
      const statusColor = row?.statusColor || 'gray';
      return <span className={`status-badge status-badge-${statusColor}`}>{value}</span>;
    }

    return String(value);
  };

  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination-controls">
        <div className="pagination-info">
          Showing {startRow}-{endRow} of {sortedData.length} records
        </div>
        <div className="pagination-buttons">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            «
          </button>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          {startPage > 1 && <span className="pagination-ellipsis">...</span>}
          {pages}
          {endPage < totalPages && <span className="pagination-ellipsis">...</span>}
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            »
          </button>
        </div>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="data-table-empty">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {enableSelection && (
                <th className="table-header-cell selection-cell">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`table-header-cell ${column.sortable !== false ? 'sortable' : ''} ${
                    sortConfig.key === column.key ? 'sorted' : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="header-content">
                    <span className="header-label">{column.label}</span>
                    {column.sortable !== false && (
                      <span className="sort-indicator">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? '▲' : '▼'
                        ) : (
                          '⇅'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`table-row ${selectedRows.has(rowIndex) ? 'selected' : ''}`}
              >
                {enableSelection && (
                  <td className="table-cell selection-cell">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rowIndex)}
                      onChange={() => handleRowSelect(rowIndex)}
                      aria-label={`Select row ${rowIndex + 1}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`table-cell ${column.drilldown ? 'drilldown-cell' : ''} ${
                      column.align ? `align-${column.align}` : ''
                    }`}
                    onClick={() => handleCellClick(row, column)}
                  >
                    {formatCellValue(row[column.key], column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default DataTable;
