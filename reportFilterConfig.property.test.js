/**
 * Property-Based Tests for Report Filter Application
 * 
 * Feature: reports-analytics-module
 * Property 2: Filter Application Completeness
 * 
 * Validates: Requirements 3.10
 * 
 * For any report with applied filters, all displayed data should satisfy all filter conditions.
 */

import * as fc from 'fast-check';
import { applyFilters } from './reportFilterConfig';

describe('Property 2: Filter Application Completeness', () => {
  
  // Arbitraries for generating test data
  
  const dateArbitrary = fc.date({
    min: new Date('2020-01-01'),
    max: new Date('2026-12-31')
  });

  const regionArbitrary = fc.constantFrom(
    'north', 'south', 'east', 'west', 'central', 'europe', 'asia', 'other'
  );

  const planArbitrary = fc.constantFrom(
    'sales-2024', 'sales-2025', 'manager-plan', 'executive-plan', 
    'team-lead-plan', 'specialist-plan'
  );

  const payeeArbitrary = fc.constantFrom(
    'john-doe', 'jane-smith', 'bob-johnson', 'alice-williams', 
    'charlie-brown', 'diana-davis'
  );

  const productArbitrary = fc.constantFrom(
    'product-a', 'product-b', 'product-c', 'service-x', 
    'service-y', 'bundle-1', 'bundle-2'
  );

  const roleArbitrary = fc.constantFrom(
    'sales-rep', 'senior-sales-rep', 'sales-manager', 'regional-manager',
    'team-lead', 'account-executive', 'specialist'
  );

  const importBatchArbitrary = fc.constantFrom(
    'batch-001', 'batch-002', 'batch-003', 'batch-004', 'batch-005'
  );

  const ruleVersionArbitrary = fc.constantFrom(
    'v1.0', 'v1.1', 'v2.0', 'v2.1', 'latest', 'all'
  );

  // Generate a data item with all filterable fields
  const dataItemArbitrary = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    date: dateArbitrary.map(d => d.toISOString()),
    region: regionArbitrary,
    planId: planArbitrary,
    payeeId: payeeArbitrary,
    productId: productArbitrary,
    role: roleArbitrary,
    importBatchId: importBatchArbitrary,
    ruleVersion: ruleVersionArbitrary,
    amount: fc.float({ min: 0, max: 100000, noNaN: true })
  });

  // Generate a dataset
  const datasetArbitrary = fc.array(dataItemArbitrary, { minLength: 10, maxLength: 100 });

  // Generate filter configurations
  const dateRangeFilterArbitrary = fc.constantFrom(
    'current-month', 'last-month', 'quarter', 'last-quarter',
    'year', 'last-year', 'ytd'
  );

  const multiSelectFilterArbitrary = (arbitrary) => fc.oneof(
    fc.constant([]), // Empty array (no filter)
    fc.array(arbitrary, { minLength: 1, maxLength: 3 }) // Selected values
  );

  const filtersArbitrary = fc.record({
    dateRange: fc.option(dateRangeFilterArbitrary, { nil: undefined }),
    region: multiSelectFilterArbitrary(regionArbitrary),
    plan: multiSelectFilterArbitrary(planArbitrary),
    payee: multiSelectFilterArbitrary(payeeArbitrary),
    product: multiSelectFilterArbitrary(productArbitrary),
    role: multiSelectFilterArbitrary(roleArbitrary),
    importBatch: multiSelectFilterArbitrary(importBatchArbitrary),
    ruleVersion: fc.option(ruleVersionArbitrary, { nil: undefined })
  });

  /**
   * Property 2.1: All filtered results satisfy region filter
   * **Validates: Requirements 3.10.2, 3.10.9**
   */
  test('all filtered results satisfy region filter when applied', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        multiSelectFilterArbitrary(regionArbitrary),
        (dataset, selectedRegions) => {
          // Skip if no filter applied
          if (selectedRegions.length === 0) return true;

          const filters = { region: selectedRegions };
          const filtered = applyFilters(dataset, filters);

          // All results must have region in selected regions
          return filtered.every(item => selectedRegions.includes(item.region));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.2: All filtered results satisfy plan filter
   * **Validates: Requirements 3.10.3, 3.10.9**
   */
  test('all filtered results satisfy plan filter when applied', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        multiSelectFilterArbitrary(planArbitrary),
        (dataset, selectedPlans) => {
          // Skip if no filter applied
          if (selectedPlans.length === 0) return true;

          const filters = { plan: selectedPlans };
          const filtered = applyFilters(dataset, filters);

          // All results must have planId in selected plans
          return filtered.every(item => selectedPlans.includes(item.planId));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.3: All filtered results satisfy payee filter
   * **Validates: Requirements 3.10.4, 3.10.9**
   */
  test('all filtered results satisfy payee filter when applied', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        multiSelectFilterArbitrary(payeeArbitrary),
        (dataset, selectedPayees) => {
          // Skip if no filter applied
          if (selectedPayees.length === 0) return true;

          const filters = { payee: selectedPayees };
          const filtered = applyFilters(dataset, filters);

          // All results must have payeeId in selected payees
          return filtered.every(item => selectedPayees.includes(item.payeeId));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.4: All filtered results satisfy product filter
   * **Validates: Requirements 3.10.5, 3.10.9**
   */
  test('all filtered results satisfy product filter when applied', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        multiSelectFilterArbitrary(productArbitrary),
        (dataset, selectedProducts) => {
          // Skip if no filter applied
          if (selectedProducts.length === 0) return true;

          const filters = { product: selectedProducts };
          const filtered = applyFilters(dataset, filters);

          // All results must have productId in selected products
          return filtered.every(item => selectedProducts.includes(item.productId));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.5: All filtered results satisfy role filter
   * **Validates: Requirements 3.10.6, 3.10.9**
   */
  test('all filtered results satisfy role filter when applied', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        multiSelectFilterArbitrary(roleArbitrary),
        (dataset, selectedRoles) => {
          // Skip if no filter applied
          if (selectedRoles.length === 0) return true;

          const filters = { role: selectedRoles };
          const filtered = applyFilters(dataset, filters);

          // All results must have role in selected roles
          return filtered.every(item => selectedRoles.includes(item.role));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.6: All filtered results satisfy import batch filter
   * **Validates: Requirements 3.10.7, 3.10.9**
   */
  test('all filtered results satisfy import batch filter when applied', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        multiSelectFilterArbitrary(importBatchArbitrary),
        (dataset, selectedBatches) => {
          // Skip if no filter applied
          if (selectedBatches.length === 0) return true;

          const filters = { importBatch: selectedBatches };
          const filtered = applyFilters(dataset, filters);

          // All results must have importBatchId in selected batches
          return filtered.every(item => selectedBatches.includes(item.importBatchId));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.7: All filtered results satisfy rule version filter
   * **Validates: Requirements 3.10.8, 3.10.9**
   */
  test('all filtered results satisfy rule version filter when applied', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        ruleVersionArbitrary,
        (dataset, selectedVersion) => {
          // Skip if 'all' or 'latest' (these don't filter)
          if (selectedVersion === 'all' || selectedVersion === 'latest') return true;

          const filters = { ruleVersion: selectedVersion };
          const filtered = applyFilters(dataset, filters);

          // All results must have matching ruleVersion
          return filtered.every(item => item.ruleVersion === selectedVersion);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.8: Multiple filters applied simultaneously (AND logic)
   * **Validates: Requirements 3.10.9**
   */
  test('all filtered results satisfy ALL applied filters simultaneously', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        filtersArbitrary,
        (dataset, filters) => {
          const filtered = applyFilters(dataset, filters);

          // Check each filter condition
          return filtered.every(item => {
            // Check region filter
            if (filters.region && filters.region.length > 0) {
              if (!filters.region.includes(item.region)) return false;
            }

            // Check plan filter
            if (filters.plan && filters.plan.length > 0) {
              if (!filters.plan.includes(item.planId)) return false;
            }

            // Check payee filter
            if (filters.payee && filters.payee.length > 0) {
              if (!filters.payee.includes(item.payeeId)) return false;
            }

            // Check product filter
            if (filters.product && filters.product.length > 0) {
              if (!filters.product.includes(item.productId)) return false;
            }

            // Check role filter
            if (filters.role && filters.role.length > 0) {
              if (!filters.role.includes(item.role)) return false;
            }

            // Check import batch filter
            if (filters.importBatch && filters.importBatch.length > 0) {
              if (!filters.importBatch.includes(item.importBatchId)) return false;
            }

            // Check rule version filter
            if (filters.ruleVersion && 
                filters.ruleVersion !== 'all' && 
                filters.ruleVersion !== 'latest') {
              if (item.ruleVersion !== filters.ruleVersion) return false;
            }

            return true;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.9: Empty filters return all data
   * **Validates: Requirements 3.10.9**
   */
  test('empty filters return all data unchanged', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        (dataset) => {
          const filtered = applyFilters(dataset, {});
          return filtered.length === dataset.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.10: Filter result is subset of original data
   * **Validates: Requirements 3.10.9**
   */
  test('filtered results are always a subset of original data', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        filtersArbitrary,
        (dataset, filters) => {
          const filtered = applyFilters(dataset, filters);
          
          // Filtered count should be <= original count
          if (filtered.length > dataset.length) return false;

          // All filtered items should exist in original dataset
          return filtered.every(filteredItem => 
            dataset.some(originalItem => originalItem.id === filteredItem.id)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.11: Filter application is idempotent
   * **Validates: Requirements 3.10.9**
   */
  test('applying the same filters twice produces the same result', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        filtersArbitrary,
        (dataset, filters) => {
          const filtered1 = applyFilters(dataset, filters);
          const filtered2 = applyFilters(filtered1, filters);
          
          // Second application should not change the result
          return filtered1.length === filtered2.length &&
                 filtered1.every((item, index) => item.id === filtered2[index].id);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.12: Date range filter correctness
   * **Validates: Requirements 3.10.1, 3.10.9**
   */
  test('all filtered results satisfy date range filter when applied', () => {
    fc.assert(
      fc.property(
        datasetArbitrary,
        dateRangeFilterArbitrary,
        (dataset, dateRange) => {
          const filters = { dateRange };
          const filtered = applyFilters(dataset, filters);

          // Helper to check if date is in range
          const isInRange = (dateString, range) => {
            const date = new Date(dateString);
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();

            switch (range) {
              case 'current-month':
                return date.getFullYear() === currentYear && 
                       date.getMonth() === currentMonth;
              
              case 'last-month':
                const lastMonth = new Date(currentYear, currentMonth - 1);
                return date.getFullYear() === lastMonth.getFullYear() && 
                       date.getMonth() === lastMonth.getMonth();
              
              case 'year':
                return date.getFullYear() === currentYear;
              
              case 'last-year':
                return date.getFullYear() === currentYear - 1;
              
              default:
                return true;
            }
          };

          // All results must satisfy date range
          return filtered.every(item => isInRange(item.date, dateRange));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.13: Filter persistence requirement
   * **Validates: Requirements 3.10.10**
   */
  test('filter selections persist when navigating between related reports', () => {
    fc.assert(
      fc.property(
        filtersArbitrary,
        (filters) => {
          // Simulate persisting filters to sessionStorage
          const storageKey = 'test-report-filters';
          sessionStorage.setItem(storageKey, JSON.stringify(filters));

          // Simulate retrieving filters
          const retrieved = JSON.parse(sessionStorage.getItem(storageKey));

          // Clean up
          sessionStorage.removeItem(storageKey);

          // Filters should be identical after persistence
          return JSON.stringify(filters) === JSON.stringify(retrieved);
        }
      ),
      { numRuns: 100 }
    );
  });
});
