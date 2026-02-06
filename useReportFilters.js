import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing report filter state
 * Requirements: 3.10.9, 3.10.10
 * 
 * Features:
 * - Manages filter state
 * - Persists filters in sessionStorage
 * - Provides filter change handlers
 * - Provides reset functionality
 */
const useReportFilters = (reportId, initialFilters = {}) => {
  const storageKey = `report-filters-${reportId}`;

  // Initialize filters from sessionStorage or use initial filters
  const [filters, setFilters] = useState(() => {
    try {
      const savedFilters = sessionStorage.getItem(storageKey);
      return savedFilters ? JSON.parse(savedFilters) : initialFilters;
    } catch (error) {
      console.error('Error loading filters from sessionStorage:', error);
      return initialFilters;
    }
  });

  // Persist filters to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters to sessionStorage:', error);
    }
  }, [filters, storageKey]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle single filter change
  const handleSingleFilterChange = useCallback((filterKey, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: value
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    try {
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error removing filters from sessionStorage:', error);
    }
  }, [initialFilters, storageKey]);

  // Clear specific filter
  const clearFilter = useCallback((filterKey) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      delete newFilters[filterKey];
      return newFilters;
    });
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return Object.keys(filters).length > 0 && 
           Object.values(filters).some(value => {
             if (Array.isArray(value)) return value.length > 0;
             return value !== '' && value !== null && value !== undefined;
           });
  }, [filters]);

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }).length;
  }, [filters]);

  return {
    filters,
    setFilters: handleFilterChange,
    handleFilterChange,
    handleSingleFilterChange,
    resetFilters,
    clearFilter,
    hasActiveFilters,
    getActiveFilterCount
  };
};

export default useReportFilters;
