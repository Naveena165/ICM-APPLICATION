import React, { useState } from 'react';
import './ImportAssistants.css';

const ImportAssistants = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [importType, setImportType] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sourceFields, setSourceFields] = useState([]);
  const [dataHandlingOption, setDataHandlingOption] = useState('');
  const [fieldMappings, setFieldMappings] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [importMode, setImportMode] = useState('insert');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    { id: 1, name: 'Select Import Type', icon: '📋' },
    { id: 2, name: 'Upload File', icon: '📤' },
    { id: 3, name: 'Import Options', icon: '⚙️' },
    { id: 4, name: 'Field Mapping', icon: '🔗' },
    { id: 5, name: 'Validation', icon: '✓' },
    { id: 6, name: 'Review & Load', icon: '👁' },
    { id: 7, name: 'Summary', icon: '📊' }
  ];

  const importTypes = [
    { value: 'transaction', label: 'Transaction Import', icon: '💳' },
    { value: 'payee', label: 'Payee Import', icon: '👥' },
    { value: 'credit-rule', label: 'Credit Rule Import', icon: '💰' },
    { value: 'classification-rule', label: 'Classification Rule Import', icon: '📋' },
    { value: 'plan', label: 'Plan Import', icon: '📑' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        
        if (lines.length > 0) {
          // Get headers from first line
          const headers = lines[0].split(',').map(h => h.trim().replace(/["\r]/g, ''));
          
          // Count total rows (excluding header)
          const totalRows = lines.length - 1;
          
          // Create columns from actual Excel headers
          const columns = headers.map(header => ({
            name: header,
            dataType: 'String', // Default to String, can be enhanced with type detection
            rowCount: totalRows
          }));

          setUploadedFile({
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            rows: totalRows
          });
          
          setSourceFields(columns);
          
          // Initialize field mappings with blank ICM fields
          const initialMappings = columns.map(col => ({
            sourceField: col.name,
            mappedICMField: '',
            mappingStatus: 'not-mapped',
            dataType: col.dataType,
            rowCount: col.rowCount,
            required: false
          }));
          
          setFieldMappings(initialMappings);
          markStepComplete(2);
        }
      };
      
      reader.readAsText(file);
    }
  };

  const markStepComplete = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return importType !== '';
      case 2:
        return uploadedFile !== null;
      case 3:
        return dataHandlingOption !== '';
      case 4:
        const requiredFields = fieldMappings.filter(f => f.required);
        const mappedRequired = requiredFields.filter(f => f.mappedICMField && f.mappedICMField !== '');
        return requiredFields.length === 0 || mappedRequired.length === requiredFields.length;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      if (currentStep === 1) {
        setMessage({ text: 'Please select an import type.', type: 'error' });
      } else if (currentStep === 2) {
        setMessage({ text: 'Please upload a file.', type: 'error' });
      } else if (currentStep === 3) {
        setMessage({ text: 'Please select a data handling option.', type: 'error' });
      } else if (currentStep === 4) {
        setMessage({ text: 'Please map all required fields before proceeding.', type: 'error' });
      }
      return;
    }

    if (currentStep < steps.length) {
      markStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
      setMessage({ text: '', type: '' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setMessage({ text: '', type: '' });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SelectImportType importType={importType} setImportType={setImportType} importTypes={importTypes} />;
      case 2:
        return <UploadFile uploadedFile={uploadedFile} handleFileUpload={handleFileUpload} />;
      case 3:
        return <ImportOptions dataHandlingOption={dataHandlingOption} setDataHandlingOption={setDataHandlingOption} />;
      case 4:
        return <FieldMapping 
          importType={importType} 
          sourceFields={sourceFields}
          fieldMappings={fieldMappings} 
          setFieldMappings={setFieldMappings} 
          message={message} 
          setMessage={setMessage} 
          uploadedFile={uploadedFile} 
        />;
      case 5:
        return <Validation validationResults={validationResults} setValidationResults={setValidationResults} />;
      case 6:
        return <ReviewAndLoad 
          importMode={importMode} 
          setImportMode={setImportMode} 
          uploadedFile={uploadedFile}
          dataHandlingOption={dataHandlingOption}
          fieldMappings={fieldMappings}
          importType={importType}
        />;
      case 7:
        return <Summary 
          uploadedFile={uploadedFile}
          importType={importType}
          dataHandlingOption={dataHandlingOption}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="import-assistants-container">
      <div className="import-header">
        <h1 className="import-title">Import Assistants</h1>
        <p className="import-subtitle">Upload, validate, and load data into ICM</p>
      </div>

      <div className="import-progress">
        {steps.map((step, index) => (
          <div key={step.id} className="progress-step-wrapper">
            <div className={`progress-step ${currentStep === step.id ? 'active' : ''} ${completedSteps.includes(step.id) ? 'completed' : ''}`}>
              <div className="step-circle">
                {completedSteps.includes(step.id) ? '✓' : step.icon}
              </div>
              <div className="step-label">{step.name}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`progress-line ${completedSteps.includes(step.id) ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>

      {message.text && (
        <div className={`global-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="import-content">
        {renderStepContent()}
      </div>

      {currentStep !== steps.length && (
        <div className="import-navigation">
          <button 
            className="btn-secondary" 
            onClick={handleBack} 
            disabled={currentStep === 1}
          >
            ← Back
          </button>
          <button 
            className="btn-primary" 
            onClick={handleNext}
            disabled={!canProceedToNext()}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

// Step 1: Select Import Type
const SelectImportType = ({ importType, setImportType, importTypes }) => (
  <div className="step-content">
    <h2>Select Import Type</h2>
    <p>Choose the type of data you want to import</p>
    <div className="import-type-selector">
      {importTypes.map(type => (
        <div 
          key={type.value}
          className={`import-type-card ${importType === type.value ? 'selected' : ''}`}
          onClick={() => setImportType(type.value)}
        >
          <div className="type-icon">{type.icon}</div>
          <div className="type-label">{type.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// Step 2: Upload File
const UploadFile = ({ uploadedFile, handleFileUpload }) => (
  <div className="step-content">
    <h2>Upload File</h2>
    <p>Upload your data file (CSV, Excel, JSON, or XML)</p>
    <div className="file-upload-area">
      <input 
        type="file" 
        id="file-upload" 
        accept=".csv,.xlsx,.xls,.json,.xml"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload" className="file-upload-label">
        <div className="upload-icon">📤</div>
        <div className="upload-text">Click to upload or drag and drop</div>
        <div className="upload-formats">CSV, Excel, JSON, XML</div>
      </label>
    </div>
    {uploadedFile && (
      <div className="file-details">
        <h3>File Details</h3>
        <div className="detail-row">
          <span className="detail-label">File Name:</span>
          <span className="detail-value">{uploadedFile.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">File Size:</span>
          <span className="detail-value">{uploadedFile.size}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Total Rows:</span>
          <span className="detail-value">{uploadedFile.rows}</span>
        </div>
      </div>
    )}
  </div>
);

// Step 3: Import Options (NEW STEP - ENHANCED)
const ImportOptions = ({ dataHandlingOption, setDataHandlingOption }) => {
  const options = [
    {
      value: 'insert',
      title: 'Insert Only',
      icon: '➕',
      description: 'Only insert new records. Existing records will be skipped.',
      details: 'Best for: Initial data loads or adding new records only',
      tooltip: 'Records with matching keys will be skipped. No updates will occur.'
    },
    {
      value: 'update',
      title: 'Update Existing Records',
      icon: '🔄',
      description: 'Only update existing records. New records will be skipped.',
      details: 'Best for: Updating existing data without adding new records',
      tooltip: 'Only records with matching keys will be updated. New records ignored.'
    },
    {
      value: 'upsert',
      title: 'Upsert (Insert + Update)',
      icon: '⚡',
      description: 'Insert new records and update existing ones.',
      details: 'Best for: Full synchronization of data',
      tooltip: 'Updates existing records and inserts new ones. Most flexible option.'
    }
  ];

  return (
    <div className="step-content">
      <h2>Import Options</h2>
      <p>Select how you want to handle the data</p>
      
      <div className="data-handling-options">
        {options.map(option => (
          <div
            key={option.value}
            className={`data-option-card ${dataHandlingOption === option.value ? 'selected' : ''}`}
            onClick={() => setDataHandlingOption(option.value)}
            title={option.tooltip}
          >
            <div className="option-header">
              <div className="option-icon">{option.icon}</div>
              <div className="option-title">{option.title}</div>
              <div className="option-radio">
                <input
                  type="radio"
                  name="dataHandling"
                  value={option.value}
                  checked={dataHandlingOption === option.value}
                  onChange={() => setDataHandlingOption(option.value)}
                />
              </div>
            </div>
            <div className="option-description">{option.description}</div>
            <div className="option-details">{option.details}</div>
            <div className="option-tooltip">
              <span className="tooltip-icon">ℹ️</span>
              <span className="tooltip-text">{option.tooltip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Step 4: Field Mapping (COMPLETELY REDESIGNED)
const FieldMapping = ({ importType, sourceFields, fieldMappings, setFieldMappings, message, setMessage, uploadedFile }) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnmapped, setShowOnlyUnmapped] = useState(false);
  const [showOnlyRequired, setShowOnlyRequired] = useState(false); // NEW: Show only required fields
  const [showOnlyErrors, setShowOnlyErrors] = useState(false); // NEW: Show only errors

  // Available ICM fields for mapping (grouped by category as per requirements)
  const availableICMFields = {
    coreFields: [
      { value: 'Payee ID', label: 'Payee ID', required: true, description: 'Unique identifier for the payee', example: 'EMP001', dataType: 'String', group: 'Core Fields' },
      { value: 'First Name', label: 'First Name', required: true, description: 'Payee first name', example: 'John', dataType: 'String', group: 'Core Fields' },
      { value: 'Last Name', label: 'Last Name', required: true, description: 'Payee last name', example: 'Doe', dataType: 'String', group: 'Core Fields' },
      { value: 'Full Name', label: 'Full Name', required: false, description: 'Complete name of payee', example: 'John Doe', dataType: 'String', group: 'Core Fields' },
      { value: 'Email', label: 'Email', required: true, description: 'Email address for communication', example: 'john.doe@company.com', dataType: 'String', group: 'Core Fields' },
      { value: 'Start Date', label: 'Start Date', required: true, description: 'Employment start date', example: '2024-01-15', dataType: 'Date', group: 'Core Fields' },
      { value: 'End Date', label: 'End Date', required: false, description: 'Employment end date', example: '2025-12-31', dataType: 'Date', group: 'Core Fields' },
      { value: 'Hire Date', label: 'Hire Date', required: false, description: 'Original hire date', example: '2020-03-15', dataType: 'Date', group: 'Core Fields' }
    ],
    hrAttributes: [
      { value: 'Department', label: 'Department', required: true, description: 'Department assignment', example: 'Sales', dataType: 'String', group: 'HR Attributes' },
      { value: 'Region', label: 'Region', required: true, description: 'Geographic region', example: 'North America', dataType: 'String', group: 'HR Attributes' },
      { value: 'Role', label: 'Role', required: true, description: 'Organizational role', example: 'Manager', dataType: 'String', group: 'HR Attributes' },
      { value: 'Position', label: 'Position', required: true, description: 'Job position or title', example: 'Sales Manager', dataType: 'String', group: 'HR Attributes' },
      { value: 'HR Grade', label: 'HR Grade', required: false, description: 'HR grade level', example: 'L5', dataType: 'String', group: 'HR Attributes' },
      { value: 'HR Band', label: 'HR Band', required: false, description: 'HR band classification', example: 'Band A', dataType: 'String', group: 'HR Attributes' },
      { value: 'Manager ID', label: 'Manager ID', required: false, description: 'Unique identifier of reporting manager', example: 'MGR001', dataType: 'String', group: 'HR Attributes' },
      { value: 'Status', label: 'Status', required: true, description: 'Employment status', example: 'Active', dataType: 'String', group: 'HR Attributes' }
    ],
    planAttributes: [
      { value: 'Plan ID', label: 'Plan ID', required: false, description: 'Unique plan identifier', example: 'PLAN001', dataType: 'String', group: 'Plan Attributes' },
      { value: 'Plan Assignment', label: 'Plan Assignment', required: false, description: 'Assigned compensation plan', example: 'Sales Plan 2024', dataType: 'String', group: 'Plan Attributes' }
    ],
    customAttributes: [
      { value: 'Custom Attribute 1', label: 'Custom Attribute 1', required: false, description: 'Custom field 1', example: 'Custom Value', dataType: 'String', group: 'Custom Attributes' },
      { value: 'Custom Attribute 2', label: 'Custom Attribute 2', required: false, description: 'Custom field 2', example: 'Custom Value', dataType: 'String', group: 'Custom Attributes' },
      { value: 'Custom Attribute 3', label: 'Custom Attribute 3', required: false, description: 'Custom field 3', example: 'Custom Value', dataType: 'String', group: 'Custom Attributes' }
    ]
  };

  // Flatten all fields for easy lookup
  const allICMFields = [...availableICMFields.coreFields, ...availableICMFields.hrAttributes, ...availableICMFields.planAttributes, ...availableICMFields.customAttributes];

  React.useEffect(() => {
    const templates = localStorage.getItem('importTemplates');
    if (templates) {
      setSavedTemplates(JSON.parse(templates));
    }
  }, []);

  // Normalize field name for comparison
  const normalizeFieldName = (name) => {
    return name
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Synonym dictionary for intelligent mapping
  const synonymDictionary = {
    'Payee ID': ['emp_id', 'employee_id', 'empid', 'staff_id', 'staffid', 'worker_id', 'payee_id', 'id', 'employee id', 'staff id'],
    'First Name': ['fname', 'firstname', 'first_name', 'given_name', 'givenname', 'forename'],
    'Last Name': ['lname', 'lastname', 'last_name', 'surname', 'family_name', 'familyname'],
    'Full Name': ['name', 'fullname', 'full_name', 'employee_name', 'employeename', 'display_name', 'displayname'],
    'Email': ['email_id', 'emailid', 'email_address', 'emailaddress', 'mail', 'e_mail', 'work_email', 'workemail'],
    'Start Date': ['startdate', 'start_date', 'begin_date', 'begindate', 'effective_date', 'effectivedate', 'join_date', 'joindate'],
    'End Date': ['enddate', 'end_date', 'termination_date', 'terminationdate', 'exit_date', 'exitdate', 'leave_date', 'leavedate'],
    'Hire Date': ['hiredate', 'hire_date', 'hired_date', 'hireddate', 'employment_date', 'employmentdate'],
    'Position': ['job_title', 'jobtitle', 'title', 'job_position', 'jobposition', 'designation'],
    'Role': ['job_role', 'jobrole', 'employee_role', 'employeerole', 'function'],
    'Department': ['dept', 'department_name', 'departmentname', 'dept_name', 'deptname', 'division'],
    'Region': ['territory', 'area', 'location', 'geo', 'geography', 'region_name', 'regionname'],
    'Status': ['emp_status', 'empstatus', 'employee_status', 'employeestatus', 'work_status', 'workstatus', 'active_status', 'activestatus'],
    'Manager ID': ['manager', 'mgr_id', 'mgrid', 'supervisor_id', 'supervisorid', 'reports_to', 'reportsto', 'manager_id'],
    'Plan ID': ['planid', 'plan_id', 'comp_plan_id', 'compplanid', 'compensation_plan_id'],
    'Plan Assignment': ['plan', 'assigned_plan', 'assignedplan', 'comp_plan', 'compplan', 'compensation_plan'],
    'HR Grade': ['grade', 'hrgrade', 'hr_grade', 'employee_grade', 'employeegrade', 'level', 'job_grade', 'jobgrade'],
    'HR Band': ['band', 'hrband', 'hr_band', 'pay_band', 'payband', 'salary_band', 'salaryband']
  };

  // Calculate match confidence score
  const calculateMatchConfidence = (sourceField, icmField, matchType) => {
    if (matchType === 'exact') return 1.0;
    if (matchType === 'synonym') return 0.9;
    if (matchType === 'fuzzy') {
      // Simple fuzzy matching based on string similarity
      const source = normalizeFieldName(sourceField);
      const target = normalizeFieldName(icmField);
      const longer = source.length > target.length ? source : target;
      const shorter = source.length > target.length ? target : source;
      const matchLength = shorter.split('').filter((char, i) => longer.includes(char)).length;
      return matchLength / longer.length;
    }
    return 0;
  };

  // Enhanced auto-map with synonym matching
  const handleAutoMap = () => {
    if (!uploadedFile) {
      setMessage({ text: 'Please upload a file first before auto-mapping.', type: 'error' });
      return;
    }

    const updatedMappings = fieldMappings.map(field => {
      const normalizedSource = normalizeFieldName(field.sourceField);
      let bestMatch = '';
      let matchType = '';
      let confidence = 0;
      
      // Step 1: Try exact match
      for (const icmField of allICMFields) {
        const normalizedICM = normalizeFieldName(icmField.value);
        
        if (normalizedSource === normalizedICM) {
          bestMatch = icmField.value;
          matchType = 'exact';
          confidence = 1.0;
          break;
        }
      }

      // Step 2: Try synonym match if no exact match
      if (!bestMatch) {
        for (const [icmFieldName, synonyms] of Object.entries(synonymDictionary)) {
          if (synonyms.some(syn => normalizedSource === syn || normalizedSource.includes(syn) || syn.includes(normalizedSource))) {
            bestMatch = icmFieldName;
            matchType = 'synonym';
            confidence = 0.9;
            break;
          }
        }
      }

      // Step 3: Try fuzzy match if still no match (only for high confidence)
      if (!bestMatch) {
        let highestScore = 0;
        for (const icmField of allICMFields) {
          const score = calculateMatchConfidence(field.sourceField, icmField.value, 'fuzzy');
          if (score > highestScore && score >= 0.7) { // Only accept 70%+ similarity
            highestScore = score;
            bestMatch = icmField.value;
            matchType = 'fuzzy';
            confidence = score;
          }
        }
      }

      const matchedField = allICMFields.find(f => f.value === bestMatch);
      
      return {
        ...field,
        mappedICMField: bestMatch,
        mappingStatus: bestMatch ? 'mapped' : 'not-mapped',
        required: matchedField ? matchedField.required : false,
        validationError: '',
        matchConfidence: confidence,
        matchType: matchType
      };
    });

    setFieldMappings(updatedMappings);
    
    const mappedCount = updatedMappings.filter(f => f.mappedICMField).length;
    const lowConfidenceCount = updatedMappings.filter(f => f.matchConfidence > 0 && f.matchConfidence < 0.9).length;
    
    let messageText = `Auto-mapped ${mappedCount} of ${fieldMappings.length} fields successfully.`;
    if (lowConfidenceCount > 0) {
      messageText += ` ${lowConfidenceCount} field(s) have low confidence - please review.`;
    }
    
    setMessage({ text: messageText, type: 'success' });
  };

  // Save template
  const handleSaveTemplate = () => {
    setShowSaveModal(true);
  };

  const confirmSaveTemplate = () => {
    if (!templateName.trim()) {
      setMessage({ text: 'Please enter a template name.', type: 'error' });
      return;
    }

    const newTemplate = {
      id: Date.now(),
      name: templateName,
      mappings: fieldMappings,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin User', // In production, get from auth context
      lastUsed: new Date().toISOString(),
      importType: importType,
      usageCount: 0
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('importTemplates', JSON.stringify(updatedTemplates));

    setMessage({ text: 'Template saved successfully.', type: 'success' });
    setShowSaveModal(false);
    setTemplateName('');
  };

  // Load template
  const handleLoadTemplate = () => {
    const templates = localStorage.getItem('importTemplates');
    if (templates) {
      setSavedTemplates(JSON.parse(templates));
    }
    setShowTemplateModal(true);
  };

  const applyTemplate = (template) => {
    // Update template usage
    const updatedTemplate = {
      ...template,
      lastUsed: new Date().toISOString(),
      usageCount: (template.usageCount || 0) + 1
    };
    
    const updatedTemplates = savedTemplates.map(t => 
      t.id === template.id ? updatedTemplate : t
    );
    
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('importTemplates', JSON.stringify(updatedTemplates));
    localStorage.setItem('lastUsedTemplate', template.name);
    
    setFieldMappings(template.mappings);
    setShowTemplateModal(false);
    setMessage({ text: 'Template loaded successfully.', type: 'success' });
  };

  const deleteTemplate = (templateId) => {
    const updatedTemplates = savedTemplates.filter(t => t.id !== templateId);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('importTemplates', JSON.stringify(updatedTemplates));
    setMessage({ text: 'Template deleted successfully.', type: 'success' });
  };

  // Handle manual field mapping with validation
  const handleManualMapping = (index, newValue) => {
    const updatedMappings = [...fieldMappings];
    const sourceField = updatedMappings[index];
    
    // Check for duplicate mapping
    if (newValue) {
      const isDuplicate = fieldMappings.some((f, i) => 
        i !== index && f.mappedICMField === newValue
      );
      
      if (isDuplicate) {
        setMessage({ 
          text: `Warning: "${newValue}" is already mapped to another source field.`, 
          type: 'warning' 
        });
        return; // Prevent duplicate mapping
      }
      
      // Data type validation
      const targetField = allICMFields.find(f => f.value === newValue);
      if (targetField) {
        const sourceType = sourceField.dataType.toLowerCase();
        const targetType = targetField.dataType.toLowerCase();
        
        // Check type compatibility
        if (sourceType === 'date' && targetType !== 'date') {
          updatedMappings[index].validationError = 'Invalid mapping: Date field can only map to Date field';
          updatedMappings[index].mappingStatus = 'invalid';
          setFieldMappings(updatedMappings);
          setMessage({ 
            text: 'Invalid mapping: Source field type does not match target field type', 
            type: 'error' 
          });
          return;
        }
        
        // Update mapping
        updatedMappings[index].mappedICMField = newValue;
        updatedMappings[index].mappingStatus = 'mapped';
        updatedMappings[index].required = targetField.required;
        updatedMappings[index].validationError = '';
      }
    } else {
      // Clear mapping
      updatedMappings[index].mappedICMField = '';
      updatedMappings[index].mappingStatus = 'not-mapped';
      updatedMappings[index].required = false;
      updatedMappings[index].validationError = '';
    }
    
    setFieldMappings(updatedMappings);
  };

  // Clear individual mapping
  const handleClearMapping = (index) => {
    const updatedMappings = [...fieldMappings];
    updatedMappings[index].mappedICMField = '';
    updatedMappings[index].mappingStatus = 'not-mapped';
    updatedMappings[index].required = false;
    updatedMappings[index].validationError = '';
    setFieldMappings(updatedMappings);
  };

  // Get available fields for dropdown (exclude already mapped)
  const getAvailableFieldsForDropdown = (currentIndex) => {
    const mappedFields = fieldMappings
      .map((f, i) => i !== currentIndex ? f.mappedICMField : null)
      .filter(f => f);
    
    return {
      coreFields: availableICMFields.coreFields.filter(f => !mappedFields.includes(f.value)),
      hrAttributes: availableICMFields.hrAttributes.filter(f => !mappedFields.includes(f.value)),
      planAttributes: availableICMFields.planAttributes.filter(f => !mappedFields.includes(f.value)),
      customAttributes: availableICMFields.customAttributes.filter(f => !mappedFields.includes(f.value))
    };
  };

  // NEW: Generate suggestions for unmapped fields
  const generateSuggestions = (sourceFieldName, currentIndex) => {
    const normalizedSource = normalizeFieldName(sourceFieldName);
    const mappedFields = fieldMappings
      .map((f, i) => i !== currentIndex ? f.mappedICMField : null)
      .filter(f => f);
    
    // Calculate scores for all available ICM fields
    const scoredFields = allICMFields
      .filter(f => !mappedFields.includes(f.value))
      .map(icmField => {
        const normalizedICM = normalizeFieldName(icmField.value);
        let score = 0;
        let matchType = '';
        
        // Exact match
        if (normalizedSource === normalizedICM) {
          score = 1.0;
          matchType = 'exact';
        }
        // Synonym match
        else if (synonymDictionary[icmField.value]) {
          const synonyms = synonymDictionary[icmField.value];
          if (synonyms.some(syn => normalizedSource === syn || normalizedSource.includes(syn) || syn.includes(normalizedSource))) {
            score = 0.9;
            matchType = 'synonym';
          }
        }
        
        // Fuzzy match if no exact/synonym match
        if (score === 0) {
          const source = normalizedSource;
          const target = normalizedICM;
          const longer = source.length > target.length ? source : target;
          const shorter = source.length > target.length ? target : source;
          const matchLength = shorter.split('').filter((char, i) => longer.includes(char)).length;
          score = matchLength / longer.length;
          matchType = 'fuzzy';
        }
        
        return {
          ...icmField,
          score,
          matchType
        };
      })
      .filter(f => f.score >= 0.5) // Only show suggestions with 50%+ confidence
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3 suggestions
    
    return scoredFields;
  };

  // NEW: Handle suggestion click
  const handleSuggestionClick = (index, suggestedValue) => {
    handleManualMapping(index, suggestedValue);
  };

  // NEW: State for showing dropdown per row
  const [showDropdownForRow, setShowDropdownForRow] = React.useState({});
  const [dropdownSearchTerm, setDropdownSearchTerm] = React.useState({});

  const toggleDropdown = (index) => {
    setShowDropdownForRow(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    // Clear search when closing
    if (showDropdownForRow[index]) {
      setDropdownSearchTerm(prev => ({
        ...prev,
        [index]: ''
      }));
    }
  };

  // NEW: Filter dropdown options based on search term
  const getFilteredDropdownOptions = (availableFields, searchTerm) => {
    if (!searchTerm) return availableFields;
    
    const search = searchTerm.toLowerCase();
    return {
      coreFields: availableFields.coreFields.filter(f => 
        f.label.toLowerCase().includes(search) || 
        f.description.toLowerCase().includes(search)
      ),
      hrAttributes: availableFields.hrAttributes.filter(f => 
        f.label.toLowerCase().includes(search) || 
        f.description.toLowerCase().includes(search)
      ),
      planAttributes: availableFields.planAttributes.filter(f => 
        f.label.toLowerCase().includes(search) || 
        f.description.toLowerCase().includes(search)
      ),
      customAttributes: availableFields.customAttributes.filter(f => 
        f.label.toLowerCase().includes(search) || 
        f.description.toLowerCase().includes(search)
      )
    };
  };

  // Calculate mapping statistics
  const totalFields = fieldMappings.length;
  const mappedFields = fieldMappings.filter(f => f.mappedICMField && f.mappedICMField !== '').length;
  const requiredFields = allICMFields.filter(f => f.required).length;
  const mappedRequiredFields = fieldMappings.filter(f => f.required && f.mappedICMField && f.mappedICMField !== '').length;
  const unmappedRequiredFields = allICMFields.filter(f => f.required && !fieldMappings.some(m => m.mappedICMField === f.value)).map(f => f.value);

  // Scroll to specific field row
  const scrollToField = (fieldValue) => {
    const fieldIndex = fieldMappings.findIndex(f => {
      const icmField = allICMFields.find(icm => icm.value === fieldValue);
      return !f.mappedICMField && icmField && icmField.required;
    });
    
    if (fieldIndex !== -1) {
      const tableRows = document.querySelectorAll('.mapping-table tbody tr');
      if (tableRows[fieldIndex]) {
        tableRows[fieldIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        tableRows[fieldIndex].classList.add('highlight-row');
        setTimeout(() => {
          tableRows[fieldIndex].classList.remove('highlight-row');
        }, 2000);
      }
    }
  };

  // Filter mappings based on search and filters
  let filteredMappings = fieldMappings.filter(field =>
    field.sourceField.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (field.mappedICMField && field.mappedICMField.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Apply "show only unmapped" filter
  if (showOnlyUnmapped) {
    filteredMappings = filteredMappings.filter(f => !f.mappedICMField || f.mappedICMField === '');
  }

  // Apply "show only required" filter
  if (showOnlyRequired) {
    filteredMappings = filteredMappings.filter(f => f.required && (!f.mappedICMField || f.mappedICMField === ''));
  }

  // Apply "show only errors" filter
  if (showOnlyErrors) {
    filteredMappings = filteredMappings.filter(f => f.validationError || (f.required && !f.mappedICMField));
  }

  return (
    <div className="step-content field-mapping-step">
      <h2>Field Mapping</h2>
      <p>Map source fields to ICM fields</p>
      
      {/* Persistent Warning Banner */}
      {unmappedRequiredFields.length > 0 && (
        <div className="persistent-warning-banner">
          <div className="banner-icon">⚠️</div>
          <div className="banner-content">
            <div className="banner-title">Missing Required Fields</div>
            <div className="banner-message">
              The following required ICM fields must be mapped before you can proceed:
            </div>
            <div className="required-fields-list">
              {unmappedRequiredFields.map((field, idx) => (
                <button
                  key={idx}
                  className="required-field-chip"
                  onClick={() => scrollToField(field)}
                  title={`Click to scroll to ${field}`}
                >
                  {field}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Mapping Summary */}
      <div className="mapping-summary">
        <div className="summary-stat">
          <span className="stat-value">{mappedFields}</span>
          <span className="stat-label">of {totalFields} fields mapped</span>
        </div>
        <div className="summary-stat">
          <span className="stat-value">{mappedRequiredFields}</span>
          <span className="stat-label">of {requiredFields} required fields mapped</span>
        </div>
      </div>

      {/* Mapping Actions */}
      <div className="mapping-actions">
        <button className="btn-secondary" onClick={handleAutoMap}>
          🔗 Auto-Map Fields
        </button>
        <button className="btn-secondary" onClick={handleLoadTemplate}>
          📂 Load Template
        </button>
        <button className="btn-secondary" onClick={handleSaveTemplate}>
          💾 Save Template
        </button>
        <div className="filter-group">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyUnmapped}
              onChange={(e) => setShowOnlyUnmapped(e.target.checked)}
            />
            <span>Show only unmapped</span>
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyRequired}
              onChange={(e) => setShowOnlyRequired(e.target.checked)}
            />
            <span>Show only required</span>
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyErrors}
              onChange={(e) => setShowOnlyErrors(e.target.checked)}
            />
            <span>Show errors only</span>
          </label>
        </div>
        <input
          type="text"
          className="mapping-search"
          placeholder="🔍 Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mapping Table */}
      <div className="mapping-table-container">
        <table className="mapping-table">
          <thead>
            <tr>
              <th>Source Field</th>
              <th>Mapping Status</th>
              <th>Mapped ICM Field</th>
              <th>Required</th>
              <th>Data Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMappings.map((field, index) => {
              const actualIndex = fieldMappings.indexOf(field);
              const availableFields = getAvailableFieldsForDropdown(actualIndex);
              
              return (
                <tr key={actualIndex} className={`
                  ${field.required && !field.mappedICMField ? 'unmapped-required' : ''}
                  ${field.validationError ? 'validation-error-row' : ''}
                `}>
                  <td>
                    <div className="source-field-cell">
                      <div className="field-name">{field.sourceField}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`mapping-status-badge ${field.mappingStatus}`}>
                      {field.mappingStatus === 'mapped' && '✅ Mapped'}
                      {field.mappingStatus === 'not-mapped' && '⚠️ Not Mapped'}
                      {field.mappingStatus === 'invalid' && '❌ Invalid'}
                    </span>
                    {field.matchConfidence && field.matchConfidence < 0.9 && field.matchConfidence > 0 && (
                      <div className="confidence-indicator low-confidence">
                        🔍 Low confidence ({Math.round(field.matchConfidence * 100)}%) - Please review
                      </div>
                    )}
                    {field.required && !field.mappedICMField && (
                      <div className="inline-warning">
                        ⚠️ This field is mandatory to proceed
                      </div>
                    )}
                    {field.validationError && (
                      <div className="inline-error">
                        ❌ {field.validationError}
                      </div>
                    )}
                  </td>
                  <td>
                    {/* Show mapped field or suggestions */}
                    {field.mappedICMField ? (
                      // Already mapped - show the mapped value
                      <div className="mapped-field-display">
                        {field.mappedICMField}
                      </div>
                    ) : (
                      // Not mapped - show suggestions
                      <div className="suggestions-container">
                        {(() => {
                          const suggestions = generateSuggestions(field.sourceField, actualIndex);
                          
                          return suggestions.length > 0 ? (
                            <>
                              <div className="suggestions-label">Suggested:</div>
                              <div className="suggestions-chips">
                                {suggestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    className={`suggestion-chip ${suggestion.required ? 'required' : ''}`}
                                    onClick={() => handleSuggestionClick(actualIndex, suggestion.value)}
                                    title={`${suggestion.description} (${Math.round(suggestion.score * 100)}% match)`}
                                  >
                                    {suggestion.label}
                                    {suggestion.required && ' ⭐'}
                                    <span className="confidence-badge">{Math.round(suggestion.score * 100)}%</span>
                                  </button>
                                ))}
                              </div>
                              <button
                                className="more-options-btn"
                                onClick={() => toggleDropdown(actualIndex)}
                              >
                                {showDropdownForRow[actualIndex] ? '▲ Hide options' : '▼ More options'}
                              </button>
                            </>
                          ) : (
                            <button
                              className="more-options-btn"
                              onClick={() => toggleDropdown(actualIndex)}
                            >
                              ▼ Select field
                            </button>
                          );
                        })()}
                        
                        {/* Searchable Dropdown - only shown when toggled */}
                        {showDropdownForRow[actualIndex] && (
                          <div className="searchable-dropdown-container">
                            <input
                              type="text"
                              className="dropdown-search-input"
                              placeholder="🔍 Search ICM fields..."
                              value={dropdownSearchTerm[actualIndex] || ''}
                              onChange={(e) => {
                                setDropdownSearchTerm(prev => ({
                                  ...prev,
                                  [actualIndex]: e.target.value
                                }));
                              }}
                              autoFocus
                            />
                            <div className="dropdown-options-list">
                              {(() => {
                                const filteredFields = getFilteredDropdownOptions(availableFields, dropdownSearchTerm[actualIndex] || '');
                                const hasResults = filteredFields.coreFields.length > 0 || 
                                                   filteredFields.hrAttributes.length > 0 || 
                                                   filteredFields.planAttributes.length > 0 || 
                                                   filteredFields.customAttributes.length > 0;
                                
                                if (!hasResults) {
                                  return (
                                    <div className="no-results">
                                      No matching fields found
                                    </div>
                                  );
                                }
                                
                                return (
                                  <>
                                    {filteredFields.coreFields.length > 0 && (
                                      <div className="dropdown-group">
                                        <div className="dropdown-group-label">Core Fields</div>
                                        {filteredFields.coreFields.map(icmField => (
                                          <div
                                            key={icmField.value}
                                            className={`dropdown-option ${icmField.required ? 'required' : ''}`}
                                            onClick={() => {
                                              handleManualMapping(actualIndex, icmField.value);
                                              toggleDropdown(actualIndex);
                                            }}
                                            title={icmField.description}
                                          >
                                            <div className="option-main">
                                              <span className="option-label">
                                                {icmField.label}
                                                {icmField.required && <span className="required-star">⭐</span>}
                                              </span>
                                              <span className="option-type">{icmField.dataType}</span>
                                            </div>
                                            {icmField.description && (
                                              <div className="option-description">{icmField.description}</div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {filteredFields.hrAttributes.length > 0 && (
                                      <div className="dropdown-group">
                                        <div className="dropdown-group-label">HR Attributes</div>
                                        {filteredFields.hrAttributes.map(icmField => (
                                          <div
                                            key={icmField.value}
                                            className={`dropdown-option ${icmField.required ? 'required' : ''}`}
                                            onClick={() => {
                                              handleManualMapping(actualIndex, icmField.value);
                                              toggleDropdown(actualIndex);
                                            }}
                                            title={icmField.description}
                                          >
                                            <div className="option-main">
                                              <span className="option-label">
                                                {icmField.label}
                                                {icmField.required && <span className="required-star">⭐</span>}
                                              </span>
                                              <span className="option-type">{icmField.dataType}</span>
                                            </div>
                                            {icmField.description && (
                                              <div className="option-description">{icmField.description}</div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {filteredFields.planAttributes.length > 0 && (
                                      <div className="dropdown-group">
                                        <div className="dropdown-group-label">Plan Attributes</div>
                                        {filteredFields.planAttributes.map(icmField => (
                                          <div
                                            key={icmField.value}
                                            className={`dropdown-option ${icmField.required ? 'required' : ''}`}
                                            onClick={() => {
                                              handleManualMapping(actualIndex, icmField.value);
                                              toggleDropdown(actualIndex);
                                            }}
                                            title={icmField.description}
                                          >
                                            <div className="option-main">
                                              <span className="option-label">
                                                {icmField.label}
                                                {icmField.required && <span className="required-star">⭐</span>}
                                              </span>
                                              <span className="option-type">{icmField.dataType}</span>
                                            </div>
                                            {icmField.description && (
                                              <div className="option-description">{icmField.description}</div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {filteredFields.customAttributes.length > 0 && (
                                      <div className="dropdown-group">
                                        <div className="dropdown-group-label">Custom Attributes</div>
                                        {filteredFields.customAttributes.map(icmField => (
                                          <div
                                            key={icmField.value}
                                            className={`dropdown-option ${icmField.required ? 'required' : ''}`}
                                            onClick={() => {
                                              handleManualMapping(actualIndex, icmField.value);
                                              toggleDropdown(actualIndex);
                                            }}
                                            title={icmField.description}
                                          >
                                            <div className="option-main">
                                              <span className="option-label">
                                                {icmField.label}
                                                {icmField.required && <span className="required-star">⭐</span>}
                                              </span>
                                              <span className="option-type">{icmField.dataType}</span>
                                            </div>
                                            {icmField.description && (
                                              <div className="option-description">{icmField.description}</div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`required-badge ${field.required ? 'yes' : 'no'}`}>
                      {field.required ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className="data-type-badge">{field.dataType}</span>
                  </td>
                  <td>
                    {field.mappedICMField && (
                      <button 
                        className="clear-mapping-btn"
                        onClick={() => handleClearMapping(actualIndex)}
                        title="Clear mapping"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Validation Summary */}
      {(mappedFields > 0 || unmappedRequiredFields.length > 0) && (
        <div className="validation-summary-section">
          <h3>Mapping Summary</h3>
          <div className="summary-grid">
            <div className="summary-item success">
              <span className="summary-icon">✔</span>
              <span className="summary-text">{mappedFields} fields mapped</span>
            </div>
            {(totalFields - mappedFields - unmappedRequiredFields.length) > 0 && (
              <div className="summary-item warning">
                <span className="summary-icon">⚠</span>
                <span className="summary-text">{totalFields - mappedFields - unmappedRequiredFields.length} optional fields unmapped</span>
              </div>
            )}
            {unmappedRequiredFields.length > 0 && (
              <div className="summary-item error">
                <span className="summary-icon">❌</span>
                <span className="summary-text">{unmappedRequiredFields.length} mandatory fields missing</span>
                <div className="missing-fields-list">
                  {unmappedRequiredFields.map((field, idx) => (
                    <span key={idx} className="missing-field-tag">{field}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Load Template Modal */}
      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Load Template</h3>
            {savedTemplates.length === 0 ? (
              <p>No saved templates found.</p>
            ) : (
              <div className="template-list">
                {savedTemplates.map(template => (
                  <div key={template.id} className="template-item">
                    <div className="template-info">
                      <div className="template-name">{template.name}</div>
                      <div className="template-metadata">
                        <div className="template-meta-item">
                          <span className="template-meta-label">Created:</span> {new Date(template.createdAt).toLocaleDateString()}
                        </div>
                        {template.createdBy && (
                          <div className="template-meta-item">
                            <span className="template-meta-label">Created by:</span> {template.createdBy}
                          </div>
                        )}
                        {template.lastUsed && (
                          <div className="template-meta-item">
                            <span className="template-meta-label">Last used:</span> {new Date(template.lastUsed).toLocaleDateString()}
                          </div>
                        )}
                        {template.importType && (
                          <div className="template-meta-item">
                            <span className="template-meta-label">Import type:</span> {template.importType}
                          </div>
                        )}
                        {template.usageCount !== undefined && (
                          <div className="template-meta-item">
                            <span className="template-meta-label">Used:</span> {template.usageCount} time(s)
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="template-actions">
                      <button 
                        className="btn-primary btn-small"
                        onClick={() => applyTemplate(template)}
                      >
                        Load
                      </button>
                      <button 
                        className="btn-secondary btn-small"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="btn-secondary" onClick={() => setShowTemplateModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Save Template</h3>
            <p>Enter a name for this mapping template:</p>
            <input
              type="text"
              className="template-name-input"
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && confirmSaveTemplate()}
            />
            <div className="modal-buttons">
              <button className="btn-primary" onClick={confirmSaveTemplate}>
                Save
              </button>
              <button className="btn-secondary" onClick={() => {
                setShowSaveModal(false);
                setTemplateName('');
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 5: Validation (ENHANCED)
const Validation = ({ validationResults, setValidationResults }) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  
  // Mock comprehensive validation results
  const mockResults = {
    total: 500,
    valid: 480,
    errors: 12,
    warnings: 8,
    fatalErrors: 5,
    nonFatalErrors: 7,
    validationTypes: {
      mandatory: { passed: 495, failed: 5 },
      dataType: { passed: 498, failed: 2 },
      format: { passed: 497, failed: 3 },
      lookup: { passed: 499, failed: 1 },
      uniqueness: { passed: 499, failed: 1 },
      dateOverlap: { passed: 500, failed: 0 },
      businessRules: { passed: 492, failed: 8 }
    },
    errorDetails: [
      { row: 45, field: 'Email', originalValue: 'invalid-email', errorType: 'Format', severity: 'Fatal', message: 'Invalid email format' },
      { row: 78, field: 'Payee ID', originalValue: '', errorType: 'Mandatory', severity: 'Fatal', message: 'Required field is empty' },
      { row: 123, field: 'Start Date', originalValue: '2024-13-45', errorType: 'Format', severity: 'Fatal', message: 'Invalid date format' },
      { row: 156, field: 'Department', originalValue: 'DEPT999', errorType: 'Lookup', severity: 'Fatal', message: 'Department not found in system' },
      { row: 234, field: 'Payee ID', originalValue: 'EMP001', errorType: 'Uniqueness', severity: 'Fatal', message: 'Duplicate Payee ID found' },
      { row: 267, field: 'Region', originalValue: 'Unknown', errorType: 'Lookup', severity: 'Non-Fatal', message: 'Region not recognized, will use default' },
      { row: 289, field: 'HR Grade', originalValue: 'L99', errorType: 'Business Rule', severity: 'Non-Fatal', message: 'Grade level outside normal range' },
      { row: 345, field: 'End Date', originalValue: '2023-01-01', errorType: 'Business Rule', severity: 'Non-Fatal', message: 'End date before start date' }
    ]
  };

  const downloadErrorCSV = () => {
    const csvHeader = 'Row Number,Field,Original Value,Error Type,Severity,Error Message\n';
    const csvRows = mockResults.errorDetails.map(error => 
      `${error.row},"${error.field}","${error.originalValue}","${error.errorType}","${error.severity}","${error.message}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `validation_errors_${new Date().getTime()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="step-content">
      <h2>Validation</h2>
      <p>Comprehensive data validation with detailed error reporting</p>
      
      {/* Summary Cards */}
      <div className="validation-summary">
        <div className="validation-card">
          <div className="card-icon">📊</div>
          <div className="card-value">{mockResults.total}</div>
          <div className="card-label">Total Records</div>
        </div>
        <div className="validation-card success">
          <div className="card-icon">✓</div>
          <div className="card-value">{mockResults.valid}</div>
          <div className="card-label">Valid</div>
        </div>
        <div className="validation-card error">
          <div className="card-icon">✕</div>
          <div className="card-value">{mockResults.fatalErrors}</div>
          <div className="card-label">Fatal Errors</div>
        </div>
        <div className="validation-card warning">
          <div className="card-icon">⚠</div>
          <div className="card-value">{mockResults.nonFatalErrors}</div>
          <div className="card-label">Non-Fatal</div>
        </div>
      </div>

      {/* Validation Types Breakdown */}
      <div className="validation-breakdown">
        <h3>Validation Types</h3>
        <div className="validation-types-grid">
          {Object.entries(mockResults.validationTypes).map(([type, results]) => (
            <div key={type} className="validation-type-item">
              <div className="validation-type-name">{type.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="validation-type-stats">
                <span className="passed">✓ {results.passed}</span>
                {results.failed > 0 && <span className="failed">✕ {results.failed}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Details */}
      {mockResults.errorDetails.length > 0 && (
        <div className="error-details-section">
          <div className="error-details-header">
            <h3>Error Details ({mockResults.errorDetails.length})</h3>
            <button 
              className="btn-secondary btn-small"
              onClick={() => setShowErrorDetails(!showErrorDetails)}
            >
              {showErrorDetails ? '▲ Hide Details' : '▼ Show Details'}
            </button>
          </div>
          
          {showErrorDetails && (
            <div className="error-details-table-container">
              <table className="error-details-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Field</th>
                    <th>Original Value</th>
                    <th>Error Type</th>
                    <th>Severity</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {mockResults.errorDetails.map((error, idx) => (
                    <tr key={idx} className={error.severity === 'Fatal' ? 'fatal-error' : 'non-fatal-error'}>
                      <td>{error.row}</td>
                      <td><strong>{error.field}</strong></td>
                      <td><code>{error.originalValue || '(empty)'}</code></td>
                      <td><span className="error-type-badge">{error.errorType}</span></td>
                      <td>
                        <span className={`severity-badge ${error.severity.toLowerCase().replace('-', '')}`}>
                          {error.severity}
                        </span>
                      </td>
                      <td>{error.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Download Error File */}
      <div className="validation-actions">
        <button className="btn-secondary" onClick={downloadErrorCSV}>
          📥 Download Error CSV
        </button>
        {mockResults.fatalErrors === 0 && (
          <div className="validation-success-message">
            ✓ No fatal errors found. You can proceed to load the data.
          </div>
        )}
        {mockResults.fatalErrors > 0 && (
          <div className="validation-error-message">
            ⚠️ {mockResults.fatalErrors} fatal error(s) must be fixed before loading data.
          </div>
        )}
      </div>
    </div>
  );
};

// Step 6: Review and Load (ENHANCED)
const ReviewAndLoad = ({ importMode, setImportMode, uploadedFile, dataHandlingOption, fieldMappings, importType }) => {
  const [showPreview, setShowPreview] = useState(false);
  
  // Calculate record counts
  const totalRecords = uploadedFile?.rows || 0;
  const validRecords = 480; // From validation
  const invalidRecords = 12; // From validation
  const mappedFieldsCount = fieldMappings.filter(f => f.mappedICMField).length;
  
  // Mock preview data (first 5 rows transformed)
  const previewData = [
    { 'Payee ID': 'EMP001', 'First Name': 'John', 'Last Name': 'Doe', 'Email': 'john.doe@example.com', 'Department': 'Sales' },
    { 'Payee ID': 'EMP002', 'First Name': 'Jane', 'Last Name': 'Smith', 'Email': 'jane.smith@example.com', 'Department': 'Marketing' },
    { 'Payee ID': 'EMP003', 'First Name': 'Bob', 'Last Name': 'Johnson', 'Email': 'bob.j@example.com', 'Department': 'Engineering' },
    { 'Payee ID': 'EMP004', 'First Name': 'Alice', 'Last Name': 'Williams', 'Email': 'alice.w@example.com', 'Department': 'HR' },
    { 'Payee ID': 'EMP005', 'First Name': 'Charlie', 'Last Name': 'Brown', 'Email': 'charlie.b@example.com', 'Department': 'Finance' }
  ];

  const savedTemplate = localStorage.getItem('lastUsedTemplate') || 'Payee Import Template';

  return (
    <div className="step-content">
      <h2>Review & Load</h2>
      <p>Review your import settings and preview transformed data before loading</p>
      
      {/* Record Counts */}
      <div className="record-counts">
        <div className="count-card">
          <div className="count-icon">📊</div>
          <div className="count-value">{totalRecords}</div>
          <div className="count-label">Total Records</div>
        </div>
        <div className="count-card success">
          <div className="count-icon">✓</div>
          <div className="count-value">{validRecords}</div>
          <div className="count-label">Valid Records</div>
        </div>
        <div className="count-card error">
          <div className="count-icon">✕</div>
          <div className="count-value">{invalidRecords}</div>
          <div className="count-label">Invalid Records</div>
        </div>
      </div>

      {/* Import Configuration Summary */}
      <div className="review-summary">
        <h3>Import Configuration</h3>
        <div className="review-item">
          <span className="review-label">Import Type:</span>
          <span className="review-value">{importType || 'N/A'}</span>
        </div>
        <div className="review-item">
          <span className="review-label">File Name:</span>
          <span className="review-value">{uploadedFile?.name || 'N/A'}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Total Rows:</span>
          <span className="review-value">{totalRecords}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Data Handling Option:</span>
          <span className="review-value">{dataHandlingOption || 'N/A'}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Mapped Fields:</span>
          <span className="review-value">{mappedFieldsCount} fields</span>
        </div>
        <div className="review-item">
          <span className="review-label">Mapping Template:</span>
          <span className="review-value">{savedTemplate}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Import Mode:</span>
          <span className="review-value">{importMode}</span>
        </div>
      </div>

      {/* Data Preview */}
      <div className="data-preview-section">
        <div className="preview-header">
          <h3>Data Preview (Transformed)</h3>
          <button 
            className="btn-secondary btn-small"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? '▲ Hide Preview' : '▼ Show Preview'}
          </button>
        </div>
        
        {showPreview && (
          <div className="preview-table-container">
            <p className="preview-note">Showing first 5 rows of transformed data</p>
            <table className="preview-table">
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((value, vidx) => (
                      <td key={vidx}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Final Import Mode Selection */}
      <div className="final-import-mode">
        <h3>Confirm Import Mode</h3>
        <div className="import-mode-selector">
          <label className={`mode-option ${importMode === 'insert' ? 'selected' : ''}`}>
            <input 
              type="radio" 
              name="importMode" 
              value="insert"
              checked={importMode === 'insert'}
              onChange={(e) => setImportMode(e.target.value)}
            />
            <span>Insert Only</span>
          </label>
          <label className={`mode-option ${importMode === 'update' ? 'selected' : ''}`}>
            <input 
              type="radio" 
              name="importMode" 
              value="update"
              checked={importMode === 'update'}
              onChange={(e) => setImportMode(e.target.value)}
            />
            <span>Update Existing</span>
          </label>
          <label className={`mode-option ${importMode === 'upsert' ? 'selected' : ''}`}>
            <input 
              type="radio" 
              name="importMode" 
              value="upsert"
              checked={importMode === 'upsert'}
              onChange={(e) => setImportMode(e.target.value)}
            />
            <span>Upsert</span>
          </label>
        </div>
      </div>
    </div>
  );
};

// Step 7: Summary (ENHANCED)
const Summary = ({ uploadedFile, importType, dataHandlingOption }) => {
  const mockSummary = {
    totalProcessed: 500,
    loaded: 480,
    failed: 12,
    warnings: 8,
    user: 'Admin User',
    timestamp: new Date().toLocaleString(),
    fileName: uploadedFile?.name || 'payees_import.csv',
    importType: importType || 'Payee Import',
    importMode: dataHandlingOption || 'upsert',
    mappingTemplate: localStorage.getItem('lastUsedTemplate') || 'Payee Import Template',
    errorFileReference: `errors_${new Date().getTime()}.csv`,
    duration: '2.3 seconds'
  };

  const downloadErrorFile = () => {
    // Mock error file download
    const errorContent = 'Row,Field,Value,Error\n45,Email,invalid-email,Invalid format\n78,Payee ID,,Required field missing';
    const blob = new Blob([errorContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = mockSummary.errorFileReference;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadFullReport = () => {
    // Mock full report download
    const reportContent = `Import Summary Report
Generated: ${mockSummary.timestamp}
User: ${mockSummary.user}
File: ${mockSummary.fileName}
Import Type: ${mockSummary.importType}
Import Mode: ${mockSummary.importMode}
Mapping Template: ${mockSummary.mappingTemplate}

Results:
- Total Processed: ${mockSummary.totalProcessed}
- Successfully Loaded: ${mockSummary.loaded}
- Failed: ${mockSummary.failed}
- Warnings: ${mockSummary.warnings}
- Duration: ${mockSummary.duration}

Error File: ${mockSummary.errorFileReference}
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `import_report_${new Date().getTime()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Save audit log to localStorage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const auditLog = {
      id: Date.now(),
      user: mockSummary.user,
      timestamp: mockSummary.timestamp,
      fileName: mockSummary.fileName,
      importType: mockSummary.importType,
      importMode: mockSummary.importMode,
      mappingTemplate: mockSummary.mappingTemplate,
      totalProcessed: mockSummary.totalProcessed,
      successCount: mockSummary.loaded,
      failureCount: mockSummary.failed,
      warningCount: mockSummary.warnings,
      errorFileReference: mockSummary.errorFileReference,
      duration: mockSummary.duration
    };
    
    const existingLogs = JSON.parse(localStorage.getItem('importAuditLogs') || '[]');
    existingLogs.push(auditLog);
    localStorage.setItem('importAuditLogs', JSON.stringify(existingLogs));
  }, []);

  return (
    <div className="step-content">
      <h2>Import Summary</h2>
      <p>Import completed successfully</p>
      
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">Total Records Processed</div>
          <div className="summary-value">{mockSummary.totalProcessed}</div>
        </div>
        <div className="summary-card success">
          <div className="summary-label">Records Loaded</div>
          <div className="summary-value">{mockSummary.loaded}</div>
        </div>
        <div className="summary-card error">
          <div className="summary-label">Records Failed</div>
          <div className="summary-value">{mockSummary.failed}</div>
        </div>
        <div className="summary-card warning">
          <div className="summary-label">Warnings</div>
          <div className="summary-value">{mockSummary.warnings}</div>
        </div>
      </div>
      
      {/* Comprehensive Audit Log */}
      <div className="audit-log">
        <h3>Comprehensive Audit Log</h3>
        <div className="audit-detail">
          <span className="audit-label">User:</span>
          <span className="audit-value">{mockSummary.user}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">Date & Time:</span>
          <span className="audit-value">{mockSummary.timestamp}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">File Name:</span>
          <span className="audit-value">{mockSummary.fileName}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">Import Type:</span>
          <span className="audit-value">{mockSummary.importType}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">Import Mode:</span>
          <span className="audit-value">{mockSummary.importMode}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">Mapping Template:</span>
          <span className="audit-value">{mockSummary.mappingTemplate}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">Success Count:</span>
          <span className="audit-value">{mockSummary.loaded}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">Failure Count:</span>
          <span className="audit-value">{mockSummary.failed}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">Warning Count:</span>
          <span className="audit-value">{mockSummary.warnings}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">Duration:</span>
          <span className="audit-value">{mockSummary.duration}</span>
        </div>
        <div className="audit-detail">
          <span className="audit-label">Error File Reference:</span>
          <span className="audit-value">{mockSummary.errorFileReference}</span>
        </div>
      </div>

      {/* Download Actions */}
      <div className="summary-actions">
        {mockSummary.failed > 0 && (
          <button className="btn-secondary" onClick={downloadErrorFile}>
            📥 Download Error File
          </button>
        )}
        <button className="btn-secondary" onClick={downloadFullReport}>
          📄 Download Full Report
        </button>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          🔄 Start New Import
        </button>
      </div>
    </div>
  );
};

export default ImportAssistants;
