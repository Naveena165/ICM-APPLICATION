/**
 * Import Error Report Component
 * Provides detailed error reporting and analysis for import validation
 */

import React, { useState } from 'react';
import { generateValidationReport } from '../../utils/importValidation';
import { downloadTemplate } from '../../utils/fileDownload';

function ImportErrorReport({ validationResult, filename, onClose }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!validationResult) {
    return null;
  }

  // Filter issues based on severity and search term
  const filterIssues = (issues) => {
    let filtered = issues;
    
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(issue => issue.severity === filterSeverity);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.field && issue.field.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const handleDownloadReport = () => {
    try {
      const report = generateValidationReport(validationResult, filename);
      const result = downloadTemplate(report, `validation_report_${filename.replace(/\.[^/.]+$/, "")}`, 'md');
      
      if (result.success) {
        console.log(`Validation report downloaded: ${result.filename}`);
      } else {
        alert(`Download failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Report download error:', error);
      alert('Failed to download report');
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return '#dc2626';
      case 'warning': return '#d97706';
      case 'info': return '#2563eb';
      default: return '#6b7280';
    }
  };

  return (
    <div className="error-report-modal">
      <div className="error-report-header">
        <div className="header-info">
          <h3>Import Validation Report</h3>
          <p className="filename">File: {filename}</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleDownloadReport}>
            📄 Download Report
          </button>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="error-report-content">
        {/* Summary Stats */}
        <div className="report-summary">
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <div className="card-value">{validationResult.rowCount}</div>
                <div className="card-label">Total Rows</div>
              </div>
            </div>
            <div className="summary-card success">
              <div className="card-icon">✅</div>
              <div className="card-content">
                <div className="card-value">{validationResult.validRows}</div>
                <div className="card-label">Valid Rows</div>
              </div>
            </div>
            <div className="summary-card error">
              <div className="card-icon">❌</div>
              <div className="card-content">
                <div className="card-value">{validationResult.invalidRows}</div>
                <div className="card-label">Invalid Rows</div>
              </div>
            </div>
            <div className="summary-card warning">
              <div className="card-icon">⚠️</div>
              <div className="card-content">
                <div className="card-value">{validationResult.summary.warningCount}</div>
                <div className="card-label">Warnings</div>
              </div>
            </div>
          </div>
          
          {validationResult.duplicateRows > 0 && (
            <div className="duplicate-alert">
              <span className="alert-icon">🔄</span>
              <span>{validationResult.duplicateRows} duplicate rows detected</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="report-tabs">
          <button 
            className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button 
            className={`tab-button ${activeTab === 'errors' ? 'active' : ''}`}
            onClick={() => setActiveTab('errors')}
          >
            Errors ({validationResult.errors.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'warnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('warnings')}
          >
            Warnings ({validationResult.warnings.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Issues ({validationResult.summary.totalIssues})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'summary' && (
            <div className="summary-tab">
              <div className="summary-section">
                <h4>Validation Overview</h4>
                <div className="overview-grid">
                  <div className="overview-item">
                    <span className="overview-label">Success Rate:</span>
                    <span className="overview-value">
                      {validationResult.rowCount > 0 
                        ? `${Math.round((validationResult.validRows / validationResult.rowCount) * 100)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Critical Issues:</span>
                    <span className="overview-value error">{validationResult.summary.errorCount}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Warnings:</span>
                    <span className="overview-value warning">{validationResult.summary.warningCount}</span>
                  </div>
                </div>
              </div>

              {validationResult.summary.errorCount > 0 && (
                <div className="summary-section">
                  <h4>Top Error Types</h4>
                  <div className="error-types">
                    {(() => {
                      const errorTypes = validationResult.errors.reduce((acc, error) => {
                        acc[error.type] = (acc[error.type] || 0) + 1;
                        return acc;
                      }, {});
                      
                      return Object.entries(errorTypes)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([type, count]) => (
                          <div key={type} className="error-type-item">
                            <span className="error-type-name">{type.replace(/_/g, ' ')}</span>
                            <span className="error-type-count">{count}</span>
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              )}

              <div className="summary-section">
                <h4>Recommendations</h4>
                <div className="recommendations">
                  {validationResult.summary.errorCount > 0 && (
                    <div className="recommendation">
                      <span className="rec-icon">🔧</span>
                      <span>Fix critical errors before importing to ensure data integrity</span>
                    </div>
                  )}
                  {validationResult.duplicateRows > 0 && (
                    <div className="recommendation">
                      <span className="rec-icon">🔄</span>
                      <span>Review duplicate rows and remove or update as needed</span>
                    </div>
                  )}
                  {validationResult.summary.warningCount > 0 && (
                    <div className="recommendation">
                      <span className="rec-icon">⚠️</span>
                      <span>Address warnings to improve data quality</span>
                    </div>
                  )}
                  {validationResult.isValid && (
                    <div className="recommendation success">
                      <span className="rec-icon">✅</span>
                      <span>File is ready for import with no critical issues</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'errors' || activeTab === 'warnings' || activeTab === 'all') && (
            <div className="issues-tab">
              <div className="issues-filters">
                <div className="filter-group">
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                {activeTab === 'all' && (
                  <div className="filter-group">
                    <select 
                      value={filterSeverity}
                      onChange={(e) => setFilterSeverity(e.target.value)}
                      className="severity-filter"
                    >
                      <option value="all">All Severities</option>
                      <option value="error">Errors Only</option>
                      <option value="warning">Warnings Only</option>
                      <option value="info">Info Only</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="issues-list">
                {(() => {
                  let issues = [];
                  if (activeTab === 'errors') issues = validationResult.errors;
                  else if (activeTab === 'warnings') issues = validationResult.warnings;
                  else issues = [...validationResult.errors, ...validationResult.warnings, ...validationResult.info];
                  
                  const filteredIssues = filterIssues(issues);
                  
                  if (filteredIssues.length === 0) {
                    return (
                      <div className="no-issues">
                        <p>No issues found matching your criteria</p>
                      </div>
                    );
                  }
                  
                  return filteredIssues.map((issue, index) => (
                    <div key={issue.id || index} className={`issue-item ${issue.severity}`}>
                      <div className="issue-header">
                        <span className="issue-icon">{getSeverityIcon(issue.severity)}</span>
                        <span className="issue-location">
                          {issue.row ? `Row ${issue.row}` : 'File'}
                          {issue.column ? `, Column ${issue.column}` : ''}
                          {issue.field ? ` (${issue.field})` : ''}
                        </span>
                        <span className="issue-type">{issue.type.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="issue-message">{issue.message}</div>
                      {issue.value && (
                        <div className="issue-value">
                          <strong>Value:</strong> <code>{issue.value}</code>
                        </div>
                      )}
                      {issue.suggestion && (
                        <div className="issue-suggestion">
                          <strong>Suggestion:</strong> {issue.suggestion}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImportErrorReport;