/**
 * Credited Transactions Report Component
 * 
 * Displays transactions that generated commission credits
 * Requirements: 3.5.2
 */

import React, { useState, useEffect } from 'react';
import ReportViewer from '../shared/ReportViewer';
import { mockTransactions } from '../../data/mockTransactions';
import { applyFilters } from '../utils/reportDataAggregator';

const CreditedTransactionsReport = ({ filters = {} }) => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    // Filter to only credited transactions
    const creditedTransactions = mockTransactions.filter(txn => 
      txn.status === 'Credited' && txn.creditAmount !== 0
    );

    // Apply additional filters
    const filteredTransactions = applyFilters(creditedTransactions, filters);

    // Transform data for display
    const rows = filteredTransactions.map(txn => ({
      id: txn.id,
      transactionId: txn.transactionId,
      transactionDate: txn.transactionDate,
      payeeName: txn.payeeName,
      customerName: txn.customerName,
      amount: txn.amount,
      creditAmount: txn.creditAmount,
      creditDate: txn.creditDate,
      creditType: determineCreditType(txn),
      product: txn.product,
      region: txn.region,
      planName: txn.planName,
      rulesApplied: txn.rulesApplied.join(', ') || 'None',
      // For drilldown
      _raw: txn
    }));

    const data = {
      reportId: 'credited-transactions',
      title: 'Credited Transactions',
      description: 'Transactions that generated commission credits',
      columns: [
        { key: 'transactionId', label: 'Transaction ID', sortable: true },
        { key: 'transactionDate', label: 'Date', sortable: true, type: 'date' },
        { key: 'payeeName', label: 'Payee', sortable: true },
        { key: 'customerName', label: 'Customer', sortable: true },
        { key: 'amount', label: 'Transaction Amount', sortable: true, type: 'currency' },
        { key: 'creditAmount', label: 'Credit Amount', sortable: true, type: 'currency' },
        { key: 'creditType', label: 'Credit Type', sortable: true },
        { key: 'creditDate', label: 'Credit Date', sortable: true, type: 'datetime' },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'planName', label: 'Plan', sortable: true },
        { key: 'rulesApplied', label: 'Rules Applied', sortable: false }
      ],
      rows,
      summary: {
        totalTransactions: rows.length,
        totalTransactionAmount: rows.reduce((sum, row) => sum + row.amount, 0),
        totalCreditAmount: rows.reduce((sum, row) => sum + row.creditAmount, 0),
        averageCreditRate: calculateAverageCreditRate(rows)
      },
      metadata: {
        totalRows: rows.length,
        filteredRows: rows.length,
        dataAsOf: new Date().toISOString()
      }
    };

    setReportData(data);
  };

  const determineCreditType = (txn) => {
    if (txn.creditAmount < 0) return 'Clawback';
    if (txn.transactionType === 'Renewal') return 'Renewal Credit';
    if (txn.transactionType === 'Upgrade') return 'Upgrade Credit';
    if (txn.bonusAmount && txn.bonusAmount > 0) return 'Bonus Credit';
    return 'Standard Credit';
  };

  const calculateAverageCreditRate = (rows) => {
    if (rows.length === 0) return 0;
    const totalAmount = rows.reduce((sum, row) => sum + Math.abs(row.amount), 0);
    const totalCredit = rows.reduce((sum, row) => sum + Math.abs(row.creditAmount), 0);
    if (totalAmount === 0) return 0;
    return Math.round((totalCredit / totalAmount) * 10000) / 100;
  };

  const handleDrilldown = (row, column) => {
    console.log('Drilldown to credited transaction:', row.transactionId);
    // TODO: Implement navigation to transaction detail
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

export default CreditedTransactionsReport;
