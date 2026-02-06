/**
 * Import Templates Utility
 * Handles generation, validation, and management of CSV/Excel templates for transaction imports
 */

// Template version for tracking updates
export const TEMPLATE_VERSION = '1.2.0';
export const TEMPLATE_LAST_UPDATED = '2025-01-15';

// Base transaction template structure
export const BASE_TRANSACTION_TEMPLATE = {
  version: TEMPLATE_VERSION,
  name: 'Base Transaction Import Template',
  description: 'Template for importing base transaction data into ICM system',
  requiredFields: [
    'transactionId',
    'amount',
    'transactionDate',
    'payeeId',
    'payeeName',
    'productId',
    'productName',
    'customerId',
    'customerName'
  ],
  optionalFields: [
    'externalTransactionId',
    'sourceSystem',
    'sourceSystemDetail',
    'importBatchId',
    'transactionType',
    'transactionSubType',
    'transactionSource',
    'channelType',
    'currency',
    'roleId',
    'territoryId',
    'managerId',
    'quantity',
    'unitPrice',
    'invoiceDate',
    'closeDate',
    'revenueRecognitionDate',
    'customerType'
  ],
  headers: [
    // Required fields
    { field: 'transactionId', label: 'Transaction ID', type: 'string', required: true, example: 'TXN-2025-001', description: 'Unique identifier for the transaction' },
    { field: 'amount', label: 'Amount', type: 'decimal', required: true, example: '1500.00', description: 'Transaction amount in decimal format' },
    { field: 'transactionDate', label: 'Transaction Date', type: 'date', required: true, example: '2025-01-15', description: 'Date in YYYY-MM-DD format' },
    { field: 'payeeId', label: 'Payee ID', type: 'string', required: true, example: 'PAY-001', description: 'Unique identifier for the payee' },
    { field: 'payeeName', label: 'Payee Name', type: 'string', required: true, example: 'TELECOM INC', description: 'Full name of the payee' },
    { field: 'productId', label: 'Product ID', type: 'string', required: true, example: 'PROD-001', description: 'Unique identifier for the product' },
    { field: 'productName', label: 'Product Name', type: 'string', required: true, example: 'Wireless Plan Premium', description: 'Full name of the product' },
    { field: 'customerId', label: 'Customer ID', type: 'string', required: true, example: 'CUST-001', description: 'Unique identifier for the customer' },
    { field: 'customerName', label: 'Customer Name', type: 'string', required: true, example: 'John Smith', description: 'Full name of the customer' },
    
    // Optional fields
    { field: 'externalTransactionId', label: 'External Transaction ID', type: 'string', required: false, example: 'SF-OPP-112020251', description: 'External system transaction identifier' },
    { field: 'sourceSystem', label: 'Source System', type: 'string', required: false, example: 'CRM', description: 'Source system type (CRM, ERP, BILLING, etc.)' },
    { field: 'sourceSystemDetail', label: 'Source System Detail', type: 'string', required: false, example: 'Salesforce', description: 'Specific source system name' },
    { field: 'transactionType', label: 'Transaction Type', type: 'string', required: false, example: 'Sale', description: 'Type of transaction (Sale, Renewal, etc.)' },
    { field: 'transactionSubType', label: 'Transaction Sub Type', type: 'string', required: false, example: 'New Customer', description: 'Sub-type of transaction' },
    { field: 'transactionSource', label: 'Transaction Source', type: 'string', required: false, example: 'Direct', description: 'Source of the transaction (Direct, Partner, etc.)' },
    { field: 'channelType', label: 'Channel Type', type: 'string', required: false, example: 'Online', description: 'Sales channel type' },
    { field: 'currency', label: 'Currency', type: 'string', required: false, example: 'CAD', description: 'Currency code (CAD, USD, etc.)' },
    { field: 'roleId', label: 'Role ID', type: 'string', required: false, example: 'ROLE-001', description: 'Role identifier' },
    { field: 'territoryId', label: 'Territory ID', type: 'string', required: false, example: 'WEST-001', description: 'Territory identifier' },
    { field: 'managerId', label: 'Manager ID', type: 'string', required: false, example: 'MGR-001', description: 'Manager identifier' },
    { field: 'quantity', label: 'Quantity', type: 'integer', required: false, example: '1', description: 'Quantity of items' },
    { field: 'unitPrice', label: 'Unit Price', type: 'decimal', required: false, example: '89.99', description: 'Price per unit' },
    { field: 'invoiceDate', label: 'Invoice Date', type: 'date', required: false, example: '2025-01-15', description: 'Invoice date in YYYY-MM-DD format' },
    { field: 'closeDate', label: 'Close Date', type: 'date', required: false, example: '2025-01-15', description: 'Close date in YYYY-MM-DD format' },
    { field: 'revenueRecognitionDate', label: 'Revenue Recognition Date', type: 'date', required: false, example: '2025-01-15', description: 'Revenue recognition date in YYYY-MM-DD format' },
    { field: 'customerType', label: 'Customer Type', type: 'string', required: false, example: 'Business', description: 'Type of customer (Individual, Business, etc.)' }
  ]
};

