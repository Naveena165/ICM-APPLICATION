/**
 * Import Validation Utility
 * Enhanced validation and error reporting for import files
 */

import { getTemplate } from './importTemplates';

// Validation error types
export const ERROR_TYPES = {
  MISSING_HEADER: 'missing_header',
  INVALID_FORMAT: 'invalid_format',
  REQUIRED_FIELD_EMPTY: 'required_field_empty',
  INVALID_DATA_TYPE: 'invalid_data_type',
  DUPLICATE_VALUE: 'duplicate_value',
  INVALID_REFERENCE: 'invalid_reference',
  OUT_OF_RANGE: 'out_of_range',
  INVALID_DATE: 'invalid_date',
  INVALID_CURRENCY: 'invalid_currency'
};

// Validation severity levels
export const SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Create validation result
export const createValidationResult = () => {
  return {
    isValid: true,
    errors: [],
    warnings: [],
    info: [],
    rowCount: 0,
    validRows: 0,
    invalidRows: 0,
    duplicateRows: 0,
    summary: {
      totalIssues: 0,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0
    }
  };
};

// Add validation issue
export const addValidationIssue = (result, issue) => {
  const validationIssue = {
    id: generateIssueId(),
    type: issue.type || ERROR_TYPES.INVALID_FORMAT,
    severity: issue.severity || SEVERITY.ERROR,
    row: issue.row || null,
    column: issue.column || null,
    field: issue.field || null,
    value: issue.value || null,
    message: issue.message || 'Validation error',
    suggestion: issue.suggestion || null,
    timestamp: new Date().toISOString()
  };
  
  switch (validationIssue.severity) {
    case SEVERITY.ERROR:
      result.errors.push(validationIssue);
      result.summary.errorCount++;
      result.isValid = false;
      break;
    case SEVERITY.WARNING:
      result.warnings.push(validationIssue);
      result.summary.warningCount++;
      break;
    case SEVERITY.INFO:
      result.info.push(validationIssue);
      result.summary.infoCount++;
      break;
  }
  
  result.summary.totalIssues++;
  return validationIssue;
};

