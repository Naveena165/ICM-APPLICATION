import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import CreditCategory from './CreditCategory';
import { createClassificationRule } from '../models/ClassificationRule';
import { mockCreditCategories } from '../data/mockCreditCategories';

/**
 * Unit Tests for CreditCategory Component
 */

describe('CreditCategory Component', () => {
  const mockRule = createClassificationRule({
    name: 'Test Rule',
    creditCategory: '',
  });

  test('renders credit category selection interface', () => {
    render(<CreditCategory rule={mockRule} onRuleUpdate={() => {}} />);

    // Check that the component renders
    expect(screen.getByTestId('credit-category')).toBeInTheDocument();
    
    // Check that instruction text is displayed (Requirement 5.4)
    expect(screen.getByTestId('instruction-text')).toHaveTextContent(
      'Select a single credit category, meeting the rule criteria, to populate the transaction'
    );
    
    // Check that dropdown is present (Requirements 5.1, 5.2)
    expect(screen.getByTestId('credit-category-select')).toBeInTheDocument();
  });

  test('displays all available credit categories in dropdown', () => {
    render(<CreditCategory rule={mockRule} onRuleUpdate={() => {}} />);

    const dropdown = screen.getByTestId('credit-category-select');
    const options = dropdown.querySelectorAll('option');
    
    // Should have placeholder option + all categories
    expect(options.length).toBe(mockCreditCategories.length + 1);
  });

  test('displays selected category when rule has creditCategory', () => {
    const ruleWithCategory = createClassificationRule({
      name: 'Test Rule',
      creditCategory: 'cat-001',
    });

    render(<CreditCategory rule={ruleWithCategory} onRuleUpdate={() => {}} />);

    const dropdown = screen.getByTestId('credit-category-select');
    expect(dropdown.value).toBe('cat-001');
    
    // Should display category details
    expect(screen.getByTestId('selected-category-details')).toBeInTheDocument();
  });

  test('calls onRuleUpdate when category is selected', () => {
    const mockOnRuleUpdate = jest.fn();
    render(<CreditCategory rule={mockRule} onRuleUpdate={mockOnRuleUpdate} />);

    const dropdown = screen.getByTestId('credit-category-select');
    
    // Select a category
    fireEvent.change(dropdown, { target: { value: 'cat-002' } });

    // Verify onRuleUpdate was called with correct values (Requirement 5.3, 5.5)
    expect(mockOnRuleUpdate).toHaveBeenCalledWith(
      mockRule.id,
      { creditCategory: 'cat-002' }
    );
  });

  test('displays category details after selection', () => {
    render(<CreditCategory rule={mockRule} onRuleUpdate={() => {}} />);

    const dropdown = screen.getByTestId('credit-category-select');
    
    // Select a category
    fireEvent.change(dropdown, { target: { value: 'cat-001' } });

    // Verify category details are displayed
    expect(screen.getByTestId('selected-category-details')).toBeInTheDocument();
    expect(screen.getByTestId('category-name')).toHaveTextContent('West Region General');
    expect(screen.getByTestId('category-description')).toBeInTheDocument();
    expect(screen.getByTestId('category-plan-id')).toBeInTheDocument();
  });

  test('updates when rule prop changes', () => {
    const { rerender } = render(<CreditCategory rule={mockRule} onRuleUpdate={() => {}} />);

    const dropdown = screen.getByTestId('credit-category-select');
    expect(dropdown.value).toBe('');

    // Update rule with a category
    const updatedRule = { ...mockRule, creditCategory: 'cat-003' };
    rerender(<CreditCategory rule={updatedRule} onRuleUpdate={() => {}} />);

    expect(dropdown.value).toBe('cat-003');
  });
});

/**
 * Property-Based Tests for CreditCategory Component
 */