// Credit transaction template structure
export const CREDIT_TRANSACTION_TEMPLATE = {
  version: TEMPLATE_VERSION,
  name: 'Credit Transaction Import Template',
  description: 'Template for importing credit transaction data',
  requiredFields: [
    'creditTransactionId',
    'baseTransactionId',
    'creditedPayeeId',
    'creditedPayeeName',
    'creditType',
    'creditPercentage',
    'creditedAmount'
  ],
  headers: [
    { field: 'creditTransactionId', label: 'Credit Transaction ID', type: 'string', required: true, example: 'CRD-2025-001', description: 'Unique identifier for the credit transaction' },
    { field: 'baseTransactionId', label: 'Base Transaction ID', type: 'string', required: true, example: 'TXN-2025-001', description: 'Reference to the base transaction' },
    { field: 'creditedPayeeId', label: 'Credited Payee ID', type: 'string', required: true, example: 'PAY-001', description: 'Payee receiving the credit' },
    { field: 'creditedPayeeName', label: 'Credited Payee Name', type: 'string', required: true, example: 'TELECOM INC', description: 'Name of payee receiving credit' },
    { field: 'creditType', label: 'Credit Type', type: 'string', required: true, example: 'Direct', description: 'Type of credit (Direct, Split, Overlay)' },
    { field: 'creditRole', label: 'Credit Role', type: 'string', required: false, example: 'Sales Rep', description: 'Role of the credited payee' },
    { field: 'creditPercentage', label: 'Credit Percentage', type: 'decimal', required: true, example: '100', description: 'Percentage of credit (0-100)' },
    { field: 'creditedAmount', label: 'Credited Amount', type: 'decimal', required: true, example: '89.99', description: 'Amount credited to payee' },
    { field: 'currency', label: 'Currency', type: 'string', required: false, example: 'CAD', description: 'Currency code' },
    { field: 'ruleId', label: 'Rule ID', type: 'string', required: false, example: 'RULE-001', description: 'Credit rule identifier' },
    { field: 'ruleName', label: 'Rule Name', type: 'string', required: false, example: 'Direct Sales Commission', description: 'Name of the credit rule' }
  ]
};

