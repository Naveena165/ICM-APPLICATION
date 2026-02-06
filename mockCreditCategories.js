import { createCreditCategory } from '../models/CreditCategory';

/**
 * Mock data for credit categories
 */

export const mockCreditCategories = [
  createCreditCategory({
    id: 'cat-001',
    name: 'West Region General',
    description: 'General credit category for West Region transactions',
    compensationPlanId: 'plan-001',
  }),

  createCreditCategory({
    id: 'cat-002',
    name: 'Shaw Direct Sales',
    description: 'Credit category for Shaw Direct sales transactions',
    compensationPlanId: 'plan-002',
  }),

  createCreditCategory({
    id: 'cat-003',
    name: 'Unit Based Employee Commission',
    description: 'Commission category for unit-based employees',
    compensationPlanId: 'plan-003',
  }),

  createCreditCategory({
    id: 'cat-004',
    name: 'Wireless Sales Commission',
    description: 'Commission category for wireless product sales',
    compensationPlanId: 'plan-004',
  }),

  createCreditCategory({
    id: 'cat-005',
    name: 'East Region General',
    description: 'General credit category for East Region transactions',
    compensationPlanId: 'plan-005',
  }),

  createCreditCategory({
    id: 'cat-006',
    name: 'Contractor Commission',
    description: 'Commission category for contractor-based work',
    compensationPlanId: 'plan-006',
  }),

  createCreditCategory({
    id: 'cat-007',
    name: 'High Value Transaction Bonus',
    description: 'Bonus category for high-value transactions',
    compensationPlanId: 'plan-007',
  }),

  createCreditCategory({
    id: 'cat-008',
    name: 'Retail Sales',
    description: 'Credit category for retail sales transactions',
    compensationPlanId: 'plan-008',
  }),

  createCreditCategory({
    id: 'cat-009',
    name: 'Business Sales',
    description: 'Credit category for business-to-business sales',
    compensationPlanId: 'plan-009',
  }),

  createCreditCategory({
    id: 'cat-010',
    name: 'Service Upgrade',
    description: 'Credit category for service upgrade transactions',
    compensationPlanId: 'plan-010',
  }),
];

/**
 * Get a credit category by ID
 * @param {string} id - Category ID
 * @returns {CreditCategory|undefined} The category or undefined
 */
export function getCategoryById(id) {
  return mockCreditCategories.find(category => category.id === id);
}

/**
 * Get credit categories by compensation plan ID
 * @param {string} planId - Compensation plan ID
 * @returns {CreditCategory[]} Array of categories
 */
export function getCategoriesByPlanId(planId) {
  return mockCreditCategories.filter(category => category.compensationPlanId === planId);
}
