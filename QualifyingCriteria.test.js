import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import QualifyingCriteria from './QualifyingCriteria';
import { createClassificationRule } from '../models/ClassificationRule';

/**
 * Unit Tests for QualifyingCriteria Component
 */

describe('QualifyingCriteria Component', () => {
  const mockRule = createClassificationRule({
    name: 'Test Rule',
    qualifyingCriteria: [
      {
        name: 'Test Criterion',
        operator: 'AND',
        attributeValues: [
          {
            attribute: 'Business Unit',
            operator: 'Equal to',
            value: 'West Region'
          }
        ]
      }
    ]
  });

  test('renders qualifying criteria component', () => {
    render(<QualifyingCriteria rule={mockRule} onRuleUpdate={() => {}} />);

    expect(screen.getByTestId('qualifying-criteria')).toBeInTheDocument();
    expect(screen.getByText('Qualifying Criteria')).toBeInTheDocument();
  });

  test('displays message when no criteria exist', () => {
    const ruleWithNoCriteria = createClassificationRule({
      name: 'Test Rule',
      qualifyingCriteria: []
    });

    render(<QualifyingCriteria rule={ruleWithNoCriteria} onRuleUpdate={() => {}} />);

    expect(screen.getByTestId('no-criteria-message')).toBeInTheDocument();
  });

  test('displays existing criteria with name and operator', () => {
    render(<QualifyingCriteria rule={mockRule} onRuleUpdate={() => {}} />);

    expect(screen.getByTestId('criterion-0')).toBeInTheDocument();
    expect(screen.getByTestId('criterion-name-0')).toHaveValue('Test Criterion');
    expect(screen.getByTestId('criterion-operator-0')).toHaveValue('AND');
  });

  test('displays attribute values table', () => {
    render(<QualifyingCriteria rule={mockRule} onRuleUpdate={() => {}} />);

    expect(screen.getByTestId('attribute-values-table-0')).toBeInTheDocument();
    expect(screen.getByTestId('attribute-name-0-0')).toHaveValue('Business Unit');
    expect(screen.getByTestId('attribute-operator-0-0')).toHaveValue('Equal to');
    expect(screen.getByTestId('attribute-value-0-0')).toHaveValue('West Region');
  });

  test('adds new criterion when Add Criterion button is clicked', () => {
    const mockOnRuleUpdate = jest.fn();
    render(<QualifyingCriteria rule={mockRule} onRuleUpdate={mockOnRuleUpdate} />);

    const addButton = screen.getByTestId('btn-add-criterion');
    fireEvent.click(addButton);

    expect(mockOnRuleUpdate).toHaveBeenCalled();
    const updatedCriteria = mockOnRuleUpdate.mock.calls[0][1].qualifyingCriteria;
    expect(updatedCriteria.length).toBe(2);
  });

  test('removes criterion when Remove button is clicked', () => {
    const mockOnRuleUpdate = jest.fn();
    render(<QualifyingCriteria rule={mockRule} onRuleUpdate={mockOnRuleUpdate} />);

    const removeButton = screen.getByTestId('btn-remove-criterion-0');
    fireEvent.click(removeButton);

    expect(mockOnRuleUpdate).toHaveBeenCalled();
    const updatedCriteria = mockOnRuleUpdate.mock.calls[0][1].qualifyingCriteria;
    expect(updatedCriteria.length).toBe(0);
  });

  test('adds new attribute value when Add Attribute button is clicked', () => {
    const mockOnRuleUpdate = jest.fn();
    render(<QualifyingCriteria rule={mockRule} onRuleUpdate={mockOnRuleUpdate} />);

    const addButton = screen.getByTestId('btn-add-attribute-0');
    fireEvent.click(addButton);

    expect(mockOnRuleUpdate).toHaveBeenCalled();
    const updatedCriteria = mockOnRuleUpdate.mock.calls[0][1].qualifyingCriteria;
    expect(updatedCriteria[0].attributeValues.length).toBe(2);
  });

  test('updates criterion name when changed', () => {
    const mockOnRuleUpdate = jest.fn();
    render(<QualifyingCriteria rule={mockRule} onRuleUpdate={mockOnRuleUpdate} />);

    const nameInput = screen.getByTestId('criterion-name-0');
    fireEvent.change(nameInput, { target: { value: 'Updated Criterion' } });

    expect(mockOnRuleUpdate).toHaveBeenCalled();
    const updatedCriteria = mockOnRuleUpdate.mock.calls[0][1].qualifyingCriteria;
    expect(updatedCriteria[0].name).toBe('Updated Criterion');
  });

  test('updates criterion operator when changed', () => {
    const mockOnRuleUpdate = jest.fn();
    render(<QualifyingCriteria rule={mockRule} onRuleUpdate={mockOnRuleUpdate} />);

    const operatorSelect = screen.getByTestId('criterion-operator-0');
    fireEvent.change(operatorSelect, { target: { value: 'OR' } });

    expect(mockOnRuleUpdate).toHaveBeenCalled();
    const updatedCriteria = mockOnRuleUpdate.mock.calls[0][1].qualifyingCriteria;
    expect(updatedCriteria[0].operator).toBe('OR');
  });

  test('updates attribute value fields when changed', () => {
    const mockOnRuleUpdate = jest.fn();
    render(<QualifyingCriteria rule={mockRule} onRuleUpdate={mockOnRuleUpdate} />);

    const valueInput = screen.getByTestId('attribute-value-0-0');
    fireEvent.change(valueInput, { target: { value: 'East Region' } });

    expect(mockOnRuleUpdate).toHaveBeenCalled();
    const updatedCriteria = mockOnRuleUpdate.mock.calls[0][1].qualifyingCriteria;
    expect(updatedCriteria[0].attributeValues[0].value).toBe('East Region');
  });
});

