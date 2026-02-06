/**
 * Validation Error Display Component
 * 
 * Displays validation errors with clear error messages and correction guidance
 * for classification fields and other transaction validation issues.
 */

import React from 'react';
import './ValidationErrorDisplay.css';

/**
 * @typedef {Object} ValidationError
 * @property {boolean} isValid - Whether the validation passed
 * @property {string} field - Field name that failed validation
 * @property {string} message - Error message
 * @property {string} code - Error code
 */

/**
 * ValidationErrorDisplay Component
 * @param {Object} props - Component props
 * @param {ValidationError[]} props.errors - Array of validation errors to display
 * @param {ValidationError[]} props.warnings - Array of validation warnings to display
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showFieldNames - Whether to show field names in error messages
 * @param {function} props.onErrorClick - Callback when an error is clicked
 * @returns {JSX.Element} ValidationErrorDisplay component
 */
export function ValidationErrorDisplay({
  errors = [],
  warnings = [],
  className = '',
  showFieldNames = true,
  onErrorClick = null
}) {
  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  const handleErrorClick = (error) => {
    if (onErrorClick) {
      onErrorClick(error);
    }
  };

  const getErrorIcon = (code) => {
    switch (code) {
      case 'REQUIRED_FIELD_MISSING':
        return '⚠️';
      case 'INVALID_ENUM_VALUE':
        return '❌';
      case 'INVALID_DATA_TYPE':
        return '🔢';
      case 'INVALID_CURRENCY_CODE':
        return '💱';
      case 'INVALID_DATE_FORMAT':
        return '📅';
      case 'INVALID_VALUE_RANGE':
        return '📊';
      default:
        return '❗';
    }
  };

  const getErrorSeverity = (code) => {
    switch (code) {
      case 'REQUIRED_FIELD_MISSING':
        return 'error';
      case 'INVALID_ENUM_VALUE':
        return 'error';
      case 'INVALID_DATA_TYPE':
        return 'error';
      case 'INVALID_CURRENCY_CODE':
        return 'error';
      default:
        return 'warning';
    }
  };

  const formatFieldName = (fieldName) => {
    // Convert camelCase to readable format
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className={`validation-error-display ${className}`}>
      {errors.length > 0 && (
        <div className="validation-errors">
          <h4 className="validation-section-title error">
            <span className="validation-icon">❌</span>
            Validation Errors ({errors.length})
          </h4>
          <ul className="validation-error-list">
            {errors.map((error, index) => (
              <li
                key={`error-${index}`}
                className={`validation-error-item ${getErrorSeverity(error.code)}`}
                onClick={() => handleErrorClick(error)}
                role={onErrorClick ? 'button' : 'listitem'}
                tabIndex={onErrorClick ? 0 : -1}
              >
                <div className="validation-error-content">
                  <span className="validation-error-icon">
                    {getErrorIcon(error.code)}
                  </span>
                  <div className="validation-error-details">
                    {showFieldNames && (
                      <span className="validation-error-field">
                        {formatFieldName(error.field)}:
                      </span>
                    )}
                    <span className="validation-error-message">
                      {error.message}
                    </span>
                    <span className="validation-error-code">
                      ({error.code})
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="validation-warnings">
          <h4 className="validation-section-title warning">
            <span className="validation-icon">⚠️</span>
            Warnings ({warnings.length})
          </h4>
          <ul className="validation-warning-list">
            {warnings.map((warning, index) => (
              <li
                key={`warning-${index}`}
                className="validation-warning-item"
                onClick={() => handleErrorClick(warning)}
                role={onErrorClick ? 'button' : 'listitem'}
                tabIndex={onErrorClick ? 0 : -1}
              >
                <div className="validation-warning-content">
                  <span className="validation-warning-icon">⚠️</span>
                  <div className="validation-warning-details">
                    {showFieldNames && (
                      <span className="validation-warning-field">
                        {formatFieldName(warning.field)}:
                      </span>
                    )}
                    <span className="validation-warning-message">
                      {warning.message}
                    </span>
                    <span className="validation-warning-code">
                      ({warning.code})
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Inline Validation Error Component
 * Shows a single validation error inline with a form field
 */
export function InlineValidationError({ error, className = '' }) {
  if (!error || error.isValid) {
    return null;
  }

  return (
    <div className={`inline-validation-error ${className}`}>
      <span className="inline-error-icon">❌</span>
      <span className="inline-error-message">{error.message}</span>
    </div>
  );
}

/**
 * Validation Summary Component
 * Shows a summary of validation results
 */
export function ValidationSummary({ validationResult, className = '' }) {
  if (!validationResult) {
    return null;
  }

  const { isValid, errors, warnings } = validationResult;

  if (isValid && warnings.length === 0) {
    return (
      <div className={`validation-summary success ${className}`}>
        <span className="validation-summary-icon">✅</span>
        <span className="validation-summary-message">All validations passed</span>
      </div>
    );
  }

  return (
    <div className={`validation-summary ${isValid ? 'warning' : 'error'} ${className}`}>
      <span className="validation-summary-icon">
        {isValid ? '⚠️' : '❌'}
      </span>
      <span className="validation-summary-message">
        {isValid 
          ? `Validation passed with ${warnings.length} warning(s)`
          : `Validation failed with ${errors.length} error(s)${warnings.length > 0 ? ` and ${warnings.length} warning(s)` : ''}`
        }
      </span>
    </div>
  );
}

export default ValidationErrorDisplay;