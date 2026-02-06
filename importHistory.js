/**
 * Import History Utility
 * Tracks and manages import history with success/failure tracking
 */

// Import history storage key
const IMPORT_HISTORY_KEY = 'icm_import_history';

// Import status types
export const IMPORT_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PARTIAL: 'partial',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in_progress'
};

// Create import history entry
export const createImportEntry = (importData) => {
  return {
    id: generateImportId(),
    timestamp: new Date().toISOString(),
    filename: importData.filename || 'Unknown',
    transactionType: importData.transactionType || 'base',
    sourceSystem: importData.sourceSystem || 'Manual',
    status: IMPORT_STATUS.IN_PROGRESS,
    totalRows: importData.totalRows || 0,
    successfulRows: 0,
    failedRows: 0,
    errors: [],
    warnings: [],
    processingTime: null,
    batchId: importData.batchId || null,
    userId: importData.userId || 'system',
    fileSize: importData.fileSize || 0,
    validationSettings: importData.validationSettings || {},
    ...importData
  };
};

// Generate unique import ID
const generateImportId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `IMP-${timestamp}-${random}`;
};

// Save import history to localStorage
export const saveImportHistory = (history) => {
  try {
    localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Failed to save import history:', error);
    return false;
  }
};

// Load import history from localStorage
export const loadImportHistory = () => {
  try {
    const stored = localStorage.getItem(IMPORT_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load import history:', error);
    return [];
  }
};

// Add new import entry
export const addImportEntry = (importData) => {
  const history = loadImportHistory();
  const entry = createImportEntry(importData);
  
  // Add to beginning of array (most recent first)
  history.unshift(entry);
  
  // Keep only last 100 entries to prevent storage bloat
  const trimmedHistory = history.slice(0, 100);
  
  saveImportHistory(trimmedHistory);
  return entry;
};

// Update existing import entry
export const updateImportEntry = (importId, updates) => {
  const history = loadImportHistory();
  const entryIndex = history.findIndex(entry => entry.id === importId);
  
  if (entryIndex === -1) {
    console.warn(`Import entry not found: ${importId}`);
    return null;
  }
  
  // Update the entry
  history[entryIndex] = {
    ...history[entryIndex],
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  
  saveImportHistory(history);
  return history[entryIndex];
};

// Mark import as completed
export const completeImport = (importId, results) => {
  const updates = {
    status: results.status || IMPORT_STATUS.SUCCESS,
    successfulRows: results.successfulRows || 0,
    failedRows: results.failedRows || 0,
    errors: results.errors || [],
    warnings: results.warnings || [],
    processingTime: results.processingTime || null,
    completedAt: new Date().toISOString()
  };
  
  return updateImportEntry(importId, updates);
};

// Get import history with filtering
export const getImportHistory = (filters = {}) => {
  const history = loadImportHistory();
  
  let filtered = history;
  
  // Filter by transaction type
  if (filters.transactionType) {
    filtered = filtered.filter(entry => 
      entry.transactionType === filters.transactionType
    );
  }
  
  // Filter by status
  if (filters.status) {
    filtered = filtered.filter(entry => entry.status === filters.status);
  }
  
  // Filter by date range
  if (filters.startDate) {
    filtered = filtered.filter(entry => 
      new Date(entry.timestamp) >= new Date(filters.startDate)
    );
  }
  
  if (filters.endDate) {
    filtered = filtered.filter(entry => 
      new Date(entry.timestamp) <= new Date(filters.endDate)
    );
  }
  
  // Filter by user
  if (filters.userId) {
    filtered = filtered.filter(entry => entry.userId === filters.userId);
  }
  
  // Limit results
  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit);
  }
  
  return filtered;
};

