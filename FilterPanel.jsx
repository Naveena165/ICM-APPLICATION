import React from 'react';
import './FilterPanel.css';

/**
 * Universal Filter Panel Component
 * Provides consistent filtering across all reports
 * Requirements: 3.10.1-3.10.8
 */
const FilterPanel = ({ filters, onChange, availableFilters = [] }) => {
  
  const handleFilterChange = (filterKey, value) => {
    onChange({ ...filters, [filterKey]: value });
  };

  const handleMultiSelectChange = (filterKey, value) => {
    const currentValues = filters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onChange({ ...filters, [filterKey]: newValues });
  };

  const handleResetFilters = () => {
    onChange({});
  };

  const renderFilterControl = (filter) => {
    const value = filters[filter.key] || filter.defaultValue || '';

    switch (filter.type) {
      case 'daterange':
        return (
          <div key={filter.key} className="filter-item">
            <label htmlFor={filter.key}>{filter.label}</label>
            <select
              id={filter.key}
              value={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="filter-select"
            >
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'multiselect':
        const selectedValues = filters[filter.key] || [];
        return (
          <div key={filter.key} className="filter-item filter-multiselect">
            <label>{filter.label}</label>
            <div className="multiselect-container">
              <select
                multiple
                value={selectedValues}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions);
                  onChange({ ...filters, [filter.key]: options.map(opt => opt.value) });
                }}
                className="filter-select multiselect"
                size={Math.min(filter.options.length, 5)}
              >
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="multiselect-hint">
                Hold Ctrl/Cmd to select multiple
              </div>
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={filter.key} className="filter-item">
            <label htmlFor={filter.key}>{filter.label}</label>
            <select
              id={filter.key}
              value={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="filter-select"
            >
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'text':
        return (
          <div key={filter.key} className="filter-item">
            <label htmlFor={filter.key}>{filter.label}</label>
            <input
              id={filter.key}
              type="text"
              value={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="filter-input"
              placeholder={filter.placeholder || ''}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3>Filters</h3>
        <button 
          className="btn-reset-filters" 
          onClick={handleResetFilters}
          aria-label="Reset all filters"
        >
          Reset All
        </button>
      </div>
      <div className="filter-controls">
        {availableFilters.map(filter => renderFilterControl(filter))}
      </div>
    </div>
  );
};

export default FilterPanel;
