/**
 * Import Preview Component
 * Provides detailed preview of import data with filtering and analysis
 */

import React, { useState, useMemo } from 'react';
import { previewImportData } from '../../utils/importValidation';
import { getTemplate } from '../../utils/importTemplates';

function ImportPreview({ validationResult, transactionType, onClose, onProceedImport }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  // Create error mapping for quick lookup - moved before early return
  const errorsByRow = useMemo(() => {
    if (!validationResult || !validationResult.errors) return {};
    
    const errorMap = {};
    validationResult.errors.forEach(error => {
      if (error.row) {
        if (!errorMap[error.row]) errorMap[error.row] = [];
        errorMap[error.row].push(error);
      }
    });
    return errorMap;
  }, [validationResult]);

  // Filter and paginate data - moved before early return
  const filteredRows = useMemo(() => {
    if (!validationResult || !validationResult.parsedData) return [];
    
    const { headers, rows } = validationResult.parsedData;
    let filtered = rows;

    // Filter by column value
    if (filterColumn && filterValue) {
      const columnIndex = headers.findIndex(h => h.toLowerCase() === filterColumn.toLowerCase());
      if (columnIndex !== -1) {
        filtered = filtered.filter(row => 
          row.values[columnIndex] && 
          row.values[columnIndex].toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    }

    // Filter to show only rows with errors
    if (showOnlyErrors) {
      filtered = filtered.filter(row => errorsByRow[row.rowNumber]);
    }

    return filtered;
  }, [validationResult, filterColumn, filterValue, showOnlyErrors, errorsByRow]);

  // Early return after all hooks
  if (!validationResult || !validationResult.parsedData) {
    return null;
  }

  const template = getTemplate(transactionType);
  const { headers, rows } = validationResult.parsedData;

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  const getColumnType = (headerName) => {
    const templateHeader = template.headers.find(h => 
      h.label.toLowerCase() === headerName.toLowerCase()
    );
    return templateHeader ? templateHeader.type : 'string';
  };

  const formatCellValue = (value, type) => {
    if (!value) return value;
    
    switch (type) {
      case 'date':
        try {
          return new Date(value).toLocaleDateString();
        } catch {
          return value;
        }
      case 'decimal':
      case 'number':
        const num = parseFloat(value);
        return !isNaN(num) ? num.toLocaleString() : value;
      default:
        return value;
    }
  };

  const getRowStatus = (rowNumber) => {
    const errors = errorsByRow[rowNumber];
    if (errors && errors.length > 0) {
      return errors.some(e => e.severity === 'error') ? 'error' : 'warning';
    }
    return 'valid';
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="import-preview-modal">
      <div className="preview-header">
        <div className="header-info">
          <h3>Import Data Preview</h3>
          <div className="preview-stats">
            <span>Showing {paginatedRows.length} of {filteredRows.length} rows</span>
            <span>•</span>
            <span className="valid-count">{validationResult.validRows} valid</span>
            <span>•</span>
            <span className="error-count">{validationResult.invalidRows} invalid</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close Preview
          </button>
          <button 
            className="btn-primary" 
            onClick={onProceedImport}
            disabled={!validationResult.isValid}
          >
            Proceed with Import
          </button>
        </div>
      </div>

      <div className="preview-content">
        {/* Filters and Controls */}
        <div className="preview-controls">
          <div className="control-group">
            <label>Filter by Column:</label>
            <select 
              value={filterColumn}
              onChange={(e) => {
                setFilterColumn(e.target.value);
                setFilterValue('');
                setCurrentPage(1);
              }}
            >
              <option value="">All Columns</option>
              {headers.map((header, index) => (
                <option key={index} value={header}>{header}</option>
              ))}
            </select>
          </div>

          {filterColumn && (
            <div className="control-group">
              <label>Filter Value:</label>
              <input
                type="text"
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search in ${filterColumn}...`}
              />
            </div>
          )}

          <div className="control-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showOnlyErrors}
                onChange={(e) => {
                  setShowOnlyErrors(e.target.checked);
                  setCurrentPage(1);
                }}
              />
              Show only rows with errors
            </label>
          </div>

          <div className="control-group">
            <label>Rows per page:</label>
            <select 
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="preview-table-container">
          <table className="preview-data-table">
            <thead>
              <tr>
                <th className="row-status-header">Status</th>
                <th className="row-number-header">#</th>
                {headers.map((header, index) => (
                  <th key={index} className="data-header">
                    <div className="header-content">
                      <span className="header-name">{header}</span>
                      <span className="header-type">({getColumnType(header)})</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, rowIndex) => {
                const rowStatus = getRowStatus(row.rowNumber);
                const rowErrors = errorsByRow[row.rowNumber] || [];
                
                return (
                  <tr key={rowIndex} className={`preview-row ${rowStatus}`}>
                    <td className="row-status-cell">
                      <div className={`status-indicator ${rowStatus}`}>
                        {rowStatus === 'valid' && '✅'}
                        {rowStatus === 'warning' && '⚠️'}
                        {rowStatus === 'error' && '❌'}
                      </div>
                    </td>
                    <td className="row-number-cell">{row.rowNumber}</td>
                    {row.values.map((value, colIndex) => {
                      const header = headers[colIndex];
                      const type = getColumnType(header);
                      const formattedValue = formatCellValue(value, type);
                      
                      // Check if this cell has errors
                      const cellErrors = rowErrors.filter(error => 
                        error.column === colIndex + 1 || error.field === header
                      );
                      
                      return (
                        <td 
                          key={colIndex} 
                          className={`data-cell ${cellErrors.length > 0 ? 'has-error' : ''}`}
                          title={cellErrors.length > 0 ? cellErrors.map(e => e.message).join('; ') : ''}
                        >
                          <div className="cell-content">
                            {formattedValue || <span className="empty-value">—</span>}
                            {cellErrors.length > 0 && (
                              <span className="error-indicator">!</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="preview-pagination">
            <div className="pagination-info">
              Page {currentPage} of {totalPages} ({filteredRows.length} total rows)
            </div>
            <div className="pagination-controls">
              <button 
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                First
              </button>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`page-btn ${page === currentPage ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  );
                })}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
              <button 
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* Row Error Details */}
        {paginatedRows.some(row => errorsByRow[row.rowNumber]) && (
          <div className="row-errors-summary">
            <h4>Errors in Current View</h4>
            <div className="error-summary-list">
              {paginatedRows
                .filter(row => errorsByRow[row.rowNumber])
                .map(row => (
                  <div key={row.rowNumber} className="row-error-summary">
                    <div className="row-error-header">
                      <strong>Row {row.rowNumber}:</strong>
                      <span className="error-count-badge">
                        {errorsByRow[row.rowNumber].length} issue(s)
                      </span>
                    </div>
                    <div className="row-error-list">
                      {errorsByRow[row.rowNumber].slice(0, 3).map((error, index) => (
                        <div key={index} className="row-error-item">
                          <span className="error-field">{error.field || `Column ${error.column}`}:</span>
                          <span className="error-message">{error.message}</span>
                        </div>
                      ))}
                      {errorsByRow[row.rowNumber].length > 3 && (
                        <div className="more-errors-indicator">
                          ... and {errorsByRow[row.rowNumber].length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportPreview;