/**
 * Compensation Plans Module - Central Export
 * 
 * This module contains all compensation plan-related functionality including:
 * - Compensation plan management components
 * - Plan data models
 * - Plan-specific reports
 * - Credit categories and qualifying criteria
 */

// Main Components
export { default as CompensationPlans } from './components/CompensationPlans';
export { default as CreditCategory } from './components/CreditCategory';
export { default as QualifyingCriteria } from './components/QualifyingCriteria';
export { default as ParticipantTable } from './components/ParticipantTable';

// Reports
export { default as PlanComparisonReport } from './reports/PlanComparisonReport';
export { default as PlanPerformanceReport } from './reports/PlanPerformanceReport';
export { default as PlanCostReport } from './reports/PlanCostReport';
export { default as PlanROIReport } from './reports/PlanROIReport';

// Data
export { mockPlans } from './data/mockPlans';
export { mockCreditCategories } from './data/mockCreditCategories';

// Models
export { createCreditCategory } from './models/CreditCategory';
