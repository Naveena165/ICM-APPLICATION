import React, { useState, useEffect } from 'react';
import FilterPanel from './FilterPanel';
import DataTable from './DataTable';
import './ReportViewer.css';

/**
 * ReportViewer Component
 * Base component for displaying individual reports with filters and visualizations
 * Requirements: 3.2, 3.12.1, 3.12.2
 */
const ReportViewer = ({ 
  reportId, 
  reportTitle, 
  reportData = null,
  reportColumns = [],
  onFilterChange,
  onExport,
  onDrilldown,
  availableFilters = [],
  initialFilters = {},
  pageSize = 25,
  enableSelection = false,
  onSelectionChange
}) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'chart'
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(false);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Handle view mode toggle
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Handle export actions
  const handleExport = (format) => {
    if (onExport) {
      onExport(format, reportData, filters);
    }
  };

  // Calculate report metadata
  const metadata = reportData ? {
    totalRows: reportData.rows?.length || 0,
    lastUpdated: reportData.lastUpdated || new Date().toISOString(),
    generatedAt: new Date().toLocaleString()
  } : null;

  return (
    <div className="report-viewer">
      {/* Report Header */}
      <div className="report-header">
        <div className="report-header-left">
          <h2 className="report-title">{reportTitle || 'Report'}</h2>
          {metadata && (
            <div className="report-metadata">
              <span className="metadata-item">
                <span className="metadata-label">Total Records:</span>
                <span className="metadata-value">{metadata.totalRows}</span>
              </span>
              <span className="metadata-item">
                <span className="metadata-label">Generated:</span>
                <span className="metadata-value">{metadata.generatedAt}</span>
              </span>
            </div>
          )}
        </div>
        
        <div className="report-header-right">
          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('table')}
              aria-label="Table view"
              title="Table view"
            >
              <span className="view-mode-icon">📊</span>
              <span className="view-mode-label">Table</span>
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'chart' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('chart')}
              aria-label="Chart view"
              title="Chart view"
            >
              <span className="view-mode-icon">📈</span>
              <span className="view-mode-label">Chart</span>
            </button>
          </div>

          {/* Export Buttons */}
          <div className="export-buttons">
            <button
              className="btn-export btn-export-excel"
              onClick={() => handleExport('excel')}
              disabled={!reportData || isLoading}
              aria-label="Export to Excel"
              title="Export to Excel"
            >
              <span className="export-icon">📥</span>
              <span className="export-label">Excel</span>
            </button>
            <button
              className="btn-export btn-export-pdf"
              onClick={() => handleExport('pdf')}
              disabled={!reportData || isLoading}
              aria-label="Export to PDF"
              title="Export to PDF"
            >
              <span className="export-icon">📄</span>
              <span className="export-label">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {availableFilters.length > 0 && (
        <div className="report-filters">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            availableFilters={availableFilters}
          />
        </div>
      )}

      {/* Report Content */}
      <div className="report-content">
        {isLoading ? (
          <div className="report-loading">
            <div className="loading-spinner"></div>
            <p>Loading report data...</p>
          </div>
        ) : !reportData ? (
          <div className="report-empty">
            <p>No data available</p>
          </div>
        ) : (
          <div className="report-data">
            {/* Content rendered by DataTable or ChartView */}
            {viewMode === 'table' ? (
              <DataTable
                columns={reportColumns}
                data={reportData.rows || []}
                onDrilldown={onDrilldown}
                pageSize={pageSize}
                enableSelection={enableSelection}
                onSelectionChange={onSelectionChange}
              />
            ) : (
              <div className="report-chart-placeholder">
                <p>Chart view will be rendered here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportViewer;