describe('CreditCategory Property-Based Tests', () => {
  /**
   * **Feature: classification-rules-management, Property 11: Credit category association**
   * **Validates: Requirements 5.3**
   * 
   * For any classification rule and selected credit category, 
   * assigning the category should update the rule's creditCategory property
   */
  test('Property 11: Credit category association', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary rule data
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          rank: fc.integer({ min: 1, max: 100 }),
          enabled: fc.boolean(),
          startDate: fc.integer({ min: 2020, max: 2030 }).chain(year => 
            fc.integer({ min: 1, max: 12 }).chain(month =>
              fc.integer({ min: 1, max: 28 }).map(day => 
                `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
              )
            )
          ),
          businessUnit: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        // Generate arbitrary category ID from available categories
        fc.constantFrom(...mockCreditCategories.map(c => c.id)),
        (ruleData, categoryId) => {
          // Create a rule with the generated data
          const rule = createClassificationRule({
            ...ruleData,
            creditCategory: '', // Start with no category
          });

          // Track if onRuleUpdate was called with correct values
          let updateCalled = false;
          let updatedRuleId = null;
          let updatedData = null;

          const mockOnRuleUpdate = (ruleId, updates) => {
            updateCalled = true;
            updatedRuleId = ruleId;
            updatedData = updates;
          };

          // Render the component
          const { container } = render(
            <CreditCategory rule={rule} onRuleUpdate={mockOnRuleUpdate} />
          );

          // Find and change the dropdown
          const dropdown = container.querySelector('[data-testid="credit-category-select"]');
          fireEvent.change(dropdown, { target: { value: categoryId } });

          // Property: assigning the category should update the rule's creditCategory property
          // This means onRuleUpdate should be called with the rule ID and the new category
          return (
            updateCalled &&
            updatedRuleId === rule.id &&
            updatedData.creditCategory === categoryId
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: classification-rules-management, Property 12: Credit category persistence**
   * **Validates: Requirements 5.5**
   * 
   * For any credit category assignment, the association should be saved immediately 
   * and persist after page reload (simulated by re-rendering with updated rule)
   */
  test('Property 12: Credit category persistence', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary rule data
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          rank: fc.integer({ min: 1, max: 100 }),
          enabled: fc.boolean(),
          startDate: fc.integer({ min: 2020, max: 2030 })
            .chain(year => fc.integer({ min: 1, max: 12 })
              .chain(month => fc.integer({ min: 1, max: 28 })
                .map(day => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`))),
          businessUnit: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        // Generate arbitrary category ID from available categories
        fc.constantFrom(...mockCreditCategories.map(c => c.id)),
        (ruleData, categoryId) => {
          // Create a rule with the generated data (no category initially)
          const rule = createClassificationRule({
            ...ruleData,
            creditCategory: '',
          });

          // Track the updated category
          let persistedCategory = null;

          const mockOnRuleUpdate = (ruleId, updates) => {
            persistedCategory = updates.creditCategory;
          };

          // Render the component
          const { container, rerender } = render(
            <CreditCategory rule={rule} onRuleUpdate={mockOnRuleUpdate} />
          );

          // Select a category (this should trigger immediate save)
          const dropdown = container.querySelector('[data-testid="credit-category-select"]');
          fireEvent.change(dropdown, { target: { value: categoryId } });

          // Verify the category was saved
          if (persistedCategory !== categoryId) {
            return false;
          }

          // Simulate page reload by creating a new rule with the persisted category
          const reloadedRule = createClassificationRule({
            ...ruleData,
            id: rule.id,
            creditCategory: persistedCategory,
          });

          // Re-render with the "reloaded" rule
          rerender(<CreditCategory rule={reloadedRule} onRuleUpdate={mockOnRuleUpdate} />);

          // Property: the persisted category should still be displayed after reload
          const dropdownAfterReload = container.querySelector('[data-testid="credit-category-select"]');
          return dropdownAfterReload.value === categoryId;
        }
      ),
      { numRuns: 100 }
    );
  });
});
