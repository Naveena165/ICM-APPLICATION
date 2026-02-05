/**
 * Payees Module - Central Export
 * 
 * This module contains all payee-related functionality including:
 * - Payee management components
 * - Payee data models
 * - Payee-specific reports
 */

// Main Components
export { default as PayeesList } from './components/PayeesList';
export { default as AddPayee } from './components/AddPayee';
export { default as PayeeDetail } from './components/PayeeDetail';
export { default as PayeeDetails } from './components/PayeeDetails';

// Reports
export { default as PayeeAttainmentReport } from './reports/PayeeAttainmentReport';
export { default as PayeeCommissionHistoryReport } from './reports/PayeeCommissionHistoryReport';
export { default as EarningsByPayeeReport } from './reports/EarningsByPayeeReport';
export { default as OverpaidUnderpaidPayeesReport } from './reports/OverpaidUnderpaidPayeesReport';

// Data
export { mockPayees } from './data/mockPayees';
