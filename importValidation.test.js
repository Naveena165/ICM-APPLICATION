/**
 * Import Validation Utility Tests
 */

import {
  validateImportFile,
  parseCSVContent,
  validateFileStructure,
  validateDataRows,
  generateValidationReport,
  ERROR_TYPES,
  SEVERITY
} from './importValidation';

describe('Import Validation Utility', () => {
  describe('parseCSVContent', () => {
    test('should parse simple CSV content', () => {
      const content = 'Name,Age,City\nJohn,25,NYC\nJane,30,LA';
      const result = parseCSVContent(content);
      
      expect(result.headers).toEqual(['Name', 'Age', 'City']);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].values).toEqual(['John', '25', 'NYC']);
      expect(result.rows[1].values).toEqual(['Jane', '30', 'LA']);
    });

    test('should handle quoted CSV values', () => {
      const content = '"Transaction ID","Amount","Description"\n"TXN-001","1500.00","Test, transaction"';
      const result = parseCSVContent(content);
      
      expect(result.headers).toEqual(['Transaction ID', 'Amount', 'Description']);
      expect(result.rows[0].values).toEqual(['TXN-001', '1500.00', 'Test, transaction']);
    });

    test('should handle empty lines', () => {
      const content = 'Name,Age\n\nJohn,25\n\nJane,30\n';
      const result = parseCSVContent(content);
      
      expect(result.headers).toEqual(['Name', 'Age']);
      expect(result.rows).toHaveLength(2);
    });

    test('should throw error for empty content', () => {
      expect(() => parseCSVContent('')).toThrow('File is empty');
      expect(() => parseCSVContent('   \n  \n  ')).toThrow('File is empty');
    });
  });

  describe('validateFileStructure', () => {
    test('should validate correct base transaction structure', () => {
      const parsedData = {
        headers: ['Transaction ID', 'Amount', 'Transaction Date', 'Payee ID', 'Payee Name', 'Product ID', 'Product Name', 'Customer ID', 'Customer Name'],
        rows: []
      };
      
      const result = validateFileStructure(parsedData, 'base');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect missing required headers', () => {
      const parsedData = {
        headers: ['Transaction ID', 'Amount'], // Missing required headers
        rows: []
      };
      
      const result = validateFileStructure(parsedData, 'base');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.type === ERROR_TYPES.MISSING_HEADER)).toBe(true);
    });

    test('should warn about unknown headers', () => {
      const parsedData = {
        headers: ['Transaction ID', 'Amount', 'Transaction Date', 'Payee ID', 'Payee Name', 'Product ID', 'Product Name', 'Customer ID', 'Customer Name', 'Unknown Field'],
        rows: []
      };
      
      const result = validateFileStructure(parsedData, 'base');
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.message.includes('Unknown header'))).toBe(true);
    });
  });

  describe('validateDataRows', () => {
    test('should validate correct data rows', () => {
      const parsedData = {
        headers: ['Transaction ID', 'Amount', 'Transaction Date'],
        rows: [
          { rowNumber: 2, values: ['TXN-001', '1500.00', '2025-01-15'] },
          { rowNumber: 3, values: ['TXN-002', '2000.00', '2025-01-16'] }
        ]
      };
      
      const result = validateDataRows(parsedData, 'base');
      expect(result.validRows).toBe(2);
      expect(result.invalidRows).toBe(0);
    });

    test('should detect empty required fields', () => {
      const parsedData = {
        headers: ['Transaction ID', 'Amount'],
        rows: [
          { rowNumber: 2, values: ['TXN-001', ''] }, // Empty required field
          { rowNumber: 3, values: ['', '1500.00'] }  // Empty required field
        ]
      };
      
      const result = validateDataRows(parsedData, 'base');
      expect(result.invalidRows).toBe(2);
      expect(result.errors.some(e => e.type === ERROR_TYPES.REQUIRED_FIELD_EMPTY)).toBe(true);
    });

    test('should detect invalid data types', () => {
      const parsedData = {
        headers: ['Transaction ID', 'Amount', 'Transaction Date'],
        rows: [
          { rowNumber: 2, values: ['TXN-001', 'invalid-amount', '2025-01-15'] },
          { rowNumber: 3, values: ['TXN-002', '1500.00', 'invalid-date'] }
        ]
      };
      
      const result = validateDataRows(parsedData, 'base');
      expect(result.invalidRows).toBe(2);
      expect(result.errors.some(e => e.type === ERROR_TYPES.INVALID_DATA_TYPE)).toBe(true);
    });

    test('should detect duplicate values in unique fields', () => {
      const parsedData = {
        headers: ['Transaction ID', 'Amount'],
        rows: [
          { rowNumber: 2, values: ['TXN-001', '1500.00'] },
          { rowNumber: 3, values: ['TXN-001', '2000.00'] } // Duplicate ID
        ]
      };
      
      const result = validateDataRows(parsedData, 'base');
      expect(result.duplicateRows).toBe(1);
      expect(result.errors.some(e => e.type === ERROR_TYPES.DUPLICATE_VALUE)).toBe(true);
    });
  });

  describe('validateImportFile', () => {
    test('should validate complete valid file', () => {
      const content = 'Transaction ID,Amount,Transaction Date,Payee ID,Payee Name,Product ID,Product Name,Customer ID,Customer Name\nTXN-001,1500.00,2025-01-15,PAY-001,Test Payee,PROD-001,Test Product,CUST-001,Test Customer';
      
      const result = validateImportFile(content, 'base');
      expect(result.isValid).toBe(true);
      expect(result.validRows).toBe(1);
      expect(result.invalidRows).toBe(0);
    });

    test('should handle file with errors', () => {
      const content = 'Transaction ID,Amount\nTXN-001,invalid-amount\n,1500.00'; // Invalid amount and empty ID
      
      const result = validateImportFile(content, 'base');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle parsing errors', () => {
      const result = validateImportFile(null, 'base');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('parsing error'))).toBe(true);
    });
  });

  describe('generateValidationReport', () => {
    test('should generate comprehensive validation report', () => {
      const validationResult = {
        isValid: false,
        rowCount: 2,
        validRows: 1,
        invalidRows: 1,
        duplicateRows: 0,
        summary: {
          totalIssues: 2,
          errorCount: 1,
          warningCount: 1,
          infoCount: 0
        },
        errors: [{
          row: 2,
          message: 'Test error',
          suggestion: 'Fix this'
        }],
        warnings: [{
          row: 3,
          message: 'Test warning',
          suggestion: 'Consider this'
        }]
      };
      
      const report = generateValidationReport(validationResult, 'test.csv');
      expect(report).toContain('# Import Validation Report');
      expect(report).toContain('test.csv');
      expect(report).toContain('**Total Rows:** 2');
      expect(report).toContain('**Valid Rows:** 1');
      expect(report).toContain('**Invalid Rows:** 1');
      expect(report).toContain('## Errors');
      expect(report).toContain('## Warnings');
      expect(report).toContain('Test error');
      expect(report).toContain('Test warning');
    });
  });
});