// Earnings transaction template structure
export const EARNINGS_TRANSACTION_TEMPLATE = {
  version: TEMPLATE_VERSION,
  name: 'Earnings Transaction Import Template',
  description: 'Template for importing earnings transaction data',
  requiredFields: [
    'earningId',
    'creditTransactionId',
    'planId',
    'payeeId',
    'payeeName',
    'earningsAmount',
    'rateApplied'
  ],
  headers: [
    { field: 'earningId', label: 'Earning ID', type: 'string', required: true, example: 'ERN-2025-001', description: 'Unique identifier for the earning' },
    { field: 'creditTransactionId', label: 'Credit Transaction ID', type: 'string', required: true, example: 'CRD-2025-001', description: 'Reference to the credit transaction' },
    { field: 'baseTransactionId', label: 'Base Transaction ID', type: 'string', required: false, example: 'TXN-2025-001', description: 'Reference to the base transaction' },
    { field: 'planId', label: 'Plan ID', type: 'string', required: true, example: 'PLAN-001', description: 'Compensation plan identifier' },
    { field: 'planName', label: 'Plan Name', type: 'string', required: false, example: 'FY25 Sales Commission Plan', description: 'Name of the compensation plan' },
    { field: 'payeeId', label: 'Payee ID', type: 'string', required: true, example: 'PAY-001', description: 'Payee identifier' },
    { field: 'payeeName', label: 'Payee Name', type: 'string', required: true, example: 'TELECOM INC', description: 'Name of the payee' },
    { field: 'earningsAmount', label: 'Earnings Amount', type: 'decimal', required: true, example: '13.50', description: 'Total earnings amount' },
    { field: 'rateApplied', label: 'Rate Applied', type: 'decimal', required: true, example: '15.0', description: 'Rate applied as percentage' },
    { field: 'tier', label: 'Tier', type: 'string', required: false, example: 'Standard', description: 'Payee tier level' },
    { field: 'bonusAmount', label: 'Bonus Amount', type: 'decimal', required: false, example: '0', description: 'Additional bonus amount' },
    { field: 'quotaAttainment', label: 'Quota Attainment', type: 'decimal', required: false, example: '85.5', description: 'Quota attainment percentage' },
    { field: 'acceleratorLevel', label: 'Accelerator Level', type: 'string', required: false, example: 'None', description: 'Accelerator level applied' },
    { field: 'currency', label: 'Currency', type: 'string', required: false, example: 'CAD', description: 'Currency code' },
    { field: 'amountCredited', label: 'Amount Credited', type: 'decimal', required: false, example: '89.99', description: 'Original credited amount' }
  ]
};

// Payment transaction template structure
export const PAYMENT_TRANSACTION_TEMPLATE = {
  version: TEMPLATE_VERSION,
  name: 'Payment Transaction Import Template',
  description: 'Template for importing payment transaction data',
  requiredFields: [
    'paymentId',
    'earningId',
    'payeeId',
    'payeeName',
    'grossEarnings',
    'netPayable'
  ],
  headers: [
    { field: 'paymentId', label: 'Payment ID', type: 'string', required: true, example: 'PAY-2025-001', description: 'Unique identifier for the payment' },
    { field: 'earningId', label: 'Earning ID', type: 'string', required: true, example: 'ERN-2025-001', description: 'Reference to the earning transaction' },
    { field: 'batchId', label: 'Batch ID', type: 'string', required: false, example: 'BATCH-2025-001', description: 'Payment batch identifier' },
    { field: 'paysheetId', label: 'Paysheet ID', type: 'string', required: false, example: 'PS-2025-001', description: 'Paysheet identifier' },
    { field: 'payeeId', label: 'Payee ID', type: 'string', required: true, example: 'PAY-001', description: 'Payee identifier' },
    { field: 'payeeName', label: 'Payee Name', type: 'string', required: true, example: 'TELECOM INC', description: 'Name of the payee' },
    { field: 'grossEarnings', label: 'Gross Earnings', type: 'decimal', required: true, example: '13.50', description: 'Gross earnings amount' },
    { field: 'adjustments', label: 'Adjustments', type: 'decimal', required: false, example: '0', description: 'Adjustment amount (positive or negative)' },
    { field: 'netPayable', label: 'Net Payable', type: 'decimal', required: true, example: '13.50', description: 'Final net payable amount' },
    { field: 'paymentDate', label: 'Payment Date', type: 'date', required: false, example: '2025-01-31', description: 'Scheduled payment date' },
    { field: 'paymentStatus', label: 'Payment Status', type: 'string', required: false, example: 'Pending', description: 'Payment status (Pending, Paid, Locked, Cancelled)' },
    { field: 'adjustmentStatus', label: 'Adjustment Status', type: 'string', required: false, example: 'None', description: 'Adjustment status description' },
    { field: 'currency', label: 'Currency', type: 'string', required: false, example: 'CAD', description: 'Currency code' },
    { field: 'customerId', label: 'Customer ID', type: 'string', required: false, example: 'CUST-001', description: 'Customer identifier' },
    { field: 'customerName', label: 'Customer Name', type: 'string', required: false, example: 'John Smith', description: 'Customer name' },
    { field: 'customerType', label: 'Customer Type', type: 'string', required: false, example: 'Individual', description: 'Type of customer' },
    { field: 'region', label: 'Region', type: 'string', required: false, example: 'North America', description: 'Geographic region' }
  ]
};

