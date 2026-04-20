# Classification Rules Migration Guide

## Overview

This guide provides step-by-step instructions for migrating from the old Classification Rules data model to the new comprehensive schema with transaction filter fields.

**Migration Type:** Frontend-only (in-memory/localStorage)  
**Data Loss:** None - all existing data is preserved  
**Backward Compatibility:** Full backward compatibility maintained

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Field Mappings](#field-mappings)
3. [Migration Process](#migration-process)
4. [Using Migration Utilities](#using-migration-utilities)
5. [localStorage Structure](#localstorage-structure)
6. [Validation](#validation)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## Quick Start

### Automatic Migration

The application automatically migrates old rules to the new schema on first load:

```javascript
import { mockClassificationRules } from './data/mockClassificationRules';

// Old rules are automatically migrated when imported
const rules = mockClassificationRules;
// All rules now use new schema
```

### Manual Migration

To manually migrate a single rule:

```javascript
import { migrateOldRuleToNew } from './utils/classificationRuleMigration';
import { ClassificationRule } from './models/ClassificationRule';

const oldRule = {
  id: 'rule-001',
  name: 'West Region',
  rank: 1,
  enabled: true,
  startDate: '2025-01-01',
  // ... other old fields
};

// Migrate to new schema
const newRule = migrateOldRuleToNew(oldRule);

// Validate migrated rule
const validation = newRule.validate();
if (!validation.isValid) {
  console.error('Migration errors:', validation.errors);
}
```

---

## Field Mappings

### Core Fields

| Old Field | New Field | Transformation | Notes |
|-----------|-----------|----------------|-------|
| `id` | `rule_id` | Direct copy | Unique identifier preserved |
| `name` | `rule_name` | Direct copy | Name preserved |
| `rank` | `priority` | Direct copy | Lower number = higher priority |
| `enabled` | `status` | Boolean → Enum | `true` → `'Active'`, `false` → `'Inactive'` |
| `startDate` | `effective_start_date` | Direct copy | ISO date format |
| `endDate` | `effective_end_date` | Direct copy | ISO date format, nullable |
| `createdAt` | `created_at` | Direct copy | Timestamp preserved |
| `updatedAt` | `updated_at` | Direct copy | Timestamp preserved |

### Removed Fields

| Old Field | Reason | Alternative |
|-----------|--------|-------------|
| `businessUnit` | No longer needed | Use `region` or `territory` filters |
| `parentId` | Hierarchy removed | Use flat structure with priority |
| `children` | Hierarchy removed | Use flat structure with priority |
| `creditCategory` | Replaced | Use `target_plan_id` |
| `frozen` | Replaced | Use `status = 'Inactive'` |

### New Required Fields

| New Field | Default Value | Description |
|-----------|---------------|-------------|
| `description` | `null` | Optional rule description |
| `rule_type` | `'Conditional'` | Type of rule (Plan Selection, Component Selection, etc.) |
| `target_plan_id` | `'default-plan'` | Plan to assign when rule matches |
| `classification_type` | `'Plan'` | Classification type (Plan, Component, Measure, Hierarchy) |
| `classification_scope` | `'Transaction'` | Scope (Transaction, Payee, Product) |
| `created_by` | `'system'` | User who created the rule |
| `updated_by` | `null` | User who last updated the rule |

### Transaction Filter Fields (All Optional)

These fields are extracted from `qualifyingCriteria` in old rules:

| New Field | Extracted From | Example |
|-----------|----------------|---------|
| `transaction_type` | `qualifyingCriteria[].attributeValues[].attribute = 'Transaction Type'` | `'Order'`, `'Invoice'`, `'Booking'`, `'Renewal'` |
| `customer_segment` | `qualifyingCriteria[].attributeValues[].attribute = 'Customer Segment'` | `'SMB'`, `'Mid-Market'`, `'Enterprise'` |
| `customer_type` | `qualifyingCriteria[].attributeValues[].attribute = 'Customer Type'` | `'New'`, `'Existing'` |
| `channel` | `qualifyingCriteria[].attributeValues[].attribute = 'Channel'` | `'Direct'`, `'Partner'`, `'Reseller'` |
| `amount_min` | `qualifyingCriteria[].attributeValues[].attribute = 'Amount' AND operator = '>='` | Numeric value |
| `amount_max` | `qualifyingCriteria[].attributeValues[].attribute = 'Amount' AND operator = '<='` | Numeric value |
| `quantity_min` | `qualifyingCriteria[].attributeValues[].attribute = 'Quantity' AND operator = '>='` | Integer value |
| `quantity_max` | `qualifyingCriteria[].attributeValues[].attribute = 'Quantity' AND operator = '<='` | Integer value |
| `region` | `qualifyingCriteria[].attributeValues[].attribute = 'Region'` | String value |
| `territory` | `qualifyingCriteria[].attributeValues[].attribute = 'Territory'` | String value |
| `industry` | `qualifyingCriteria[].attributeValues[].attribute = 'Industry'` | String value |
| `product_sku` | `qualifyingCriteria[].attributeValues[].attribute = 'Product SKU'` | String value |
| `product_category` | `qualifyingCriteria[].attributeValues[].attribute = 'Product Category'` | String value |
| `sales_stage` | `qualifyingCriteria[].attributeValues[].attribute = 'Sales Stage'` | String value |
| `customer_id` | `qualifyingCriteria[].attributeValues[].attribute = 'Customer ID'` | String value |
| `transaction_date_from` | `qualifyingCriteria[].attributeValues[].attribute = 'Date' AND operator = '>='` | ISO date |
| `transaction_date_to` | `qualifyingCriteria[].attributeValues[].attribute = 'Date' AND operator = '<='` | ISO date |

### New Optional Fields

| New Field | Default Value | Description |
|-----------|---------------|-------------|
| `operator_json` | `null` | JSON object mapping fields to operators |
| `condition_expression` | `null` | SQL-like expression string |
| `target_component_id` | `null` | Component to assign (optional) |
| `target_measure_id` | `null` | Measure to assign (optional) |
| `cycle` | `null` | Cycle (Monthly, Quarterly, Annual) |
| `hierarchy_role` | `null` | Role for hierarchy-based rules |
| `hierarchy_team` | `null` | Team for hierarchy-based rules |
| `hierarchy_region` | `null` | Region for hierarchy-based rules |

---

## Migration Process

### Step 1: Backup Existing Data

Before migration, backup your existing rules:

```javascript
// Export existing rules to JSON
const existingRules = JSON.parse(localStorage.getItem('classificationRules') || '[]');
const backup = JSON.stringify(existingRules, null, 2);

// Save to file or copy to clipboard
console.log('Backup:', backup);
```

### Step 2: Run Migration

The migration runs automatically when the application loads:

```javascript
// In mockClassificationRules.js
const migratedRules = oldRules.map(oldRule => {
  const newRuleData = migrateOldRuleToNew(oldRule);
  const newRule = new ClassificationRule(newRuleData);
  
  // Validate
  const validation = newRule.validate();
  if (!validation.isValid) {
    console.warn(`Validation errors for rule ${newRule.rule_id}:`, validation.errors);
  }
  
  return newRule;
});
```

### Step 3: Verify Migration

Check that all rules migrated successfully:

```javascript
import { mockClassificationRules } from './data/mockClassificationRules';

// Count migrated rules
const totalRules = mockClassificationRules.length;
console.log(`Total rules: ${totalRules}`);

// Check for validation errors
const invalidRules = mockClassificationRules.filter(rule => {
  const validation = rule.validate();
  return !validation.isValid;
});

if (invalidRules.length > 0) {
  console.error(`${invalidRules.length} rules have validation errors`);
  invalidRules.forEach(rule => {
    console.error(`Rule ${rule.rule_id}:`, rule.validate().errors);
  });
} else {
  console.log('✓ All rules migrated successfully');
}
```

### Step 4: Test Rule Matching

Test that migrated rules match transactions correctly:

```javascript
import { evaluateRules } from './utils/ruleEvaluationEngine';

const transaction = {
  amount: 50000,
  region: 'West',
  customer_segment: 'Enterprise',
  // ... other transaction fields
};

const matchedRule = evaluateRules(mockClassificationRules, transaction);
console.log('Matched rule:', matchedRule);
```

### Step 5: Save to localStorage

Persist migrated rules:

```javascript
localStorage.setItem('classificationRules', JSON.stringify(mockClassificationRules));
console.log('✓ Rules saved to localStorage');
```

---

## Using Migration Utilities

### migrateOldRuleToNew()

Migrates a single old rule to the new schema:

```javascript
import { migrateOldRuleToNew } from './utils/classificationRuleMigration';

const oldRule = {
  id: 'rule-001',
  name: 'Enterprise West',
  rank: 5,
  enabled: true,
  startDate: '2025-01-01',
  endDate: '2025-12-31',
  qualifyingCriteria: [
    {
      name: 'Enterprise Classification',
      operator: 'AND',
      attributeValues: [
        { attribute: 'Customer Segment', operator: 'Equal to', value: 'Enterprise' },
        { attribute: 'Region', operator: 'Equal to', value: 'West' }
      ]
    }
  ],
  creditCategory: 'plan-enterprise-west'
};

const newRule = migrateOldRuleToNew(oldRule);

console.log('Migrated rule:', newRule);
// Output:
// {
//   rule_id: 'rule-001',
//   rule_name: 'Enterprise West',
//   priority: 5,
//   status: 'Active',
//   effective_start_date: '2025-01-01',
//   effective_end_date: '2025-12-31',
//   customer_segment: 'Enterprise',
//   region: 'West',
//   target_plan_id: 'plan-enterprise-west',
//   // ... other fields
// }
```

### Extraction Helper Functions

Extract specific fields from `qualifyingCriteria`:

```javascript
import {
  extractTransactionType,
  extractCustomerSegment,
  extractAmountMin,
  extractAmountMax,
  extractRegion
} from './utils/classificationRuleMigration';

const qualifyingCriteria = [
  {
    name: 'Filters',
    operator: 'AND',
    attributeValues: [
      { attribute: 'Transaction Type', operator: 'Equal to', value: 'Order' },
      { attribute: 'Customer Segment', operator: 'Equal to', value: 'Enterprise' },
      { attribute: 'Amount', operator: 'Greater than', value: '50000' },
      { attribute: 'Region', operator: 'Equal to', value: 'West' }
    ]
  }
];

const transactionType = extractTransactionType(qualifyingCriteria);
// Output: 'Order'

const customerSegment = extractCustomerSegment(qualifyingCriteria);
// Output: 'Enterprise'

const amountMin = extractAmountMin(qualifyingCriteria);
// Output: 50000

const region = extractRegion(qualifyingCriteria);
// Output: 'West'
```

---

## localStorage Structure

### Old Structure

```json
{
  "classificationRules": [
    {
      "id": "rule-001",
      "name": "West Region",
      "rank": 1,
      "enabled": true,
      "startDate": "2025-01-01",
      "endDate": "2025-12-31",
      "businessUnit": "West Region",
      "parentId": null,
      "children": ["rule-002"],
      "creditCategory": "cat-001",
      "qualifyingCriteria": [
        {
          "name": "Regional Classification",
          "operator": "AND",
          "attributeValues": [
            {
              "attribute": "Region",
              "operator": "Equal to",
              "value": "West"
            }
          ]
        }
      ],
      "frozen": false,
      "createdAt": "2024-12-01T10:00:00Z",
      "updatedAt": "2024-12-01T10:00:00Z"
    }
  ]
}
```

### New Structure

```json
{
  "classificationRules": [
    {
      "rule_id": "rule-001",
      "rule_name": "West Region",
      "description": null,
      "status": "Active",
      "effective_start_date": "2025-01-01",
      "effective_end_date": "2025-12-31",
      "priority": 1,
      "rule_type": "Conditional",
      "transaction_type": null,
      "transaction_date_from": null,
      "transaction_date_to": null,
      "customer_id": null,
      "customer_segment": null,
      "customer_type": null,
      "product_sku": null,
      "product_category": null,
      "amount_min": null,
      "amount_max": null,
      "quantity_min": null,
      "quantity_max": null,
      "region": "West",
      "territory": null,
      "industry": null,
      "channel": null,
      "sales_stage": null,
      "operator_json": null,
      "condition_expression": null,
      "target_plan_id": "cat-001",
      "target_component_id": null,
      "target_measure_id": null,
      "cycle": null,
      "classification_type": "Plan",
      "classification_scope": "Transaction",
      "hierarchy_role": null,
      "hierarchy_team": null,
      "hierarchy_region": null,
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T10:00:00Z",
      "created_by": "system",
      "updated_by": null
    }
  ]
}
```

### Version History Structure

```json
{
  "classificationRulesHistory": [
    {
      "rule_id": "rule-001",
      "version": 1,
      "rule_data": { /* full rule object */ },
      "change_reason": "Initial creation",
      "changed_by": "system",
      "changed_at": "2024-12-01T10:00:00Z"
    },
    {
      "rule_id": "rule-001",
      "version": 2,
      "rule_data": { /* updated rule object */ },
      "change_reason": "Updated priority",
      "changed_by": "admin",
      "changed_at": "2025-01-15T14:30:00Z"
    }
  ]
}
```

---

## Validation

### Validate Migrated Rules

```javascript
import { ClassificationRule } from './models/ClassificationRule';

const rule = new ClassificationRule(migratedData);
const validation = rule.validate();

if (!validation.isValid) {
  console.error('Validation failed:', validation.errors);
  // Output: ['rule_name is required', 'priority must be >= 1', ...]
} else {
  console.log('✓ Rule is valid');
}
```

### Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `rule_id is required` | Missing or empty `rule_id` | Ensure old `id` field exists |
| `rule_name is required` | Missing or empty `rule_name` | Ensure old `name` field exists |
| `effective_start_date is required` | Missing `effective_start_date` | Ensure old `startDate` field exists |
| `priority must be >= 1` | Invalid priority value | Ensure old `rank` field is >= 1 |
| `effective_end_date must be >= effective_start_date` | Invalid date range | Check old `startDate` and `endDate` values |
| `amount_max must be >= amount_min` | Invalid amount range | Check extracted amount values |
| `Invalid customer_segment` | Invalid enum value | Must be 'SMB', 'Mid-Market', or 'Enterprise' |
| `Invalid status` | Invalid status value | Must be 'Active' or 'Inactive' |

---

## Troubleshooting

### Issue: Rules not migrating

**Symptoms:**
- Old rules still appear in UI
- New fields are missing

**Solution:**
```javascript
// Clear localStorage and reload
localStorage.removeItem('classificationRules');
location.reload();
```

### Issue: Validation errors after migration

**Symptoms:**
- Console shows validation errors
- Rules cannot be saved

**Solution:**
```javascript
// Check which fields are invalid
const rule = new ClassificationRule(migratedData);
const validation = rule.validate();
console.log('Errors:', validation.errors);

// Fix invalid fields
if (validation.errors.includes('priority must be >= 1')) {
  rule.priority = 1; // Set default priority
}

// Re-validate
const newValidation = rule.validate();
console.log('Valid:', newValidation.isValid);
```

### Issue: Transaction filters not extracted

**Symptoms:**
- All transaction filter fields are `null`
- Rules don't match expected transactions

**Solution:**
```javascript
// Check qualifyingCriteria structure
console.log('Old criteria:', oldRule.qualifyingCriteria);

// Manually extract if needed
import { extractCustomerSegment } from './utils/classificationRuleMigration';
const segment = extractCustomerSegment(oldRule.qualifyingCriteria);
console.log('Extracted segment:', segment);

// Update rule
rule.customer_segment = segment;
```

### Issue: localStorage quota exceeded

**Symptoms:**
- Error: "QuotaExceededError"
- Rules not saving

**Solution:**
```javascript
// Check localStorage size
const size = new Blob([localStorage.getItem('classificationRules')]).size;
console.log('localStorage size:', size, 'bytes');

// Clear old data
localStorage.removeItem('classificationRulesHistory');

// Or compress data
const rules = JSON.parse(localStorage.getItem('classificationRules'));
const compressed = JSON.stringify(rules); // Remove whitespace
localStorage.setItem('classificationRules', compressed);
```

### Issue: Duplicate rule IDs

**Symptoms:**
- Multiple rules with same `rule_id`
- Unexpected rule behavior

**Solution:**
```javascript
// Find duplicates
const rules = mockClassificationRules;
const ids = rules.map(r => r.rule_id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
console.log('Duplicate IDs:', duplicates);

// Fix duplicates
rules.forEach((rule, index) => {
  if (duplicates.includes(rule.rule_id)) {
    rule.rule_id = `${rule.rule_id}-${index}`;
  }
});
```

---

## FAQ

### Q: Will my existing rules still work after migration?

**A:** Yes! All existing rules are automatically migrated to the new schema with full backward compatibility. No data is lost.

### Q: Do I need to update my rules manually?

**A:** No. The migration happens automatically when you load the application. However, you may want to add new fields (like `description`, `operator_json`, etc.) to take advantage of new features.

### Q: What happens to hierarchy (parent/child) relationships?

**A:** Hierarchy has been removed in the new schema. Rules are now flat with priority-based ordering. Use the `priority` field to control rule evaluation order.

### Q: Can I roll back to the old schema?

**A:** Yes, if you backed up your data before migration. Simply restore the backup to localStorage:

```javascript
const backup = /* your backup JSON */;
localStorage.setItem('classificationRules', JSON.stringify(backup));
location.reload();
```

### Q: How do I add new transaction filters to migrated rules?

**A:** Edit the rule in the UI or programmatically:

```javascript
const rule = getRuleById('rule-001');
rule.customer_segment = 'Enterprise';
rule.amount_min = 50000;
rule.channel = 'Direct';

// Save
localStorage.setItem('classificationRules', JSON.stringify(allRules));
```

### Q: What if my `qualifyingCriteria` has complex logic?

**A:** Complex logic is preserved in the `condition_expression` field. You can also use the `operator_json` field for structured conditions. Use the ConditionBuilder component to edit complex conditions visually.

### Q: How do I test that migration worked correctly?

**A:** Run the integration tests:

```bash
npm test -- ClassificationRules.integration.test.js --testNamePattern="Task 16.1"
```

All 5 migration tests should pass.

### Q: Can I migrate rules from a different source (not localStorage)?

**A:** Yes! Use the `migrateOldRuleToNew()` function:

```javascript
import { migrateOldRuleToNew } from './utils/classificationRuleMigration';

// Load from API, file, etc.
const oldRules = await fetch('/api/old-rules').then(r => r.json());

// Migrate
const newRules = oldRules.map(migrateOldRuleToNew);

// Save
localStorage.setItem('classificationRules', JSON.stringify(newRules));
```

---

## Additional Resources

- [ClassificationRule Model Documentation](./src/models/ClassificationRule.js)
- [Component Documentation](./src/components/CLASSIFICATION_RULES_COMPONENTS.md)
- [Requirements Document](./.kiro/specs/classification-rules-data-model-migration/requirements.md)
- [Design Document](./.kiro/specs/classification-rules-data-model-migration/design.md)
- [Test Results](./src/models/INTEGRATION_TESTS_SUMMARY.md)

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [FAQ](#faq)
3. Check console logs for validation errors
4. Run integration tests to verify migration

---

**Last Updated:** 2025-01-22  
**Version:** 1.0.0
