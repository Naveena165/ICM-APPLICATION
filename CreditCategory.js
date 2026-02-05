/**
 * CreditCategory data model
 * 
 * Represents a category assigned to transactions that links them
 * to specific compensation plans.
 */

/**
 * @typedef {Object} CreditCategory
 * @property {string} id - Unique identifier for the credit category
 * @property {string} name - Name of the credit category
 * @property {string} description - Description of what this category represents
 * @property {string} compensationPlanId - ID of the associated compensation plan
 */

/**
 * Creates a new CreditCategory object with default values
 * @param {Partial<CreditCategory>} data - Partial category data
 * @returns {CreditCategory} Complete category object
 */
export function createCreditCategory(data = {}) {
  return {
    id: data.id || `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: data.name || '',
    description: data.description || '',
    compensationPlanId: data.compensationPlanId || '',
  };
}