// Generate unique issue ID
const generateIssueId = () => {
  return `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Parse CSV content
export const parseCSVContent = (content) => {
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('File is empty');
  }
  
  // Parse headers
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length > 0 && values.some(v => v.trim())) {
      rows.push({
        rowNumber: i + 1,
        values,
        originalLine: lines[i]
      });
    }
  }
  
  return { headers, rows };
};

// Parse single CSV line (handles quoted values)
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  
  return result;
};

// Validate file structure
export const validateFileStructure = (parsedData, transactionType) => {
  const result = createValidationResult();
  const template = getTemplate(transactionType);
  
  result.rowCount = parsedData.rows.length;
  
  // Validate headers
  const requiredHeaders = template.headers
    .filter(h => h.required)
    .map(h => h.label.toLowerCase());
  
  const fileHeaders = parsedData.headers.map(h => h.toLowerCase());
  
  // Check for missing required headers
  requiredHeaders.forEach(required => {
    if (!fileHeaders.includes(required)) {
      addValidationIssue(result, {
        type: ERROR_TYPES.MISSING_HEADER,
        severity: SEVERITY.ERROR,
        field: required,
        message: `Required header '${required}' is missing`,
        suggestion: `Add the '${required}' column to your file`
      });
    }
  });
  
  // Check for unknown headers
  const knownHeaders = template.headers.map(h => h.label.toLowerCase());
  fileHeaders.forEach((header, index) => {
    if (!knownHeaders.includes(header)) {
      addValidationIssue(result, {
        type: ERROR_TYPES.INVALID_FORMAT,
        severity: SEVERITY.WARNING,
        column: index + 1,
        field: header,
        message: `Unknown header '${header}' found`,
        suggestion: `Remove this column or check the template for correct header names`
      });
    }
  });
  
  return result;
};

// Validate data rows
export const validateDataRows = (parsedData, transactionType) => {
  const result = createValidationResult();
  const template = getTemplate(transactionType);
  
  result.rowCount = parsedData.rows.length;
  
  // Create header mapping
  const headerMap = {};
  parsedData.headers.forEach((header, index) => {
    const templateHeader = template.headers.find(h => 
      h.label.toLowerCase() === header.toLowerCase()
    );
    if (templateHeader) {
      headerMap[index] = templateHeader;
    }
  });
  
  // Track duplicates
  const duplicateTracker = {};
  
  // Validate each row
  parsedData.rows.forEach(row => {
    let rowValid = true;
    
    // Check column count
    if (row.values.length !== parsedData.headers.length) {
      addValidationIssue(result, {
        type: ERROR_TYPES.INVALID_FORMAT,
        severity: SEVERITY.ERROR,
        row: row.rowNumber,
        message: `Column count mismatch (expected ${parsedData.headers.length}, got ${row.values.length})`,
        suggestion: 'Ensure all rows have the same number of columns as headers'
      });
      rowValid = false;
    }
    
    // Validate each field
    row.values.forEach((value, columnIndex) => {
      const templateHeader = headerMap[columnIndex];
      if (!templateHeader) return;
      
      const trimmedValue = value.trim();
      
      // Check required fields
      if (templateHeader.required && !trimmedValue) {
        addValidationIssue(result, {
          type: ERROR_TYPES.REQUIRED_FIELD_EMPTY,
          severity: SEVERITY.ERROR,
          row: row.rowNumber,
          column: columnIndex + 1,
          field: templateHeader.label,
          value: trimmedValue,
          message: `Required field '${templateHeader.label}' is empty`,
          suggestion: 'Provide a value for this required field'
        });
        rowValid = false;
      }
      
      // Validate data types
      if (trimmedValue) {
        const typeValidation = validateDataType(trimmedValue, templateHeader.type);
        if (!typeValidation.isValid) {
          addValidationIssue(result, {
            type: ERROR_TYPES.INVALID_DATA_TYPE,
            severity: SEVERITY.ERROR,
            row: row.rowNumber,
            column: columnIndex + 1,
            field: templateHeader.label,
            value: trimmedValue,
            message: `Invalid ${templateHeader.type} format: ${typeValidation.error}`,
            suggestion: typeValidation.suggestion
          });
          rowValid = false;
        }
      }
      
      // Check for duplicates in unique fields
      if (templateHeader.field === 'transactionId' || 
          templateHeader.field === 'paymentId' || 
          templateHeader.field === 'earningId') {
        if (trimmedValue) {
          if (duplicateTracker[trimmedValue]) {
            addValidationIssue(result, {
              type: ERROR_TYPES.DUPLICATE_VALUE,
              severity: SEVERITY.ERROR,
              row: row.rowNumber,
              column: columnIndex + 1,
              field: templateHeader.label,
              value: trimmedValue,
              message: `Duplicate value '${trimmedValue}' found (first seen in row ${duplicateTracker[trimmedValue]})`,
              suggestion: 'Ensure all ID values are unique'
            });
            rowValid = false;
            result.duplicateRows++;
          } else {
            duplicateTracker[trimmedValue] = row.rowNumber;
          }
        }
      }
    });
    
    if (rowValid) {
      result.validRows++;
    } else {
      result.invalidRows++;
    }
  });
  
  return result;
};

// Validate data type
const validateDataType = (value, type) => {
  switch (type) {
    case 'string':
      return { isValid: true };
      
    case 'decimal':
    case 'number':
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return {
          isValid: false,
          error: 'Not a valid number',
          suggestion: 'Use numeric format (e.g., 1500.00)'
        };
      }
      return { isValid: true, value: numValue };
      
    case 'integer':
      const intValue = parseInt(value);
      if (isNaN(intValue) || !Number.isInteger(parseFloat(value))) {
        return {
          isValid: false,
          error: 'Not a valid integer',
          suggestion: 'Use whole numbers only (e.g., 1, 2, 3)'
        };
      }
      return { isValid: true, value: intValue };
      
    case 'date':
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) {
        return {
          isValid: false,
          error: 'Invalid date format',
          suggestion: 'Use YYYY-MM-DD format (e.g., 2025-01-15)'
        };
      }
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        return {
          isValid: false,
          error: 'Invalid date value',
          suggestion: 'Ensure the date is valid (e.g., 2025-01-15)'
        };
      }
      return { isValid: true, value: dateValue };
      
    default:
      return { isValid: true };
  }
};

// Comprehensive file validation
export const validateImportFile = (fileContent, transactionType) => {
  try {
    // Parse the file
    const parsedData = parseCSVContent(fileContent);
    
    // Validate structure
    const structureResult = validateFileStructure(parsedData, transactionType);
    
    // If structure is invalid, don't proceed with data validation
    if (!structureResult.isValid) {
      return structureResult;
    }
    
    // Validate data
    const dataResult = validateDataRows(parsedData, transactionType);
    
    // Combine results
    const combinedResult = {
      isValid: structureResult.isValid && dataResult.isValid,
      errors: [...structureResult.errors, ...dataResult.errors],
      warnings: [...structureResult.warnings, ...dataResult.warnings],
      info: [...structureResult.info, ...dataResult.info],
      rowCount: dataResult.rowCount,
      validRows: dataResult.validRows,
      invalidRows: dataResult.invalidRows,
      duplicateRows: dataResult.duplicateRows,
      summary: {
        totalIssues: structureResult.summary.totalIssues + dataResult.summary.totalIssues,
        errorCount: structureResult.summary.errorCount + dataResult.summary.errorCount,
        warningCount: structureResult.summary.warningCount + dataResult.summary.warningCount,
        infoCount: structureResult.summary.infoCount + dataResult.summary.infoCount
      },
      parsedData
    };
    
    return combinedResult;
    
  } catch (error) {
    const result = createValidationResult();
    addValidationIssue(result, {
      type: ERROR_TYPES.INVALID_FORMAT,
      severity: SEVERITY.ERROR,
      message: `File parsing error: ${error.message}`,
      suggestion: 'Check file format and encoding'
    });
    return result;
  }
};

// Generate validation report
export const generateValidationReport = (validationResult, filename) => {
  let report = `# Import Validation Report\n\n`;
  report += `**File:** ${filename}\n`;
  report += `**Validation Date:** ${new Date().toLocaleString()}\n`;
  report += `**Total Rows:** ${validationResult.rowCount}\n`;
  report += `**Valid Rows:** ${validationResult.validRows}\n`;
  report += `**Invalid Rows:** ${validationResult.invalidRows}\n`;
  report += `**Duplicate Rows:** ${validationResult.duplicateRows}\n\n`;
  
  report += `## Summary\n`;
  report += `- **Total Issues:** ${validationResult.summary.totalIssues}\n`;
  report += `- **Errors:** ${validationResult.summary.errorCount}\n`;
  report += `- **Warnings:** ${validationResult.summary.warningCount}\n`;
  report += `- **Info:** ${validationResult.summary.infoCount}\n\n`;
  
  if (validationResult.errors.length > 0) {
    report += `## Errors\n`;
    validationResult.errors.forEach((error, index) => {
      report += `${index + 1}. **Row ${error.row || 'N/A'}:** ${error.message}\n`;
      if (error.suggestion) {
        report += `   - *Suggestion:* ${error.suggestion}\n`;
      }
      report += `\n`;
    });
  }
  
  if (validationResult.warnings.length > 0) {
    report += `## Warnings\n`;
    validationResult.warnings.forEach((warning, index) => {
      report += `${index + 1}. **Row ${warning.row || 'N/A'}:** ${warning.message}\n`;
      if (warning.suggestion) {
        report += `   - *Suggestion:* ${warning.suggestion}\n`;
      }
      report += `\n`;
    });
  }
  
  return report;
};

// Preview import data
export const previewImportData = (validationResult, maxRows = 10) => {
  if (!validationResult.parsedData) {
    return null;
  }
  
  const { headers, rows } = validationResult.parsedData;
  
  return {
    headers,
    rows: rows.slice(0, maxRows),
    totalRows: rows.length,
    hasMore: rows.length > maxRows
  };
};