/**
 * Property-Based Tests for QualifyingCriteria Component
 */

describe('QualifyingCriteria Property-Based Tests', () => {
  /**
   * **Feature: classification-rules-management, Property 9: Qualifying criteria display**
   * **Validates: Requirements 4.2, 4.3**
   * 
   * For any classification rule with qualifying criteria, clicking the Qualifying Criteria tab 
   * should display all conditions with attribute names and logical operators
   */
  test('Property 9: Qualifying criteria display', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary qualifying criteria
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            operator: fc.constantFrom('AND', 'OR'),
            attributeValues: fc.array(
              fc.record({
                attribute: fc.string({ minLength: 1, maxLength: 50 }),
                operator: fc.constantFrom(
                  'Equal to',
                  'Not equal to',
                  'Greater than',
                  'Less than'
                ),
                value: fc.string({ minLength: 1, maxLength: 50 })
              }),
              { minLength: 0, maxLength: 5 }
            )
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (qualifyingCriteria) => {
          // Create a rule with the generated criteria
          const rule = createClassificationRule({
            name: 'Test Rule',
            qualifyingCriteria
          });

          // Render the component
          const { container } = render(
            <QualifyingCriteria rule={rule} onRuleUpdate={() => {}} />
          );

          // Property: all conditions should be displayed with attribute names and logical operators
          // Check that each criterion is displayed
          for (let i = 0; i < qualifyingCriteria.length; i++) {
            const criterion = qualifyingCriteria[i];
            
            // Check criterion name is displayed
            const nameInput = container.querySelector(`[data-testid="criterion-name-${i}"]`);
            if (!nameInput || nameInput.value !== criterion.name) {
              return false;
            }

            // Check logical operator is displayed
            const operatorSelect = container.querySelector(`[data-testid="criterion-operator-${i}"]`);
            if (!operatorSelect || operatorSelect.value !== criterion.operator) {
              return false;
            }

            // Check all attribute values are displayed
            for (let j = 0; j < criterion.attributeValues.length; j++) {
              const attrValue = criterion.attributeValues[j];
              
              // Check attribute name
              const attrNameInput = container.querySelector(
                `[data-testid="attribute-name-${i}-${j}"]`
              );
              if (!attrNameInput || attrNameInput.value !== attrValue.attribute) {
                return false;
              }

              // Check attribute operator
              const attrOperatorSelect = container.querySelector(
                `[data-testid="attribute-operator-${i}-${j}"]`
              );
              if (!attrOperatorSelect || attrOperatorSelect.value !== attrValue.operator) {
                return false;
              }

              // Check attribute value
              const attrValueInput = container.querySelector(
                `[data-testid="attribute-value-${i}-${j}"]`
              );
              if (!attrValueInput || attrValueInput.value !== attrValue.value) {
                return false;
              }
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: classification-rules-management, Property 10: Attribute values table display**
   * **Validates: Requirements 4.4**
   * 
   * For any qualifying criteria with attribute values, the system should display a table 
   * showing operators and values for each attribute
   */
  test('Property 10: Attribute values table display', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary qualifying criteria with attribute values
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            operator: fc.constantFrom('AND', 'OR'),
            attributeValues: fc.array(
              fc.record({
                attribute: fc.string({ minLength: 1, maxLength: 50 }),
                operator: fc.constantFrom(
                  'Equal to',
                  'Not equal to',
                  'Greater than',
                  'Less than',
                  'Greater than or equal to',
                  'Less than or equal to'
                ),
                value: fc.string({ minLength: 1, maxLength: 50 })
              }),
              { minLength: 1, maxLength: 5 } // Ensure at least one attribute value
            )
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (qualifyingCriteria) => {
          // Create a rule with the generated criteria
          const rule = createClassificationRule({
            name: 'Test Rule',
            qualifyingCriteria
          });

          // Render the component
          const { container } = render(
            <QualifyingCriteria rule={rule} onRuleUpdate={() => {}} />
          );

          // Property: for each criterion with attribute values, a table should be displayed
          // showing operators and values for each attribute
          for (let i = 0; i < qualifyingCriteria.length; i++) {
            const criterion = qualifyingCriteria[i];
            
            // Check that the attribute values table exists
            const table = container.querySelector(`[data-testid="attribute-values-table-${i}"]`);
            if (!table) {
              return false;
            }

            // Check that each attribute value row is displayed with operator and value
            for (let j = 0; j < criterion.attributeValues.length; j++) {
              const attrValue = criterion.attributeValues[j];
              
              // Check that the row exists
              const row = container.querySelector(
                `[data-testid="attribute-row-${i}-${j}"]`
              );
              if (!row) {
                return false;
              }

              // Check that operator is displayed
              const operatorSelect = container.querySelector(
                `[data-testid="attribute-operator-${i}-${j}"]`
              );
              if (!operatorSelect || operatorSelect.value !== attrValue.operator) {
                return false;
              }

              // Check that value is displayed
              const valueInput = container.querySelector(
                `[data-testid="attribute-value-${i}-${j}"]`
              );
              if (!valueInput || valueInput.value !== attrValue.value) {
                return false;
              }
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
