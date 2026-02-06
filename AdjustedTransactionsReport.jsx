/**
 * Adjusted Transactions Report Component
 * 
 * Displays transactions with manual adjustments
 * Requirements: 3.5.4
 */

import React, { useState, useEffect } from 'react';
import ReportViewer from '../shared/ReportViewer';
import { mockTransactions } from '../../data/mockTransactions';
import { applyFilters } from '../utils/reportDataAggregator';

const AdjustedTransactionsReport = ({ filters = {} }) => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    // Filter to only adjusted transactions
    const adjustedTransactions = mockTransactions.filter(txn => 
      txn.status === 'Adjusted' || (txn.adjustmentAmount && txn.adjustmentAmount !== 0)
    );

    // Apply additional filters
    const filteredTransactions = applyFilters(adjustedTransactions, filters);

    // Transform data for display
    const rows = filteredTransactions.map(txn => ({
      id: txn.id,
      transactionId: txn.transactionId,
      transactionDate: txn.transactionDate,
      payeeName: txn.payeeName,
      customerName: txn.customerName,
      originalAmount: txn.amount - (txn.adjustmentAmount || 0),
      adjustmentAmount: txn.adjustmentAmount || 0,
      adjustedAmount: txn.amount,
      adjustmentReason: txn.adjustmentReason || 'N/A',
      adjustmentDate: txn.adjustmentDate || 'N/A',
      adjustedBy: txn.adjustedBy || 'N/A',
      product: txn.product,
      region: txn.region,
      planName: txn.planName,
      // For drilldown
      _raw: txn
    }));

    const data = {
      reportId: 'adjusted-transactions',
      title: 'Adjusted Transactions',
      description: 'Transactions with manual adjustments',
      columns: [
        { key: 'transactionId', label: 'Transaction ID', sortable: true },
        { key: 'transactionDate', label: 'Date', sortable: true, type: 'date' },
        { key: 'payeeName', label: 'Payee', sortable: true },
        { key: 'customerName', label: 'Customer', sortable: true },
        { key: 'originalAmount', label: 'Original Amount', sortable: true, type: 'currency' },
        { key: 'adjustmentAmount', label: 'Adjustment', sortable: true, type: 'currency' },
        { key: 'adjustedAmount', label: 'Adjusted Amount', sortable: true, type: 'currency' },
        { key: 'adjustmentReason', label: 'Reason', sortable: false },
        { key: 'adjustmentDate', label: 'Adjustment Date', sortable: true, type: 'datetime' },
        { key: 'adjustedBy', label: 'Adjusted By', sortable: true }
      ],
      rows,
      summary: {
        totalAdjustments: rows.length,
        totalOriginalAmount: rows.reduce((sum, row) => sum + row.originalAmount, 0),
        totalAdjustmentAmount: rows.reduce((sum, row) => sum + row.adjustmentAmount, 0),
        totalAdjustedAmount: rows.reduce((sum, row) => sum + row.adjustedAmount, 0),
        positiveAdjustments: rows.filter(r => r.adjustmentAmount > 0).length,
        negativeAdjustments: rows.filter(r => r.adjustmentAmount < 0).length
      },
      metadata: {
        totalRows: rows.length,
        filteredRows: rows.length,
        dataAsOf: new Date().toISOString()
      }
    };

    setReportData(data);
  };

  const handleDrilldown = (row, column) => {
    console.log('Drilldown to adjusted transaction:', row.transactionId);
    // TODO: Implement navigation to transaction detail with adjustment history
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

export default AdjustedTransactionsReport;
