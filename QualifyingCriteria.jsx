import { useState, useEffect } from 'react';
import './QualifyingCriteria.css';

/**
 * QualifyingCriteria Component
 * 
 * Displays and manages qualifying criteria for classification rules.
 * Shows attribute names, logical operators (AND/OR), and attribute values
 * with their operators and values in a table format.
 * 
 * Requirements: 4.2, 4.3, 4.4, 4.5, 8.2
 */
function QualifyingCriteria({ rule, onRuleUpdate }) {
  const [criteria, setCriteria] = useState(rule.qualifyingCriteria || []);
  const [editingCriterionIndex, setEditingCriterionIndex] = useState(null);
  const [editingAttributeIndex, setEditingAttributeIndex] = useState(null);

  // Available comparison operators (Requirement 8.2)
  const comparisonOperators = [
    'Equal to',
    'Not equal to',
    'Greater than',
    'Less than',
    'Greater than or equal to',
    'Less than or equal to',
    'Contains',
    'Does not contain',
    'Starts with',
    'Ends with'
  ];

  // Update local state when rule changes
  useEffect(() => {
    setCriteria(rule.qualifyingCriteria || []);
  }, [rule.qualifyingCriteria]);

  /**
   * Handle adding a new criterion
   */
  const handleAddCriterion = () => {
    if (rule.frozen) {
      alert('Cannot modify a frozen rule. Please unfreeze it first.');
      return;
    }
    
    const newCriterion = {
      name: 'New Criterion',
      operator: 'AND',
      attributeValues: []
    };
    const updatedCriteria = [...criteria, newCriterion];
    setCriteria(updatedCriteria);
    
    if (onRuleUpdate) {
      onRuleUpdate(rule.id, { qualifyingCriteria: updatedCriteria });
    }
  };

  /**
   * Handle removing a criterion
   */
  const handleRemoveCriterion = (index) => {
    if (rule.frozen) {
      alert('Cannot modify a frozen rule. Please unfreeze it first.');
      return;
    }
    
    const updatedCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(updatedCriteria);
    
    if (onRuleUpdate) {
      onRuleUpdate(rule.id, { qualifyingCriteria: updatedCriteria });
    }
  };

  /**
   * Handle updating criterion name
   */
  const handleCriterionNameChange = (index, newName) => {
    if (rule.frozen) {
      alert('Cannot modify a frozen rule. Please unfreeze it first.');
      return;
    }
    
    const updatedCriteria = [...criteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      name: newName
    };
    setCriteria(updatedCriteria);
    
    if (onRuleUpdate) {
      onRuleUpdate(rule.id, { qualifyingCriteria: updatedCriteria });
    }
  };

  /**
   * Handle updating criterion logical operator (AND/OR)
   */
  const handleCriterionOperatorChange = (index, newOperator) => {
    if (rule.frozen) {
      alert('Cannot modify a frozen rule. Please unfreeze it first.');
      return;
    }
    
    const updatedCriteria = [...criteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      operator: newOperator
    };
    setCriteria(updatedCriteria);
    
    if (onRuleUpdate) {
      onRuleUpdate(rule.id, { qualifyingCriteria: updatedCriteria });
    }
  };

  /**
   * Handle adding a new attribute value to a criterion
   */
  const handleAddAttributeValue = (criterionIndex) => {
    if (rule.frozen) {
      alert('Cannot modify a frozen rule. Please unfreeze it first.');
      return;
    }
    
    const newAttributeValue = {
      attribute: 'New Attribute',
      operator: 'Equal to',
      value: ''
    };
    const updatedCriteria = [...criteria];
    updatedCriteria[criterionIndex] = {
      ...updatedCriteria[criterionIndex],
      attributeValues: [
        ...(updatedCriteria[criterionIndex].attributeValues || []),
        newAttributeValue
      ]
    };
    setCriteria(updatedCriteria);
    
    if (onRuleUpdate) {
      onRuleUpdate(rule.id, { qualifyingCriteria: updatedCriteria });
    }
  };

  /**
   * Handle removing an attribute value
   */
  const handleRemoveAttributeValue = (criterionIndex, attributeIndex) => {
    if (rule.frozen) {
      alert('Cannot modify a frozen rule. Please unfreeze it first.');
      return;
    }
    
    const updatedCriteria = [...criteria];
    updatedCriteria[criterionIndex] = {
      ...updatedCriteria[criterionIndex],
      attributeValues: updatedCriteria[criterionIndex].attributeValues.filter(
        (_, i) => i !== attributeIndex
      )
    };
    setCriteria(updatedCriteria);
    
    if (onRuleUpdate) {
      onRuleUpdate(rule.id, { qualifyingCriteria: updatedCriteria });
    }
  };

  /**
   * Handle updating an attribute value field
   */
  const handleAttributeValueChange = (criterionIndex, attributeIndex, field, value) => {
    if (rule.frozen) {
      alert('Cannot modify a frozen rule. Please unfreeze it first.');
      return;
    }
    
    const updatedCriteria = [...criteria];
    updatedCriteria[criterionIndex].attributeValues[attributeIndex] = {
      ...updatedCriteria[criterionIndex].attributeValues[attributeIndex],
      [field]: value
    };
    setCriteria(updatedCriteria);
    
    if (onRuleUpdate) {
      onRuleUpdate(rule.id, { qualifyingCriteria: updatedCriteria });
    }
  };

  return (
    <div className="qualifying-criteria" data-testid="qualifying-criteria">
      <div className="criteria-header">
        <h3>Qualifying Criteria</h3>
        <button
          className="btn-add-criterion"
          onClick={handleAddCriterion}
          data-testid="btn-add-criterion"
        >
          Add Criterion
        </button>
      </div>

      {criteria.length === 0 ? (
        <p className="no-criteria-message" data-testid="no-criteria-message">
          No qualifying criteria defined. Click "Add Criterion" to create one.
        </p>
      ) : (
        <div className="criteria-list" data-testid="criteria-list">
          {criteria.map((criterion, criterionIndex) => (
            <div
              key={criterionIndex}
              className="criterion-item"
              data-testid={`criterion-${criterionIndex}`}
            >
              <div className="criterion-header">
                <div className="criterion-name-section">
                  <label>Criterion Name:</label>
                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) => handleCriterionNameChange(criterionIndex, e.target.value)}
                    data-testid={`criterion-name-${criterionIndex}`}
                    className="criterion-name-input"
                  />
                </div>

                <div className="criterion-operator-section">
                  <label>Logical Operator:</label>
                  <select
                    value={criterion.operator}
                    onChange={(e) => handleCriterionOperatorChange(criterionIndex, e.target.value)}
                    data-testid={`criterion-operator-${criterionIndex}`}
                    className="criterion-operator-select"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>

                <button
                  className="btn-remove-criterion"
                  onClick={() => handleRemoveCriterion(criterionIndex)}
                  data-testid={`btn-remove-criterion-${criterionIndex}`}
                >
                  Remove
                </button>
              </div>

              {/* Attribute Values Table (Requirements 4.4, 8.2) */}
              <div className="attribute-values-section">
                <div className="attribute-values-header">
                  <h4>Attribute Values</h4>
                  <button
                    className="btn-add-attribute"
                    onClick={() => handleAddAttributeValue(criterionIndex)}
                    data-testid={`btn-add-attribute-${criterionIndex}`}
                  >
                    Add Attribute
                  </button>
                </div>

                {criterion.attributeValues && criterion.attributeValues.length > 0 ? (
                  <table
                    className="attribute-values-table"
                    data-testid={`attribute-values-table-${criterionIndex}`}
                  >
                    <thead>
                      <tr>
                        <th>Attribute</th>
                        <th>Operator</th>
                        <th>Value</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criterion.attributeValues.map((attrValue, attrIndex) => (
                        <tr
                          key={attrIndex}
                          data-testid={`attribute-row-${criterionIndex}-${attrIndex}`}
                        >
                          <td>
                            <input
                              type="text"
                              value={attrValue.attribute}
                              onChange={(e) =>
                                handleAttributeValueChange(
                                  criterionIndex,
                                  attrIndex,
                                  'attribute',
                                  e.target.value
                                )
                              }
                              data-testid={`attribute-name-${criterionIndex}-${attrIndex}`}
                              className="attribute-input"
                            />
                          </td>
                          <td>
                            <select
                              value={attrValue.operator}
                              onChange={(e) =>
                                handleAttributeValueChange(
                                  criterionIndex,
                                  attrIndex,
                                  'operator',
                                  e.target.value
                                )
                              }
                              data-testid={`attribute-operator-${criterionIndex}-${attrIndex}`}
                              className="operator-select"
                            >
                              {comparisonOperators.map((op) => (
                                <option key={op} value={op}>
                                  {op}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={attrValue.value}
                              onChange={(e) =>
                                handleAttributeValueChange(
                                  criterionIndex,
                                  attrIndex,
                                  'value',
                                  e.target.value
                                )
                              }
                              data-testid={`attribute-value-${criterionIndex}-${attrIndex}`}
                              className="value-input"
                            />
                          </td>
                          <td>
                            <button
                              className="btn-remove-attribute"
                              onClick={() => handleRemoveAttributeValue(criterionIndex, attrIndex)}
                              data-testid={`btn-remove-attribute-${criterionIndex}-${attrIndex}`}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p
                    className="no-attributes-message"
                    data-testid={`no-attributes-message-${criterionIndex}`}
                  >
                    No attribute values defined. Click "Add Attribute" to create one.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QualifyingCriteria;
