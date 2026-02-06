/**
 * Revenue vs Commissionable Revenue Report Component
 * 
 * Calculates commissionable percentage and groups by product or dimension
 * Requirements: 3.5.5
 */

import React, { useState, useEffect } from 'react';
import ReportViewer from '../shared/ReportViewer';
import { mockTransactions } from '../../data/mockTransactions';
import { applyFilters } from '../utils/reportDataAggregator';

const RevenueVsCommissionableReport = ({ filters = {} }) => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = () => {
    // Apply filters to transaction data
    const filteredTransactions = applyFilters(mockTransactions, filters);

    // Group by product
    const productGroups = {};
    filteredTransactions.forEach(txn => {
      const product = txn.product || 'Unknown';
      if (!productGroups[product]) {
        productGroups[product] = {
          product,
          productCategory: txn.productCategory || 'General',
          totalRevenue: 0,
          commissionableRevenue: 0,
          nonCommissionableRevenue: 0,
          transactionCount: 0
        };
      }
      productGroups[product].totalRevenue += txn.amount;
      productGroups[product].commissionableRevenue += txn.commissionableAmount;
      productGroups[product].nonCommissionableRevenue += (txn.amount - txn.commissionableAmount);
      productGroups[product].transactionCount++;
    });

    // Transform to rows and calculate percentages
    const rows = Object.values(productGroups).map(group => ({
      product: group.product,
      productCategory: group.productCategory,
      totalRevenue: group.totalRevenue,
      commissionableRevenue: group.commissionableRevenue,
      nonCommissionableRevenue: group.nonCommissionableRevenue,
      commissionablePercentage: group.totalRevenue !== 0 
        ? Math.round((group.commissionableRevenue / group.totalRevenue) * 10000) / 100 
        : 0,
      transactionCount: group.transactionCount,
      // For drilldown
      _raw: group
    }));

    // Sort by total revenue descending
    rows.sort((a, b) => b.totalRevenue - a.totalRevenue);

    const data = {
      reportId: 'revenue-vs-commissionable',
      title: 'Revenue vs Commissionable Revenue',
      description: 'Comparison of total revenue to commission-eligible revenue by product',
      columns: [
        { key: 'product', label: 'Product', sortable: true },
        { key: 'productCategory', label: 'Category', sortable: true },
        { key: 'transactionCount', label: 'Transactions', sortable: true },
        { key: 'totalRevenue', label: 'Total Revenue', sortable: true, type: 'currency' },
        { key: 'commissionableRevenue', label: 'Commissionable', sortable: true, type: 'currency' },
        { key: 'nonCommissionableRevenue', label: 'Non-Commissionable', sortable: true, type: 'currency' },
        { key: 'commissionablePercentage', label: 'Commissionable %', sortable: true, type: 'percentage' }
      ],
      rows,
      summary: {
        totalProducts: rows.length,
        totalRevenue: rows.reduce((sum, row) => sum + row.totalRevenue, 0),
        totalCommissionable: rows.reduce((sum, row) => sum + row.commissionableRevenue, 0),
        totalNonCommissionable: rows.reduce((sum, row) => sum + row.nonCommissionableRevenue, 0),
        overallCommissionablePercentage: calculateOverallPercentage(rows)
      },
      metadata: {
        totalRows: rows.length,
        filteredRows: rows.length,
        dataAsOf: new Date().toISOString()
      }
    };

    setReportData(data);
  };

  const calculateOverallPercentage = (rows) => {
    const totalRevenue = rows.reduce((sum, row) => sum + row.totalRevenue, 0);
    const totalCommissionable = rows.reduce((sum, row) => sum + row.commissionableRevenue, 0);
    if (totalRevenue === 0) return 0;
    return Math.round((totalCommissionable / totalRevenue) * 10000) / 100;
  };

  const handleDrilldown = (row, column) => {
    console.log('Drilldown to product transactions:', row.product);
    // TODO: Implement navigation to filtered transaction list for this product
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

export default RevenueVsCommissionableReport;
