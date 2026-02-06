/**
 * Rejected Transactions Report Component
 * 
 * Displays transactions with validation errors
 * Requirements: 3.5.3
 */

import React, { useState, useEffect } from 'react';
import ReportViewer from '../shared/ReportViewer';
import { mockTransactions } from '../../data/mockTransactions';
import { applyFilters } from '../utils/reportDataAggregator';

const RejectedTransactionsReport = ({ filters = {} }) => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    // Filter to only rejected transactions
    const rejectedTransactions = mockTransactions.filter(txn => 
      txn.status === 'Rejected' || txn.validationStatus === 'Invalid'
    );

    // Apply additional filters
    const filteredTransactions = applyFilters(rejectedTransactions, filters);

    // Transform data for display
    const rows = filteredTransactions.map(txn => ({
      id: txn.id,
      transactionId: txn.transactionId,
      transactionDate: txn.transactionDate,
      payeeName: txn.payeeName || 'N/A',
      customerName: txn.customerName || 'N/A',
      amount: txn.amount,
      product: txn.product || 'Unknown',
      importBatchName: txn.importBatchName,
      importDate: txn.importDate,
      rejectionReasons: formatRejectionReasons(txn.validationErrors),
      errorCount: txn.validationErrors.length,
      region: txn.region,
      // For drilldown
      _raw: txn
    }));

    const data = {
      reportId: 'rejected-transactions',
      title: 'Rejected Transactions',
      description: 'Transactions that failed validation',
      columns: [
        { key: 'transactionId', label: 'Transaction ID', sortable: true },
        { key: 'transactionDate', label: 'Date', sortable: true, type: 'date' },
        { key: 'payeeName', label: 'Payee', sortable: true },
        { key: 'customerName', label: 'Customer', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true, type: 'currency' },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'importBatchName', label: 'Import Batch', sortable: true },
        { key: 'errorCount', label: 'Error Count', sortable: true },
        { key: 'rejectionReasons', label: 'Rejection Reasons', sortable: false, type: 'text' }
      ],
      rows,
      summary: {
        totalRejected: rows.length,
        totalErrorCount: rows.reduce((sum, row) => sum + row.errorCount, 0),
        byErrorType: calculateErrorTypeBreakdown(filteredTransactions),
        byImportBatch: calculateBatchBreakdown(rows)
      },
      metadata: {
        totalRows: rows.length,
        filteredRows: rows.length,
        dataAsOf: new Date().toISOString()
      }
    };

    setReportData(data);
  };

  const formatRejectionReasons = (errors) => {
    if (!errors || errors.length === 0) return 'No errors';
    return errors.join('; ');
  };

  const calculateErrorTypeBreakdown = (transactions) => {
    const breakdown = {};
    transactions.forEach(txn => {
      txn.validationErrors.forEach(error => {
        if (!breakdown[error]) {
          breakdown[error] = 0;
        }
        breakdown[error]++;
      });
    });
    return breakdown;
  };

  const calculateBatchBreakdown = (rows) => {
    const breakdown = {};
    rows.forEach(row => {
      const batch = row.importBatchName || 'Unknown';
      if (!breakdown[batch]) {
        breakdown[batch] = 0;
      }
      breakdown[batch]++;
    });
    return breakdown;
  };

  const handleDrilldown = (row, column) => {
    console.log('Drilldown to rejected transaction:', row.transactionId);
    // TODO: Implement navigation to transaction detail with error details
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

export default RejectedTransactionsReport;