// Get template by transaction type
export const getTemplate = (transactionType) => {
  switch (transactionType.toLowerCase()) {
    case 'base':
      return BASE_TRANSACTION_TEMPLATE;
    case 'crediting':
    case 'credit':
      return CREDIT_TRANSACTION_TEMPLATE;
    case 'earnings':
      return EARNINGS_TRANSACTION_TEMPLATE;
    case 'payments':
    case 'payment':
      return PAYMENT_TRANSACTION_TEMPLATE;
    default:
      return BASE_TRANSACTION_TEMPLATE;
  }
};

// Generate CSV template content
export const generateCSVTemplate = (transactionType, includeExamples = true) => {
  const template = getTemplate(transactionType);
  
  // Create header row
  const headers = template.headers.map(header => header.label);
  
  // Create example row if requested
  const exampleRow = includeExamples 
    ? template.headers.map(header => header.example || '')
    : [];
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  if (includeExamples) {
    csvContent += exampleRow.join(',') + '\n';
  }
  
  return csvContent;
};

// Generate field mapping guide
export const generateFieldMappingGuide = (transactionType) => {
  const template = getTemplate(transactionType);
  
  let guide = `# ${template.name} - Field Mapping Guide\n\n`;
  guide += `**Version:** ${template.version}\n`;
  guide += `**Last Updated:** ${TEMPLATE_LAST_UPDATED}\n\n`;
  guide += `## Description\n${template.description}\n\n`;
  
  guide += `## Required Fields\n`;
  template.headers
    .filter(header => header.required)
    .forEach(header => {
      guide += `- **${header.label}** (${header.type}): ${header.description}\n`;
      guide += `  - Example: ${header.example}\n\n`;
    });
  
  guide += `## Optional Fields\n`;
  template.headers
    .filter(header => !header.required)
    .forEach(header => {
      guide += `- **${header.label}** (${header.type}): ${header.description}\n`;
      guide += `  - Example: ${header.example}\n\n`;
    });
  
  return guide;
};

