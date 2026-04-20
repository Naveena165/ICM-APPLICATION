# Credit Rules Full Schema - Complete Specification

**Document Version:** 2.0  
**Last Updated:** January 8, 2026  
**Prepared By:** Kiro AI Assistant

---

## Table of Contents

1. [Requirements Document](#requirements-document)
2. [Design Document](#design-document)
3. [Implementation Tasks](#implementation-tasks)

---

# PART 1: REQUIREMENTS DOCUMENT

## Introduction

The Credit Rules Full Schema feature provides a comprehensive system for managing credit rules that determine payee assignments, credit allocation, and compensation calculations within the ICM (Incentive Compensation Management) system. This schema supports rule evaluation, prioritization, payee assignment (one-to-one, one-to-many, many-to-many), versioning, and complete auditability. Credit rules define who receives credit based on transaction attributes, hierarchy roles, territories, and other business logic.

## Glossary

- **Credit_Rule**: A rule that determines who receives credit and in what percentage based on transaction attributes and business logic
- **Rule_ID**: Unique system-generated identifier for a credit rule (VARCHAR(50))
- **Payee**: An individual or entity that receives credit for a transaction
- **Payee_Assignment**: The association between a credit rule and one or more payees with their credit allocation
- **Split_Percentage**: The percentage of credit assigned to a specific payee (DECIMAL(5,2))
- **Credit_Type**: Classification of credit as Full, Partial, or Override
- **Rule_Type**: Classification of rule logic as Attribute-Based, Hierarchy-Based, Split, or Time-Based
- **Priority**: Integer value determining rule execution order (lower value = higher priority)
- **Version_Number**: Integer tracking rule version for historical tracking and auditability
- **Transaction_Attribute**: A property of a transaction used for rule matching (e.g., transaction_type, customer_type, territory)
- **Hierarchy_Role**: A role within the organizational hierarchy (e.g., Manager, Director, VP)
- **Territory_Owner**: The assigned owner of a specific sales territory
- **Effective_Date_Range**: The period during which a rule is valid (effective_start_date to effective_end_date)
- **Classification_Scope**: The scope of rule application (Attribute, Hierarchy, Territory, Role)
- **Operator_JSON**: JSON structure defining comparison operators for transaction attribute conditions
- **Condition_Expression**: Logical expression for complex rule evaluation
- **ICM_System**: The Incentive Compensation Management System
- **Calculation_Engine**: The system component that processes credit assignments and calculates compensation

## Requirements

### Requirement 1: Core Rule Metadata Management

**User Story:** As an ICM administrator, I want to create and manage credit rules with comprehensive metadata, so that I can track rule identity, purpose, validity, and execution priority.

#### Acceptance Criteria

1. WHEN creating a new credit rule, THEN the ICM_System SHALL generate a unique rule_id (VARCHAR(50))
2. WHEN creating a credit rule, THEN the ICM_System SHALL require the user to provide a rule_name (VARCHAR(150))
3. WHEN creating a credit rule, THEN the ICM_System SHALL allow the user to provide an optional description (TEXT)
4. WHEN creating a credit rule, THEN the ICM_System SHALL require the user to set the status as either "Active" or "Inactive" (VARCHAR(20))
5. WHEN creating a credit rule, THEN the ICM_System SHALL require the user to select a rule_type from: "Attribute-Based", "Hierarchy-Based", "Split", or "Time-Based" (VARCHAR(50))
6. WHEN creating a credit rule, THEN the ICM_System SHALL require the user to specify an effective_start_date (DATE)
7. WHEN creating a credit rule, THEN the ICM_System SHALL allow the user to optionally specify an effective_end_date (DATE)
8. WHEN creating a credit rule, THEN the ICM_System SHALL require the user to assign a priority value (INT) where lower values indicate higher priority
9. WHEN creating a credit rule, THEN the ICM_System SHALL automatically set version_number to 1 (INT)
10. WHEN effective_end_date is provided, THEN the ICM_System SHALL validate that effective_end_date is after effective_start_date

### Requirement 2: Transaction Attribute Conditions

**User Story:** As an ICM administrator, I want to define transaction-level conditions for credit rules, so that rules apply only to transactions matching specific criteria.

#### Acceptance Criteria

1. WHEN defining a credit rule, THEN the ICM_System SHALL allow the user to add zero or more transaction attribute conditions
2. WHEN adding transaction conditions, THEN the ICM_System SHALL support the following optional fields: transaction_type, transaction_date_from, transaction_date_to, customer_id, customer_type, territory, region, product_sku, product_category, industry, channel_partner, deal_size_min, deal_size_max, sales_stage
3. WHEN transaction_type is specified, THEN the ICM_System SHALL allow values: "Order", "Invoice", or "Revenue Event"
4. WHEN customer_type is specified, THEN the ICM_System SHALL allow values: "New" or "Existing"
5. WHEN deal_size_min and deal_size_max are specified, THEN the ICM_System SHALL validate that deal_size_max is greater than or equal to deal_size_min
6. WHEN transaction_date_from and transaction_date_to are specified, THEN the ICM_System SHALL validate that transaction_date_to is after transaction_date_from
7. WHEN advanced logic is required, THEN the ICM_System SHALL support operator_json (JSON) to define operators per condition
8. WHEN complex evaluation is required, THEN the ICM_System SHALL support condition_expression (TEXT) for full logical expressions
9. WHEN no transaction conditions are specified, THEN the ICM_System SHALL apply the rule to all transactions

### Requirement 3-19: [Additional Requirements]

For complete requirements 3-19, see the original requirements.md file at `.kiro/specs/credit-rules-full-schema/requirements.md`

Key requirements include:
- Requirement 3: Payee Assignment Fields
- Requirement 4-6: One-to-One, One-to-Many, Many-to-Many Payee Assignment
- Requirement 7: Rule Priority and Sequencing
- Requirement 8-9: Rule Versioning and Historical Preservation
- Requirement 10: Classification and System Fields
- Requirement 11: Rule Validation
- Requirement 12: Backward Compatibility
- Requirement 13: Scalability and Performance
- Requirement 14: Integration with Calculation Engine
- Requirement 15: Conflict Detection and Resolution
- Requirement 16: Rule Testing and Preview
- Requirement 17: Bulk Rule Operations
- Requirement 18: Rule Export and Import
- Requirement 19: Access Control and Permissions

---

# PART 2: DESIGN DOCUMENT

## Overview

The Credit Rules Full Schema system provides a comprehensive solution for managing credit allocation rules within the ICM application. The system enables administrators to define complex rules that determine who receives credit for transactions, in what proportion, and under what conditions.

### Key Design Principles

1. **Immutability of Historical Data**: Once credit assignments are processed, they cannot be modified
2. **Version-Based Evolution**: All rule changes create new versions, preserving historical accuracy
3. **Priority-Based Evaluation**: Clear, deterministic rule selection based on priority and timestamps
4. **Dynamic Payee Resolution**: Support for role-based and territory-based payee assignment
5. **Comprehensive Auditability**: Complete tracking of who changed what and when
6. **Performance Optimization**: Efficient rule evaluation for high-volume transaction processing

## Architecture Components

### System Components

1. **Rule Management Service**: CRUD operations, validation, conflict detection, versioning
2. **Rule Evaluation Engine**: Retrieve active rules, evaluate conditions, apply priority-based selection
3. **Credit Assignment Generator**: Create credit assignment records, calculate split amounts, handle rounding
4. **Data Access Layer**: Database operations, query optimization, caching, transaction management
5. **Validation Service**: Field validation, business rule validation, conflict detection

### Data Models

#### Core Entities

**CreditRule**: Core metadata (rule_id, rule_name, description, status, rule_type, effective dates, priority, version_number, classification_scope, audit fields)

**RuleFilter**: Transaction attribute conditions (transaction_type, customer_type, territory, region, product details, deal_size ranges, operator_json, condition_expression)

**PayeeAssignment**: Payee identification and credit allocation (payee_id, payee_type, hierarchy_role, territory_owner, split_percentage, credit_type, is_active)

**CreditAssignment**: Credit assignment records (transaction_id, rule_id, rule_version_number, payee_id, credit_amount, status, processed_at, payout_id)

## Correctness Properties

The system implements 15 correctness properties validated through property-based testing:

1. **Rule Version Immutability**: Updates create new versions without modifying historical versions
2. **Split Percentage Totals 100%**: Multiple payee splits sum to 100% (±0.01% tolerance)
3. **Priority-Based Rule Selection**: Deterministic rule selection using priority, effective_start_date, created_at
4. **Credit Assignment Immutability**: Processed assignments cannot be modified
5. **Effective Date Range Validity**: End dates after start dates, rules only apply within date range
6. **Dynamic Payee Resolution**: Runtime resolution of hierarchy_role and territory_owner
7. **Credit Amount Calculation Accuracy**: Accurate split calculations with rounding adjustment
8. **Version Number Increment**: Sequential version numbering on updates
9. **Active Rule Retrieval**: Only active, current version rules within effective date range
10. **Audit Trail Completeness**: Complete audit logging of all changes
11. **Payee Assignment Uniqueness**: No duplicate payees within a rule
12. **Transaction Attribute Validation**: Valid numeric and date ranges
13. **Rule Evaluation Determinism**: Consistent results for same inputs
14. **Credit Assignment Status Transition**: One-way status transitions (Pending → Processed)
15. **Retroactive Impact Prevention**: Historical assignments remain unchanged

## Database Schema

### Tables

1. **credit_rules**: Core rule metadata with indexes on status, version, priority, effective dates
2. **credit_rule_filters**: Transaction attribute conditions with foreign key to credit_rules
3. **credit_rule_payees**: Payee assignments with foreign key to credit_rules
4. **credit_assignments**: Credit assignment records with foreign keys to transactions and rules

### Performance Optimizations

- Composite indexes for common query patterns
- Caching layer (5min rules, 15min payees, 1min results)
- Batch processing support
- Query optimization with pre-filtering

## Testing Strategy

### Dual Testing Approach

- **Unit Tests**: Specific examples, edge cases, error conditions, UI interactions
- **Property Tests**: Universal properties across all inputs using fast-check library (minimum 100 iterations)

### Test Configuration

- Property tests run 100+ iterations per property
- Each test references design document property number
- Tag format: `Feature: credit-rules-full-schema, Property {number}: {property_text}`

## UI/UX Components

### Key Components

1. **FilterBuilder**: Visual interface for complex transaction filter conditions
2. **PayeeAssignmentList**: Manage multiple payee assignments with split credit validation
3. **PreviewResultsDisplay**: Show sample transactions matching rule criteria
4. **VersionHistoryModal**: Display all versions with change tracking and diff view

### Component Hierarchy

- CreditRulesApp
  - CreditRuleListScreen (list, search, filters, bulk actions)
  - CreateEditRuleScreen (basic info, filters, payee assignments, preview)
  - VersionHistoryModal (version list, details view)
  - BulkOperationsModal (selection, actions, summary)
  - ImportExportModal (export options, import validation)

For complete design details including:
- Detailed component interfaces and methods
- Complete data model specifications
- Error handling strategies
- Security considerations
- Workflow integration points
- Known issues and resolutions

See the original design.md file at `.kiro/specs/credit-rules-full-schema/design.md`

---

