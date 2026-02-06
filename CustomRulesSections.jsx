// Section Components for Custom Rules Editor

// Section A: Rule Header
export const RuleHeaderSection = ({ formData, onChange }) => (
  <div className="form-section">
    <h2>Rule Header</h2>
    <div className="form-grid">
      <div className="form-group">
        <label>Rule Name <span className="required">*</span></label>
        <input
          type="text"
          value={formData.ruleName}
          onChange={(e) => onChange('ruleName', e.target.value)}
          placeholder="Enter rule name"
        />
      </div>

      <div className="form-group">
        <label>Rule Category <span className="required">*</span></label>
        <select value={formData.category} onChange={(e) => onChange('category', e.target.value)}>
          <option value="Rate Table">Rate Table</option>
          <option value="Tier">Tier</option>
          <option value="Mapping">Mapping</option>
          <option value="Flag">Flag</option>
          <option value="Exception">Exception</option>
        </select>
      </div>

      <div className="form-group">
        <label>Lookup Code <span className="required">*</span></label>
        <input
          type="text"
          value={formData.lookupCode}
          onChange={(e) => onChange('lookupCode', e.target.value.toUpperCase())}
          placeholder="UNIQUE_CODE"
        />
        <small>Must be unique across all rules</small>
      </div>

      <div className="form-group">
        <label>Status</label>
        <select value={formData.status} onChange={(e) => onChange('status', e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="form-group">
        <label>Effective Start Date <span className="required">*</span></label>
        <input
          type="date"
          value={formData.effectiveStart}
          onChange={(e) => onChange('effectiveStart', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Effective End Date</label>
        <input
          type="date"
          value={formData.effectiveEnd}
          onChange={(e) => onChange('effectiveEnd', e.target.value)}
        />
        <small>Leave blank for no end date</small>
      </div>

      <div className="form-group">
        <label>Priority <span className="required">*</span></label>
        <input
          type="number"
          value={formData.priority}
          onChange={(e) => onChange('priority', parseInt(e.target.value))}
          min="1"
          max="100"
        />
        <small>Higher priority overrides lower (1-100)</small>
      </div>

      <div className="form-group">
        <label>Calculation Type <span className="required">*</span></label>
        <select value={formData.calculationType} onChange={(e) => onChange('calculationType', e.target.value)}>
          <option value="Rate">Rate</option>
          <option value="Value">Value</option>
          <option value="Multiplier">Multiplier</option>
          <option value="Boolean">Boolean</option>
          <option value="Threshold">Threshold</option>
          <option value="Text">Text</option>
        </select>
      </div>

      <div className="form-group full-width">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Enter rule description"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Rule Group</label>
        <input
          type="text"
          value={formData.ruleGroup}
          onChange={(e) => onChange('ruleGroup', e.target.value)}
          placeholder="Optional grouping"
        />
      </div>
    </div>

    <div className="audit-info">
      <h3>Audit Information</h3>
      <div className="audit-grid">
        <div><strong>Created By:</strong> {formData.createdBy}</div>
        <div><strong>Modified By:</strong> {formData.modifiedBy}</div>
        <div><strong>Last Modified:</strong> {formData.lastModified}</div>
        <div><strong>Version:</strong> {formData.version}</div>
      </div>
    </div>
  </div>
);

// Section B: Lookup Keys
export const LookupKeysSection = ({ formData, onChange }) => {
  const keyOptions = {
    key1: ['Product', 'SKU', 'Category'],
    key2: ['Region', 'Territory'],
    key3: ['Customer Type', 'Segment'],
    key4: ['Role', 'Payee Type'],
    key5: ['Custom Attribute']
  };

  return (
    <div className="form-section">
      <h2>Define Lookup Keys</h2>
      <p className="section-description">
        Configure up to 5 lookup keys for multi-dimensional rule matching. Keys are optional and evaluated in combination.
      </p>

      {Object.keys(formData.lookupKeys).map((keyNum, index) => (
        <div key={keyNum} className="lookup-key-card">
          <div className="lookup-key-header">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.lookupKeys[keyNum].enabled}
                onChange={(e) => onChange(keyNum, 'enabled', e.target.checked)}
              />
              <strong>Key {index + 1}</strong>
            </label>
          </div>

          {formData.lookupKeys[keyNum].enabled && (
            <div className="lookup-key-content">
              <div className="form-group">
                <label>Key Type</label>
                <select
                  value={formData.lookupKeys[keyNum].type}
                  onChange={(e) => onChange(keyNum, 'type', e.target.value)}
                >
                  <option value="">Select type...</option>
                  {keyOptions[keyNum].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Key Value</label>
                <input
                  type="text"
                  value={formData.lookupKeys[keyNum].value}
                  onChange={(e) => onChange(keyNum, 'value', e.target.value)}
                  placeholder="Enter value or pattern"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="info-box">
        <strong>💡 Multi-Key Lookup:</strong> When multiple keys are enabled, the rule matches only when ALL keys match the transaction data.
      </div>
    </div>
  );
};

// Section C: Output Values
export const OutputValuesSection = ({ formData, onChange, calculationType }) => (
  <div className="form-section">
    <h2>Define Output / Return Values</h2>
    <p className="section-description">
      Configure the values returned when this rule matches. Fields shown depend on Calculation Type: <strong>{calculationType}</strong>
    </p>

    <div className="form-grid">
      {(calculationType === 'Rate' || calculationType === 'Value') && (
        <div className="form-group">
          <label>{calculationType} Value <span className="required">*</span></label>
          <input
            type="number"
            step="0.01"
            value={formData.outputValues.rate}
            onChange={(e) => onChange('rate', e.target.value)}
            placeholder="0.00"
          />
          <small>Maximum system rate: 100.00</small>
        </div>
      )}

      {calculationType === 'Multiplier' && (
        <div className="form-group">
          <label>Multiplier <span className="required">*</span></label>
          <input
            type="number"
            step="0.01"
            value={formData.outputValues.multiplier}
            onChange={(e) => onChange('multiplier', e.target.value)}
            placeholder="1.00"
          />
          <small>Typical range: 0.5 - 2.0</small>
        </div>
      )}

      {calculationType === 'Threshold' && (
        <>
          <div className="form-group">
            <label>Threshold Min <span className="required">*</span></label>
            <input
              type="number"
              value={formData.outputValues.thresholdMin}
              onChange={(e) => onChange('thresholdMin', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Threshold Max <span className="required">*</span></label>
            <input
              type="number"
              value={formData.outputValues.thresholdMax}
              onChange={(e) => onChange('thresholdMax', e.target.value)}
              placeholder="100"
            />
            <small>Must be greater than Min</small>
          </div>
        </>
      )}

      {calculationType === 'Boolean' && (
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.outputValues.booleanFlag}
              onChange={(e) => onChange('booleanFlag', e.target.checked)}
            />
            Boolean Flag Value
          </label>
        </div>
      )}

      {calculationType === 'Text' && (
        <div className="form-group full-width">
          <label>Text Value <span className="required">*</span></label>
          <input
            type="text"
            value={formData.outputValues.value}
            onChange={(e) => onChange('value', e.target.value)}
            placeholder="Enter text value"
          />
        </div>
      )}

      <div className="form-group full-width">
        <label>Output Description</label>
        <textarea
          value={formData.outputValues.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe what this output represents"
          rows="2"
        />
      </div>
    </div>

    <div className="validation-summary">
      <h3>Validation Rules</h3>
      <ul>
        <li>✓ Rate values must be ≤ system maximum (100.00)</li>
        <li>✓ Threshold Min must be &lt; Threshold Max</li>
        <li>✓ Percentage values must be between 0-200</li>
        <li>✓ All required fields must be filled</li>
      </ul>
    </div>
  </div>
);

// Section D: Preview & Simulation
export const PreviewSection = ({ formData }) => {
  const sampleTransactions = [
    {
      id: 'TXN001',
      product: 'Product A',
      region: 'North',
      customerType: 'Premium',
      role: 'Sales Rep',
      amount: 1000,
      matches: true
    },
    {
      id: 'TXN002',
      product: 'Product B',
      region: 'South',
      customerType: 'Standard',
      role: 'Manager',
      amount: 2000,
      matches: false
    },
    {
      id: 'TXN003',
      product: 'Product A',
      region: 'North',
      customerType: 'Premium',
      role: 'Manager',
      amount: 1500,
      matches: true
    }
  ];

  return (
    <div className="form-section">
      <h2>Preview & Simulation</h2>
      <p className="section-description">
        See sample transactions that would match this rule based on configured lookup keys.
      </p>

      <div className="rule-summary-card">
        <h3>Rule Configuration Summary</h3>
        <div className="summary-grid">
          <div><strong>Rule Name:</strong> {formData.ruleName || 'Not set'}</div>
          <div><strong>Category:</strong> {formData.category}</div>
          <div><strong>Lookup Code:</strong> {formData.lookupCode || 'Not set'}</div>
          <div><strong>Priority:</strong> {formData.priority}</div>
          <div><strong>Calculation Type:</strong> {formData.calculationType}</div>
          <div><strong>Status:</strong> {formData.status}</div>
        </div>

        <h4>Active Lookup Keys:</h4>
        <ul>
          {Object.entries(formData.lookupKeys)
            .filter(([_, key]) => key.enabled)
            .map(([keyNum, key]) => (
              <li key={keyNum}>
                <strong>{key.type}:</strong> {key.value}
              </li>
            ))}
          {Object.values(formData.lookupKeys).every(k => !k.enabled) && (
            <li className="text-muted">No lookup keys configured</li>
          )}
        </ul>
      </div>

      <h3>Sample Transaction Matches</h3>
      <table className="preview-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Product</th>
            <th>Region</th>
            <th>Customer Type</th>
            <th>Role</th>
            <th>Amount</th>
            <th>Match Status</th>
            <th>Output Value</th>
          </tr>
        </thead>
        <tbody>
          {sampleTransactions.map(txn => (
            <tr key={txn.id} className={txn.matches ? 'match-row' : ''}>
              <td>{txn.id}</td>
              <td>{txn.product}</td>
              <td>{txn.region}</td>
              <td>{txn.customerType}</td>
              <td>{txn.role}</td>
              <td>${txn.amount}</td>
              <td>
                <span className={`match-badge ${txn.matches ? 'match' : 'no-match'}`}>
                  {txn.matches ? '✓ Match' : '✗ No Match'}
                </span>
              </td>
              <td>
                {txn.matches ? (
                  formData.calculationType === 'Rate' ? `${formData.outputValues.rate}%` :
                  formData.calculationType === 'Multiplier' ? `×${formData.outputValues.multiplier}` :
                  formData.calculationType === 'Boolean' ? (formData.outputValues.booleanFlag ? 'True' : 'False') :
                  formData.outputValues.value || '—'
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="info-box">
        <strong>💡 Note:</strong> This is a simulation based on sample data. Actual matching will occur at runtime based on transaction attributes.
      </div>
    </div>
  );
};

// Section E: Versioning
export const VersioningSection = ({ formData }) => {
  const versionHistory = [
    {
      version: 3,
      publishedBy: 'Admin User',
      publishedDate: '2024-01-20',
      changeReason: 'Updated rate from 5% to 7%',
      status: 'Current'
    },
    {
      version: 2,
      publishedBy: 'Admin User',
      publishedDate: '2024-01-15',
      changeReason: 'Added new lookup key for customer segment',
      status: 'Historical'
    },
    {
      version: 1,
      publishedBy: 'System Admin',
      publishedDate: '2024-01-01',
      changeReason: 'Initial rule creation',
      status: 'Historical'
    }
  ];

  return (
    <div className="form-section">
      <h2>Versioning & Publishing</h2>
      <p className="section-description">
        Editing an existing rule creates a new version. Historical versions are retained for audit and calculation accuracy.
      </p>

      <div className="version-info-card">
        <h3>Current Version Information</h3>
        <div className="version-grid">
          <div><strong>Version:</strong> {formData.version}</div>
          <div><strong>Status:</strong> {formData.status}</div>
          <div><strong>Last Modified:</strong> {formData.lastModified}</div>
          <div><strong>Modified By:</strong> {formData.modifiedBy}</div>
        </div>
      </div>

      <div className="versioning-rules">
        <h3>Versioning Rules</h3>
        <ul>
          <li>✓ Editing an existing rule creates a new version automatically</li>
          <li>✓ Version number increments with each save</li>
          <li>✓ Calculation engine uses version matching transaction's effective date</li>
          <li>✓ Historical transactions retain old rule versions for accuracy</li>
          <li>✓ All versions are auditable and traceable</li>
        </ul>
      </div>

      <h3>Version History</h3>
      <table className="version-history-table">
        <thead>
          <tr>
            <th>Version</th>
            <th>Published By</th>
            <th>Published Date</th>
            <th>Change Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {versionHistory.map(v => (
            <tr key={v.version}>
              <td><strong>v{v.version}</strong></td>
              <td>{v.publishedBy}</td>
              <td>{v.publishedDate}</td>
              <td>{v.changeReason}</td>
              <td>
                <span className={`status-badge ${v.status.toLowerCase()}`}>
                  {v.status}
                </span>
              </td>
              <td>
                <button className="btn-link">View</button>
                {v.status === 'Historical' && (
                  <button className="btn-link">Restore</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="change-reason-section">
        <h3>Change Reason (Required for new version)</h3>
        <textarea
          placeholder="Describe what changed in this version..."
          rows="3"
          className="change-reason-input"
        />
      </div>
    </div>
  );
};
