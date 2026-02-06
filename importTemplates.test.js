/**
 * Import Templates Utility Tests
 */

import {
  getTemplate,
  generateCSVTemplate,
  generateFieldMappingGuide,
  generateImportGuidelines,
  checkTemplateVersion,
  TEMPLATE_VERSION,
  BASE_TRANSACTION_TEMPLATE,
  PAYMENT_TRANSACTION_TEMPLATE
} from './importTemplates';

describe('Import Templates Utility', () => {
  describe('getTemplate', () => {
    test('should return base transaction template for base type', () => {
      const template = getTemplate('base');
      expect(template).toBe(BASE_TRANSACTION_TEMPLATE);
      expect(template.name).toBe('Base Transaction Import Template');
    });

    test('should return payment transaction template for payment type', () => {
      const template = getTemplate('payments');
      expect(template).toBe(PAYMENT_TRANSACTION_TEMPLATE);
      expect(template.name).toBe('Payment Transaction Import Template');
    });

    test('should return base template for unknown type', () => {
      const template = getTemplate('unknown');
      expect(template).toBe(BASE_TRANSACTION_TEMPLATE);
    });
  });

  describe('generateCSVTemplate', () => {
    test('should generate CSV template with headers', () => {
      const csv = generateCSVTemplate('base', false);
      expect(csv).toContain('Transaction ID');
      expect(csv).toContain('Amount');
      expect(csv).toContain('Payee Name');
      expect(csv.split('\n')).toHaveLength(2); // Header + empty line
    });

    test('should generate CSV template with examples when requested', () => {
      const csv = generateCSVTemplate('base', true);
      expect(csv).toContain('Transaction ID');
      expect(csv).toContain('TXN-2025-001'); // Example value
      expect(csv.split('\n')).toHaveLength(3); // Header + example + empty line
    });
  });

  describe('generateFieldMappingGuide', () => {
    test('should generate field mapping guide with required and optional fields', () => {
      const guide = generateFieldMappingGuide('base');
      expect(guide).toContain('# Base Transaction Import Template - Field Mapping Guide');
      expect(guide).toContain('## Required Fields');
      expect(guide).toContain('## Optional Fields');
      expect(guide).toContain('Transaction ID');
      expect(guide).toContain('TXN-2025-001');
    });
  });

  describe('generateImportGuidelines', () => {
    test('should generate comprehensive import guidelines', () => {
      const guidelines = generateImportGuidelines('base');
      expect(guidelines).toContain('# Base Transaction Import Template - Import Guidelines');
      expect(guidelines).toContain('## Before You Start');
      expect(guidelines).toContain('## Data Format Requirements');
      expect(guidelines).toContain('## Required Fields');
      expect(guidelines).toContain('## Common Issues');
    });
  });

  describe('checkTemplateVersion', () => {
    test('should detect when update is available', () => {
      const result = checkTemplateVersion('1.0.0');
      expect(result.updateAvailable).toBe(true);
      expect(result.currentVersion).toBe('1.0.0');
      expect(result.latestVersion).toBe(TEMPLATE_VERSION);
    });

    test('should detect when no update is needed', () => {
      const result = checkTemplateVersion(TEMPLATE_VERSION);
      expect(result.updateAvailable).toBe(false);
      expect(result.currentVersion).toBe(TEMPLATE_VERSION);
      expect(result.latestVersion).toBe(TEMPLATE_VERSION);
    });

    test('should handle missing version', () => {
      const result = checkTemplateVersion();
      expect(result.updateAvailable).toBe(true);
      expect(result.currentVersion).toBe('1.0.0');
    });
  });

  describe('template structure validation', () => {
    test('base template should have required structure', () => {
      const template = BASE_TRANSACTION_TEMPLATE;
      expect(template.version).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.description).toBeDefined();
      expect(template.requiredFields).toBeInstanceOf(Array);
      expect(template.headers).toBeInstanceOf(Array);
      expect(template.headers.length).toBeGreaterThan(0);
    });

    test('all template headers should have required properties', () => {
      const template = BASE_TRANSACTION_TEMPLATE;
      template.headers.forEach(header => {
        expect(header.field).toBeDefined();
        expect(header.label).toBeDefined();
        expect(header.type).toBeDefined();
        expect(typeof header.required).toBe('boolean');
        expect(header.example).toBeDefined();
        expect(header.description).toBeDefined();
      });
    });

    test('required fields should match headers marked as required', () => {
      const template = BASE_TRANSACTION_TEMPLATE;
      const requiredHeaders = template.headers
        .filter(h => h.required)
        .map(h => h.field);
      
      expect(template.requiredFields).toEqual(expect.arrayContaining(requiredHeaders));
    });
  });
});