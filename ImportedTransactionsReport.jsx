/**
 * Imported Transactions Report Component
 * 
 * Displays all imported transactions with import batch and audit trail links
 * Requirements: 3.5.1, 3.5.7
 */

import React, { useState, useEffect } from 'react';
import ReportViewer from '../shared/ReportViewer';
import { mockTransactions } from '../../data/mockTransactions';
import { applyFilters } from '../utils/reportDataAggregator';

const ImportedTransactionsReport = ({ filters = {} }) => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    // Apply filters to transaction data
    const filteredTransactions = applyFilters(mockTransactions, filters);

    // Transform data for display
    const rows = filteredTransactions.map(txn => ({
      id: txn.id,
      transactionId: txn.transactionId,
      transactionDate: txn.transactionDate,
      payeeName: txn.payeeName,
      customerName: txn.customerName,
      amount: txn.amount,
      product: txn.product,
      importBatchName: txn.importBatchName,
      importDate: txn.importDate,
      status: txn.status,
      validationStatus: txn.validationStatus,
      processingStatus: txn.processingStatus,
      region: txn.region,
      planName: txn.planName,
      // For drilldown
      _raw: txn
    }));

    const data = {
      reportId: 'imported-transactions',
      title: 'Imported Transactions',
      description: 'All transactions uploaded through Import Center',
      columns: [
        { key: 'transactionId', label: 'Transaction ID', sortable: true },
        { key: 'transactionDate', label: 'Date', sortable: true, type: 'date' },
        { key: 'payeeName', label: 'Payee', sortable: true },
        { key: 'customerName', label: 'Customer', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true, type: 'currency' },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'importBatchName', label: 'Import Batch', sortable: true },
        { key: 'importDate', label: 'Import Date', sortable: true, type: 'datetime' },
        { key: 'status', label: 'Status', sortable: true, type: 'badge' },
        { key: 'validationStatus', label: 'Validation', sortable: true, type: 'badge' },
        { key: 'region', label: 'Region', sortable: true }
      ],
      rows,
      summary: {
        totalTransactions: rows.length,
        totalAmount: rows.reduce((sum, row) => sum + row.amount, 0),
        byStatus: calculateStatusBreakdown(rows)
      },
      metadata: {
        totalRows: rows.length,
        filteredRows: rows.length,
        dataAsOf: new Date().toISOString()
      }
    };

    setReportData(data);
  };

  const calculateStatusBreakdown = (rows) => {
    const breakdown = {};
    rows.forEach(row => {
      if (!breakdown[row.status]) {
        breakdown[row.status] = 0;
      }
      breakdown[row.status]++;
    });
    return breakdown;
  };

  const handleDrilldown = (row, column) => {
    // Navigate to transaction detail view
    console.log('Drilldown to transaction:', row.transactionId);
    // TODO: Implement navigation to transaction detail with audit trail
  };

  if (!reportData) {
    return <div>Loading...</div>;
  }

  return (
    <ReportViewer
      reportData={reportData}
      onDrilldown={handleDrilldown}
      showFilters={true}
      showExport={true}
    />
  );
};

export default ImportedTransactionsReport;