// Validate template format
export const validateTemplateFormat = (fileContent, transactionType) => {
  const template = getTemplate(transactionType);
  const errors = [];
  const warnings = [];
  
  try {
    // Parse CSV content
    const lines = fileContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      errors.push('File is empty');
      return { isValid: false, errors, warnings };
    }
    
    // Check headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const requiredHeaders = template.headers
      .filter(h => h.required)
      .map(h => h.label);
    
    // Check for missing required headers
    const missingHeaders = requiredHeaders.filter(required => 
      !headers.some(header => header.toLowerCase() === required.toLowerCase())
    );
    
    if (missingHeaders.length > 0) {
      errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    // Check for unknown headers
    const knownHeaders = template.headers.map(h => h.label.toLowerCase());
    const unknownHeaders = headers.filter(header => 
      !knownHeaders.includes(header.toLowerCase())
    );
    
    if (unknownHeaders.length > 0) {
      warnings.push(`Unknown headers found: ${unknownHeaders.join(', ')}`);
    }
    
    // Validate data rows if present
    if (lines.length > 1) {
      const dataLines = lines.slice(1);
      dataLines.forEach((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length !== headers.length) {
          errors.push(`Row ${index + 2}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
        }
        
        // Validate required fields are not empty
        headers.forEach((header, headerIndex) => {
          const templateHeader = template.headers.find(h => 
            h.label.toLowerCase() === header.toLowerCase()
          );
          
          if (templateHeader && templateHeader.required && !values[headerIndex]) {
            errors.push(`Row ${index + 2}: Required field '${header}' is empty`);
          }
        });
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      rowCount: lines.length - 1,
      headerCount: headers.length
    };
    
  } catch (error) {
    errors.push(`File parsing error: ${error.message}`);
    return { isValid: false, errors, warnings };
  }
};

// Check for template updates
export const checkTemplateVersion = (currentVersion) => {
  const current = currentVersion || '1.0.0';
  const latest = TEMPLATE_VERSION;
  
  // Simple version comparison (assumes semantic versioning)
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);
  
  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentPart = currentParts[i] || 0;
    const latestPart = latestParts[i] || 0;
    
    if (latestPart > currentPart) {
      return {
        updateAvailable: true,
        currentVersion: current,
        latestVersion: latest,
        lastUpdated: TEMPLATE_LAST_UPDATED
      };
    } else if (currentPart > latestPart) {
      break;
    }
  }
  
  return {
    updateAvailable: false,
    currentVersion: current,
    latestVersion: latest,
    lastUpdated: TEMPLATE_LAST_UPDATED
  };
};

// Generate import guidelines
export const generateImportGuidelines = (transactionType) => {
  const template = getTemplate(transactionType);
  
  let guidelines = `# ${template.name} - Import Guidelines\n\n`;
  
  guidelines += `## Before You Start\n`;
  guidelines += `1. Download the latest template from the Import panel\n`;
  guidelines += `2. Review the Field Mapping Guide for detailed field descriptions\n`;
  guidelines += `3. Ensure your data matches the required format\n\n`;
  
  guidelines += `## Data Format Requirements\n`;
  guidelines += `- **File Format:** CSV or Excel (.xlsx, .xls)\n`;
  guidelines += `- **File Size:** Maximum 50MB\n`;
  guidelines += `- **Encoding:** UTF-8 recommended\n`;
  guidelines += `- **Date Format:** YYYY-MM-DD (e.g., 2025-01-15)\n`;
  guidelines += `- **Decimal Format:** Use decimal point (e.g., 1500.00)\n`;
  guidelines += `- **Currency:** Numeric values only (no currency symbols)\n\n`;
  
  guidelines += `## Required Fields\n`;
  template.headers
    .filter(h => h.required)
    .forEach(header => {
      guidelines += `- **${header.label}:** ${header.description}\n`;
    });
  
  guidelines += `\n## Data Quality Tips\n`;
  guidelines += `1. **Unique IDs:** Ensure all ID fields are unique and consistent\n`;
  guidelines += `2. **Data Validation:** Use the validation options in the import panel\n`;
  guidelines += `3. **Duplicate Check:** Enable duplicate detection to avoid data issues\n`;
  guidelines += `4. **Test Import:** Start with a small sample to validate your format\n`;
  guidelines += `5. **Backup Data:** Keep a backup of your original data\n\n`;
  
  guidelines += `## Common Issues\n`;
  guidelines += `- **Missing Headers:** Ensure all required headers are present\n`;
  guidelines += `- **Date Format:** Use YYYY-MM-DD format for all dates\n`;
  guidelines += `- **Special Characters:** Avoid special characters in ID fields\n`;
  guidelines += `- **Empty Required Fields:** All required fields must have values\n`;
  guidelines += `- **Column Alignment:** Ensure data aligns with header columns\n\n`;
  
  guidelines += `## Support\n`;
  guidelines += `If you encounter issues during import, check the error report for detailed information about any problems with your data.\n`;
  
  return guidelines;
};