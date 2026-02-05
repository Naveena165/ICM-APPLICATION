import { useState, useEffect } from 'react';
import { mockCreditCategories } from '../../data/mockCreditCategories';
import './CreditCategory.css';

/**
 * CreditCategory Component
 * 
 * Credit category selection interface for classification rules.
 * Allows users to assign a credit category to a rule, which links
 * transactions to specific compensation plans.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */
function CreditCategory({ rule, onRuleUpdate }) {
  const [selectedCategory, setSelectedCategory] = useState(rule.creditCategory || '');
  const [availableCategories] = useState(mockCreditCategories);

  // Update local state when rule changes
  useEffect(() => {
    setSelectedCategory(rule.creditCategory || '');
  }, [rule.creditCategory]);

  /**
   * Handle category selection change
   * Immediately saves the association (Requirement 5.5)
   */
  const handleCategoryChange = (event) => {
    if (rule.frozen) {
      alert('Cannot modify a frozen rule. Please unfreeze it first.');
      return;
    }
    
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    
    // Immediately save the association (Requirement 5.5)
    if (onRuleUpdate) {
      onRuleUpdate(rule.id, { creditCategory: categoryId });
    }
  };

  return (
    <div className="credit-category" data-testid="credit-category">
      <h3>Credit Category</h3>
      
      {/* Instruction text (Requirement 5.4) */}
      <p className="instruction-text" data-testid="instruction-text">
        Select a single credit category, meeting the rule criteria, to populate the transaction
      </p>

      {/* Dropdown selector (Requirements 5.1, 5.2) */}
      <div className="form-group">
        <label htmlFor="credit-category-select">Credit Category:</label>
        <select
          id="credit-category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          data-testid="credit-category-select"
          className="credit-category-dropdown"
          disabled={rule.frozen}
        >
          <option value="">-- Select a Credit Category --</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display selected category details */}
      {selectedCategory && (
        <div className="selected-category-details" data-testid="selected-category-details">
          {(() => {
            const category = availableCategories.find(c => c.id === selectedCategory);
            return category ? (
              <>
                <h4>Selected Category Details</h4>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value" data-testid="category-name">{category.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Description:</span>
                  <span className="info-value" data-testid="category-description">{category.description}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Compensation Plan ID:</span>
                  <span className="info-value" data-testid="category-plan-id">{category.compensationPlanId}</span>
                </div>
              </>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}

export default CreditCategory;
