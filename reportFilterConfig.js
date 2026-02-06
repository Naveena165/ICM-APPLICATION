/**
 * Report Filter Configuration
 * Defines available filters for different report types
 * Requirements: 3.10.1-3.10.8
 */

/**
 * Get date range filter options
 * Requirement: 3.10.1
 */
export const getDateRangeFilter = () => ({
  key: 'dateRange',
  label: 'Date Range',
  type: 'daterange',
  defaultValue: 'current-month',
  options: [
    { value: 'current-month', label: 'Current Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ]
});

/**
 * Get region filter options
 * Requirement: 3.10.2
 */
export const getRegionFilter = () => ({
  key: 'region',
  label: 'Region',
  type: 'multiselect',
  defaultValue: [],
  options: [
    { value: 'north', label: 'North America' },
    { value: 'south', label: 'South America' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'central', label: 'Central' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia Pacific' },
    { value: 'other', label: 'Other' }
  ]
});

/**
 * Get plan filter options
 * Requirement: 3.10.3
 */
export const getPlanFilter = () => ({
  key: 'plan',
  label: 'Compensation Plan',
  type: 'multiselect',
  defaultValue: [],
  options: [
    { value: 'sales-2024', label: 'Sales Plan 2024' },
    { value: 'sales-2025', label: 'Sales Plan 2025' },
    { value: 'manager-plan', label: 'Manager Plan' },
    { value: 'executive-plan', label: 'Executive Plan' },
    { value: 'team-lead-plan', label: 'Team Lead Plan' },
    { value: 'specialist-plan', label: 'Specialist Plan' }
  ]
});

/**
 * Get payee filter options
 * Requirement: 3.10.4
 */
export const getPayeeFilter = () => ({
  key: 'payee',
  label: 'Payee',
  type: 'multiselect',
  defaultValue: [],
  options: [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'bob-johnson', label: 'Bob Johnson' },
    { value: 'alice-williams', label: 'Alice Williams' },
    { value: 'charlie-brown', label: 'Charlie Brown' },
    { value: 'diana-davis', label: 'Diana Davis' }
  ]
});

/**
 * Get product filter options
 * Requirement: 3.10.5
 */
export const getProductFilter = () => ({
  key: 'product',
  label: 'Product',
  type: 'multiselect',
  defaultValue: [],
  options: [
    { value: 'product-a', label: 'Product A' },
    { value: 'product-b', label: 'Product B' },
    { value: 'product-c', label: 'Product C' },
    { value: 'service-x', label: 'Service X' },
    { value: 'service-y', label: 'Service Y' },
    { value: 'bundle-1', label: 'Bundle 1' },
    { value: 'bundle-2', label: 'Bundle 2' }
  ]
});

/**
 * Get role filter options
 * Requirement: 3.10.6
 */
export const getRoleFilter = () => ({
  key: 'role',
  label: 'Role',
  type: 'multiselect',
  defaultValue: [],
  options: [
    { value: 'sales-rep', label: 'Sales Representative' },
    { value: 'senior-sales-rep', label: 'Senior Sales Representative' },
    { value: 'sales-manager', label: 'Sales Manager' },
    { value: 'regional-manager', label: 'Regional Manager' },
    { value: 'team-lead', label: 'Team Lead' },
    { value: 'account-executive', label: 'Account Executive' },
    { value: 'specialist', label: 'Specialist' }
  ]
});

/**
 * Get import batch filter options
 * Requirement: 3.10.7
 */
export const getImportBatchFilter = () => ({
  key: 'importBatch',
  label: 'Import Batch',
  type: 'multiselect',
  defaultValue: [],
  options: [
    { value: 'batch-001', label: 'Batch 001 - Jan 2025' },
    { value: 'batch-002', label: 'Batch 002 - Feb 2025' },
    { value: 'batch-003', label: 'Batch 003 - Mar 2025' },
    { value: 'batch-004', label: 'Batch 004 - Apr 2025' },
    { value: 'batch-005', label: 'Batch 005 - May 2025' }
  ]
});

/**
 * Get rule version filter options
 * Requirement: 3.10.8
 */
export const getRuleVersionFilter = () => ({
  key: 'ruleVersion',
  label: 'Rule Version',
  type: 'select',
  defaultValue: 'latest',
  options: [
    { value: 'latest', label: 'Latest Version' },
    { value: 'v1.0', label: 'Version 1.0' },
    { value: 'v1.1', label: 'Version 1.1' },
    { value: 'v2.0', label: 'Version 2.0' },
    { value: 'v2.1', label: 'Version 2.1' },
    { value: 'all', label: 'All Versions' }
  ]
});

/**
 * Get all universal filters
 * Returns all available filters for comprehensive filtering
 */
export const getAllFilters = () => [
  getDateRangeFilter(),
  getRegionFilter(),
  getPlanFilter(),
  getPayeeFilter(),
  getProductFilter(),
  getRoleFilter(),
  getImportBatchFilter(),
  getRuleVersionFilter()
];

/**
 * Get filters for specific report types
 * Different reports may need different subsets of filters
 */
export const getFiltersForReportType = (reportType) => {
  const filterMap = {
    'payee': [
      getDateRangeFilter(),
      getRegionFilter(),
      getPlanFilter(),
      getPayeeFilter(),
      getRoleFilter()
    ],
    'plan': [
      getDateRangeFilter(),
      getRegionFilter(),
      getPlanFilter(),
      getRuleVersionFilter()
    ],
    'transaction': [
      getDateRangeFilter(),
      getRegionFilter(),
      getPlanFilter(),
      getPayeeFilter(),
      getProductFilter(),
      getImportBatchFilter()
    ],
    'earnings': [
      getDateRangeFilter(),
      getRegionFilter(),
      getPlanFilter(),
      getPayeeFilter()
    ],
    'cost': [
      getDateRangeFilter(),
      getRegionFilter(),
      getPlanFilter(),
      getProductFilter()
    ],
    'compliance': [
      getDateRangeFilter(),
      getImportBatchFilter(),
      getRuleVersionFilter()
    ],
    'executive': [
      getDateRangeFilter(),
      getRegionFilter()
    ],
    'dashboard': [
      getDateRangeFilter()
    ]
  };

  return filterMap[reportType] || getAllFilters();
};

/**
 * Apply filters to a dataset
 * Requirement: 3.10.9 - Apply multiple filters simultaneously using AND logic
 */
export const applyFilters = (data, filters) => {
  if (!data || data.length === 0) return [];
  if (!filters || Object.keys(filters).length === 0) return data;

  return data.filter(item => {
    // Check each filter condition
    for (const [filterKey, filterValue] of Object.entries(filters)) {
      // Skip empty filters
      if (!filterValue || 
          (Array.isArray(filterValue) && filterValue.length === 0) ||
          filterValue === '' ||
          filterValue === 'all') {
        continue;
      }

      // Handle different filter types
      switch (filterKey) {
        case 'dateRange':
          if (!isInDateRange(item.date || item.createdDate, filterValue)) {
            return false;
          }
          break;

        case 'region':
          if (Array.isArray(filterValue)) {
            if (!filterValue.includes(item.region)) {
              return false;
            }
          } else if (item.region !== filterValue) {
            return false;
          }
          break;

        case 'plan':
          if (Array.isArray(filterValue)) {
            if (!filterValue.includes(item.planId || item.plan)) {
              return false;
            }
          } else if (item.planId !== filterValue && item.plan !== filterValue) {
            return false;
          }
          break;

        case 'payee':
          if (Array.isArray(filterValue)) {
            if (!filterValue.includes(item.payeeId || item.payee)) {
              return false;
            }
          } else if (item.payeeId !== filterValue && item.payee !== filterValue) {
            return false;
          }
          break;

        case 'product':
          if (Array.isArray(filterValue)) {
            if (!filterValue.includes(item.productId || item.product)) {
              return false;
            }
          } else if (item.productId !== filterValue && item.product !== filterValue) {
            return false;
          }
          break;

        case 'role':
          if (Array.isArray(filterValue)) {
            if (!filterValue.includes(item.role)) {
              return false;
            }
          } else if (item.role !== filterValue) {
            return false;
          }
          break;

        case 'importBatch':
          if (Array.isArray(filterValue)) {
            if (!filterValue.includes(item.importBatchId || item.batchId)) {
              return false;
            }
          } else if (item.importBatchId !== filterValue && item.batchId !== filterValue) {
            return false;
          }
          break;

        case 'ruleVersion':
          if (filterValue !== 'all' && filterValue !== 'latest') {
            if (item.ruleVersion !== filterValue) {
              return false;
            }
          }
          break;

        default:
          // Generic filter handling
          if (item[filterKey] !== filterValue) {
            return false;
          }
      }
    }

    return true;
  });
};

/**
 * Check if a date is within a specified range
 * Helper function for date range filtering
 */
const isInDateRange = (dateString, range) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  switch (range) {
    case 'current-month':
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;

    case 'last-month':
      const lastMonth = new Date(currentYear, currentMonth - 1);
      return date.getFullYear() === lastMonth.getFullYear() && 
             date.getMonth() === lastMonth.getMonth();

    case 'quarter':
      const quarterStart = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1);
      return date >= quarterStart && date <= now;

    case 'last-quarter':
      const lastQuarterStart = new Date(currentYear, Math.floor(currentMonth / 3) * 3 - 3, 1);
      const lastQuarterEnd = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 0);
      return date >= lastQuarterStart && date <= lastQuarterEnd;

    case 'year':
      return date.getFullYear() === currentYear;

    case 'last-year':
      return date.getFullYear() === currentYear - 1;

    case 'ytd':
      const yearStart = new Date(currentYear, 0, 1);
      return date >= yearStart && date <= now;

    default:
      return true;
  }
};