// Get import statistics
export const getImportStatistics = (days = 30) => {
  const history = loadImportHistory();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentImports = history.filter(entry => 
    new Date(entry.timestamp) >= cutoffDate
  );
  
  const stats = {
    totalImports: recentImports.length,
    successfulImports: recentImports.filter(e => e.status === IMPORT_STATUS.SUCCESS).length,
    failedImports: recentImports.filter(e => e.status === IMPORT_STATUS.FAILED).length,
    partialImports: recentImports.filter(e => e.status === IMPORT_STATUS.PARTIAL).length,
    totalRowsProcessed: recentImports.reduce((sum, e) => sum + (e.totalRows || 0), 0),
    totalSuccessfulRows: recentImports.reduce((sum, e) => sum + (e.successfulRows || 0), 0),
    totalFailedRows: recentImports.reduce((sum, e) => sum + (e.failedRows || 0), 0),
    averageProcessingTime: 0,
    byTransactionType: {},
    bySourceSystem: {},
    recentActivity: recentImports.slice(0, 10)
  };
  
  // Calculate average processing time
  const completedImports = recentImports.filter(e => e.processingTime);
  if (completedImports.length > 0) {
    const totalTime = completedImports.reduce((sum, e) => sum + e.processingTime, 0);
    stats.averageProcessingTime = totalTime / completedImports.length;
  }
  
  // Group by transaction type
  recentImports.forEach(entry => {
    const type = entry.transactionType || 'unknown';
    if (!stats.byTransactionType[type]) {
      stats.byTransactionType[type] = { count: 0, successful: 0, failed: 0 };
    }
    stats.byTransactionType[type].count++;
    if (entry.status === IMPORT_STATUS.SUCCESS) {
      stats.byTransactionType[type].successful++;
    } else if (entry.status === IMPORT_STATUS.FAILED) {
      stats.byTransactionType[type].failed++;
    }
  });
  
  // Group by source system
  recentImports.forEach(entry => {
    const source = entry.sourceSystem || 'unknown';
    if (!stats.bySourceSystem[source]) {
      stats.bySourceSystem[source] = { count: 0, successful: 0, failed: 0 };
    }
    stats.bySourceSystem[source].count++;
    if (entry.status === IMPORT_STATUS.SUCCESS) {
      stats.bySourceSystem[source].successful++;
    } else if (entry.status === IMPORT_STATUS.FAILED) {
      stats.bySourceSystem[source].failed++;
    }
  });
  
  return stats;
};

// Clear old import history
export const clearOldImportHistory = (daysToKeep = 90) => {
  const history = loadImportHistory();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const filteredHistory = history.filter(entry => 
    new Date(entry.timestamp) >= cutoffDate
  );
  
  saveImportHistory(filteredHistory);
  return history.length - filteredHistory.length; // Return number of entries removed
};

// Export import history
export const exportImportHistory = (format = 'json') => {
  const history = loadImportHistory();
  
  if (format === 'csv') {
    const headers = [
      'Import ID', 'Timestamp', 'Filename', 'Transaction Type', 'Source System',
      'Status', 'Total Rows', 'Successful Rows', 'Failed Rows', 'Processing Time (ms)',
      'User ID', 'File Size (bytes)', 'Batch ID'
    ];
    
    let csv = headers.join(',') + '\n';
    
    history.forEach(entry => {
      const row = [
        entry.id,
        entry.timestamp,
        entry.filename,
        entry.transactionType,
        entry.sourceSystem,
        entry.status,
        entry.totalRows,
        entry.successfulRows,
        entry.failedRows,
        entry.processingTime || '',
        entry.userId,
        entry.fileSize,
        entry.batchId || ''
      ];
      csv += row.map(field => `"${field}"`).join(',') + '\n';
    });
    
    return csv;
  }
  
  return JSON.stringify(history, null, 2);
};

// Mock import processing function (for demonstration)
export const simulateImportProcessing = async (importId, totalRows, processingTimeMs = 2000) => {
  const startTime = Date.now();
  
  // Update status to in progress
  updateImportEntry(importId, {
    status: IMPORT_STATUS.IN_PROGRESS,
    totalRows
  });
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, processingTimeMs));
  
  // Simulate some results (90% success rate)
  const successfulRows = Math.floor(totalRows * 0.9);
  const failedRows = totalRows - successfulRows;
  const processingTime = Date.now() - startTime;
  
  // Complete the import
  return completeImport(importId, {
    status: failedRows > 0 ? IMPORT_STATUS.PARTIAL : IMPORT_STATUS.SUCCESS,
    successfulRows,
    failedRows,
    processingTime,
    errors: failedRows > 0 ? [`${failedRows} rows failed validation`] : [],
    warnings: ['Some data quality issues detected']
  });
};