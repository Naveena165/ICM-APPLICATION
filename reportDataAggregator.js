/**
 * Report Data Aggregator Utility
 * 
 * Consolidates data from multiple sources and calculates metrics for reports
 * Requirements: 3.3, 3.4, 3.5, 3.6
 */

/**
 * Aggregate payee data for reports
 * @param {Array} payees - Array of payee objects
 * @param {Array} earnings - Array of earning objects
 * @param {Array} payments - Array of payment objects
 * @param {Array} transactions - Array of transaction objects
 * @param {Object} filters - Filter criteria (optional)
 * @returns {Array} Aggregated payee data
 */
export function aggregatePayeeData(payees, earnings, payments, transactions, filters = {}) {
  return payees.map(payee => {
    // Get payee's earnings
    const payeeEarnings = earnings.filter(e => e.payeeId === payee.id);
    const payeePayments = payments.filter(p => p.payeeId === payee.id);
    const payeeTransactions = transactions.filter(t => t.payeeId === payee.id);

    // Calculate totals
    const totalEarnings = payeeEarnings.reduce((sum, e) => sum + e.totalEarnings, 0);
    const totalPaid = payeePayments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payeePayments
      .filter(p => p.status === 'Pending' || p.status === 'Approved')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalSales = payeeTransactions
      .filter(t => t.status === 'Credited')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate attainment
    const attainment = payee.quota > 0 
      ? Math.round((totalSales / payee.quota) * 100) 
      : 0;

    return {
      id: payee.id,
      name: payee.name,
      role: payee.role,
      region: payee.region,
      planId: payee.planId,
      planName: payee.planName,
      quota: payee.quota,
      totalSales,
      totalEarnings,
      totalPaid,
      totalPending,
      balance: totalEarnings - totalPaid,
      attainment,
      status: payee.status,
      transactionCount: payeeTransactions.length,
      earningCount: payeeEarnings.length,
      paymentCount: payeePayments.length
    };
  });
}

/**
 * Aggregate plan data for reports
 * @param {Array} plans - Array of plan objects
 * @param {Array} payees - Array of payee objects
 * @param {Array} transactions - Array of transaction objects
 * @param {Array} earnings - Array of earning objects
 * @param {Object} filters - Filter criteria (optional)
 * @returns {Array} Aggregated plan data
 */
export function aggregatePlanData(plans, payees, transactions, earnings, filters = {}) {
  return plans.map(plan => {
    // Get plan participants
    const planPayees = payees.filter(p => p.planId === plan.id);
    const planTransactions = transactions.filter(t => t.planId === plan.id);
    const planEarnings = earnings.filter(e => e.planId === plan.id);

    // Calculate totals
    const totalRevenue = planTransactions
      .filter(t => t.status === 'Credited')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalCommission = planEarnings.reduce((sum, e) => sum + e.totalEarnings, 0);
    const participantCount = planPayees.length;
    const activeParticipants = planPayees.filter(p => p.status === 'Active').length;

    // Calculate metrics
    const avgCommissionPerParticipant = participantCount > 0 
      ? Math.round((totalCommission / participantCount) * 100) / 100 
      : 0;
    const costOfSales = totalRevenue > 0 
      ? Math.round((totalCommission / totalRevenue) * 10000) / 100 
      : 0;
    const roi = totalCommission > 0 
      ? Math.round(((totalRevenue - totalCommission) / totalCommission) * 100) / 100 
      : 0;
    const attainment = plan.targetRevenue > 0 
      ? Math.round((totalRevenue / plan.targetRevenue) * 100) 
      : 0;

    return {
      id: plan.id,
      name: plan.name,
      type: plan.type,
      status: plan.status,
      category: plan.category,
      participantCount,
      activeParticipants,
      totalRevenue,
      totalCommission,
      avgCommissionPerParticipant,
      costOfSales,
      roi,
      targetRevenue: plan.targetRevenue,
      attainment,
      transactionCount: planTransactions.length,
      earningCount: planEarnings.length,
      baseRate: plan.baseRate,
      tiers: plan.tiers
    };
  });
}

/**
 * Aggregate transaction data for reports
 * @param {Array} transactions - Array of transaction objects
 * @param {Array} payees - Array of payee objects (for enrichment)
 * @param {Array} plans - Array of plan objects (for enrichment)
 * @param {Object} filters - Filter criteria (optional)
 * @returns {Array} Aggregated transaction data
 */
export function aggregateTransactionData(transactions, payees, plans, filters = {}) {
  return transactions.map(txn => {
    // Enrich with payee and plan information
    const payee = payees.find(p => p.id === txn.payeeId);
    const plan = plans.find(p => p.id === txn.planId);

    // Calculate commissionable percentage
    const commissionablePercentage = txn.amount > 0 
      ? Math.round((txn.commissionableAmount / txn.amount) * 10000) / 100 
      : 0;

    return {
      id: txn.id,
      transactionId: txn.transactionId,
      transactionDate: txn.transactionDate,
      importBatchId: txn.importBatchId,
      importBatchName: txn.importBatchName,
      importDate: txn.importDate,
      payeeId: txn.payeeId,
      payeeName: txn.payeeName,
      payeeRole: payee?.role || '',
      payeeRegion: payee?.region || txn.region,
      customerId: txn.customerId,
      customerName: txn.customerName,
      amount: txn.amount,
      commissionableAmount: txn.commissionableAmount,
      commissionablePercentage,
      currency: txn.currency,
      product: txn.product,
      productCategory: txn.productCategory,
      quantity: txn.quantity,
      transactionType: txn.transactionType,
      region: txn.region,
      channel: txn.channel,
      status: txn.status,
      validationStatus: txn.validationStatus,
      validationErrors: txn.validationErrors,
      processingStatus: txn.processingStatus,
      planId: txn.planId,
      planName: txn.planName,
      planType: plan?.type || '',
      rulesApplied: txn.rulesApplied,
      creditAmount: txn.creditAmount,
      creditDate: txn.creditDate,
      adjustmentAmount: txn.adjustmentAmount,
      adjustmentReason: txn.adjustmentReason,
      adjustmentDate: txn.adjustmentDate,
      adjustedBy: txn.adjustedBy,
      notes: txn.notes
    };
  });
}

/**
 * Aggregate earnings data for reports
 * @param {Array} earnings - Array of earning objects
 * @param {Array} payments - Array of payment objects
 * @param {Array} transactions - Array of transaction objects
 * @param {Array} payees - Array of payee objects (for enrichment)
 * @param {Object} filters - Filter criteria (optional)
 * @returns {Array} Aggregated earnings data
 */
export function aggregateEarningsData(earnings, payments, transactions, payees, filters = {}) {
  return earnings.map(earning => {
    // Find related payment
    const payment = payments.find(p => p.earningId === earning.id);
    
    // Find related transactions
    const relatedTransactions = transactions.filter(t => 
      earning.transactionIds.includes(t.id) || earning.transactionIds.includes(t.transactionId)
    );

    // Enrich with payee information
    const payee = payees.find(p => p.id === earning.payeeId);

    // Calculate days pending if not paid
    let daysPending = 0;
    if (earning.status !== 'Paid' && earning.calculatedDate) {
      const calculatedDate = new Date(earning.calculatedDate);
      const now = new Date();
      daysPending = Math.floor((now - calculatedDate) / (1000 * 60 * 60 * 24));
    }

    return {
      id: earning.id,
      earningId: earning.earningId,
      payeeId: earning.payeeId,
      payeeName: earning.payeeName,
      payeeRole: payee?.role || '',
      payeeRegion: payee?.region || '',
      period: earning.period,
      baseAmount: earning.baseAmount,
      bonusAmount: earning.bonusAmount,
      adjustmentAmount: earning.adjustmentAmount,
      totalEarnings: earning.totalEarnings,
      transactionIds: earning.transactionIds,
      transactionCount: earning.transactionCount,
      planId: earning.planId,
      planName: earning.planName,
      rulesApplied: earning.rulesApplied,
      calculationDetails: earning.calculationDetails,
      status: earning.status,
      calculatedDate: earning.calculatedDate,
      approvedDate: earning.approvedDate,
      approvedBy: earning.approvedBy,
      paymentId: earning.paymentId,
      paidAmount: earning.paidAmount,
      paidDate: earning.paidDate,
      pendingAmount: earning.pendingAmount,
      daysPending,
      paymentStatus: payment?.status || 'Not Scheduled',
      paymentMethod: payment?.paymentMethod || '',
      scheduledDate: payment?.scheduledDate || null,
      relatedTransactionCount: relatedTransactions.length,
      notes: earning.notes
    };
  });
}

/**
 * Group data by a specific field
 * @param {Array} data - Array of data objects
 * @param {string} field - Field name to group by
 * @param {string} sumField - Field name to sum (optional)
 * @returns {Object} Grouped data
 */
export function groupBy(data, field, sumField = null) {
  const grouped = {};

  data.forEach(item => {
    const key = item[field];
    if (!grouped[key]) {
      grouped[key] = {
        key,
        count: 0,
        items: []
      };
      if (sumField) {
        grouped[key].total = 0;
      }
    }

    grouped[key].count++;
    grouped[key].items.push(item);
    
    if (sumField && item[sumField] !== undefined) {
      grouped[key].total += item[sumField];
    }
  });

  return grouped;
}

/**
 * Sum a specific field in an array of objects
 * @param {Array} data - Array of data objects
 * @param {string} field - Field name to sum
 * @returns {number} Sum of field values
 */
export function sumField(data, field) {
  return data.reduce((sum, item) => {
    const value = item[field];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

/**
 * Calculate average of a specific field
 * @param {Array} data - Array of data objects
 * @param {string} field - Field name to average
 * @returns {number} Average of field values
 */
export function averageField(data, field) {
  if (data.length === 0) return 0;
  const sum = sumField(data, field);
  return Math.round((sum / data.length) * 100) / 100;
}

/**
 * Calculate cost of sales metrics
 * @param {Array} transactions - Array of transaction objects
 * @param {Array} payments - Array of payment objects
 * @param {string} groupByField - Field to group by (e.g., 'product', 'region', 'planId')
 * @returns {Object} Cost of sales data grouped by specified field
 */
export function calculateCostOfSales(transactions, payments, groupByField = null) {
  // Calculate totals
  const totalRevenue = sumField(
    transactions.filter(t => t.status === 'Credited'),
    'amount'
  );
  const totalCommissions = sumField(
    payments.filter(p => p.status === 'Paid'),
    'amount'
  );
  const costPercent = totalRevenue > 0 
    ? Math.round((totalCommissions / totalRevenue) * 10000) / 100 
    : 0;

  const result = {
    totalRevenue,
    totalCommissions,
    costPercent,
    margin: totalRevenue - totalCommissions,
    marginPercent: totalRevenue > 0 
      ? Math.round(((totalRevenue - totalCommissions) / totalRevenue) * 10000) / 100 
      : 0
  };

  // Group by field if specified
  if (groupByField) {
    const grouped = {};
    
    transactions.filter(t => t.status === 'Credited').forEach(txn => {
      const key = txn[groupByField] || 'Unknown';
      if (!grouped[key]) {
        grouped[key] = {
          revenue: 0,
          commission: 0,
          transactionCount: 0
        };
      }
      grouped[key].revenue += txn.amount;
      grouped[key].transactionCount++;
    });

    // Add commission data
    payments.filter(p => p.status === 'Paid').forEach(payment => {
      // Find related transactions to determine grouping
      const relatedTxns = transactions.filter(t => t.payeeId === payment.payeeId);
      relatedTxns.forEach(txn => {
        const key = txn[groupByField] || 'Unknown';
        if (grouped[key]) {
          // Distribute commission proportionally
          const proportion = txn.amount / sumField(relatedTxns, 'amount');
          grouped[key].commission += payment.amount * proportion;
        }
      });
    });

    // Calculate percentages for each group
    Object.keys(grouped).forEach(key => {
      const group = grouped[key];
      group.costPercent = group.revenue > 0 
        ? Math.round((group.commission / group.revenue) * 10000) / 100 
        : 0;
      group.margin = group.revenue - group.commission;
      group.marginPercent = group.revenue > 0 
        ? Math.round(((group.revenue - group.commission) / group.revenue) * 10000) / 100 
        : 0;
    });

    result.byGroup = grouped;
  }

  return result;
}

/**
 * Calculate plan performance metrics
 * @param {Object} plan - Plan object
 * @param {Array} payees - Array of payee objects on this plan
 * @param {Array} transactions - Array of transaction objects for this plan
 * @param {Array} earnings - Array of earning objects for this plan
 * @returns {Object} Plan performance metrics
 */
export function calculatePlanPerformance(plan, payees, transactions, earnings) {
  const actualSales = sumField(
    transactions.filter(t => t.status === 'Credited'),
    'amount'
  );
  const actualEarnings = sumField(earnings, 'totalEarnings');
  const attainment = plan.targetRevenue > 0 
    ? Math.round((actualSales / plan.targetRevenue) * 100) 
    : 0;

  // Count achievers (payees meeting or exceeding quota)
  const achievers = payees.filter(p => {
    const payeeSales = sumField(
      transactions.filter(t => t.payeeId === p.id && t.status === 'Credited'),
      'amount'
    );
    return p.quota > 0 && payeeSales >= p.quota;
  }).length;

  const underAchievers = payees.length - achievers;

  return {
    planId: plan.id,
    planName: plan.name,
    targetSales: plan.targetRevenue,
    actualSales,
    attainment,
    expectedEarnings: plan.targetCommission,
    actualEarnings,
    earningsVariance: actualEarnings - plan.targetCommission,
    participantCount: payees.length,
    achievers,
    underAchievers,
    achieverPercent: payees.length > 0 
      ? Math.round((achievers / payees.length) * 100) 
      : 0
  };
}

/**
 * Calculate revenue vs commissionable revenue
 * @param {Array} transactions - Array of transaction objects
 * @param {string} groupByField - Field to group by (optional)
 * @returns {Object} Revenue comparison data
 */
export function calculateRevenueComparison(transactions, groupByField = null) {
  const totalRevenue = sumField(transactions, 'amount');
  const commissionableRevenue = sumField(transactions, 'commissionableAmount');
  const nonCommissionableRevenue = totalRevenue - commissionableRevenue;
  const commissionablePercent = totalRevenue > 0 
    ? Math.round((commissionableRevenue / totalRevenue) * 10000) / 100 
    : 0;

  const result = {
    totalRevenue,
    commissionableRevenue,
    nonCommissionableRevenue,
    commissionablePercent
  };

  // Group by field if specified
  if (groupByField) {
    const grouped = groupBy(transactions, groupByField);
    
    Object.keys(grouped).forEach(key => {
      const group = grouped[key];
      const groupRevenue = sumField(group.items, 'amount');
      const groupCommissionable = sumField(group.items, 'commissionableAmount');
      
      group.revenue = groupRevenue;
      group.commissionable = groupCommissionable;
      group.nonCommissionable = groupRevenue - groupCommissionable;
      group.percentage = groupRevenue > 0 
        ? Math.round((groupCommissionable / groupRevenue) * 10000) / 100 
        : 0;
    });

    result.byGroup = grouped;
  }

  return result;
}

/**
 * Apply filters to a dataset
 * @param {Array} data - Array of data objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered data
 */
export function applyFilters(data, filters = {}) {
  if (!filters || Object.keys(filters).length === 0) {
    return data;
  }

  let filtered = [...data];

  // Apply date range filter
  if (filters.dateRange) {
    filtered = applyDateRangeFilter(filtered, filters.dateRange);
  }

  // Apply region filter (multi-select)
  if (filters.region && filters.region.length > 0) {
    filtered = filtered.filter(item => {
      const itemRegion = item.region || item.payeeRegion || '';
      // Check if item region starts with any of the selected regions
      return filters.region.some(r => itemRegion.startsWith(r) || itemRegion === r);
    });
  }

  // Apply plan filter (multi-select)
  if (filters.plan && filters.plan.length > 0) {
    filtered = filtered.filter(item => 
      filters.plan.includes(item.planId)
    );
  }

  // Apply payee filter (multi-select)
  if (filters.payee && filters.payee.length > 0) {
    filtered = filtered.filter(item => 
      filters.payee.includes(item.payeeId)
    );
  }

  // Apply product filter (multi-select)
  if (filters.product && filters.product.length > 0) {
    filtered = filtered.filter(item => 
      filters.product.includes(item.product) || 
      filters.product.includes(item.productCategory)
    );
  }

  // Apply role filter (multi-select)
  if (filters.role && filters.role.length > 0) {
    filtered = filtered.filter(item => 
      filters.role.includes(item.role) || 
      filters.role.includes(item.payeeRole)
    );
  }

  // Apply import batch filter (multi-select)
  if (filters.importBatch && filters.importBatch.length > 0) {
    filtered = filtered.filter(item => 
      filters.importBatch.includes(item.importBatchId)
    );
  }

  // Apply rule version filter (multi-select)
  if (filters.ruleVersion && filters.ruleVersion.length > 0) {
    filtered = filtered.filter(item => {
      if (!item.rulesApplied || item.rulesApplied.length === 0) {
        return false;
      }
      // Check if any of the item's rules match the filter
      return item.rulesApplied.some(rule => 
        filters.ruleVersion.includes(rule)
      );
    });
  }

  // Apply status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(item => 
      filters.status.includes(item.status)
    );
  }

  // Apply transaction type filter
  if (filters.transactionType && filters.transactionType.length > 0) {
    filtered = filtered.filter(item => 
      filters.transactionType.includes(item.transactionType)
    );
  }

  // Apply channel filter
  if (filters.channel && filters.channel.length > 0) {
    filtered = filtered.filter(item => 
      filters.channel.includes(item.channel)
    );
  }

  return filtered;
}

/**
 * Apply date range filter to data
 * @param {Array} data - Array of data objects
 * @param {Object} dateRange - Date range object with start and end dates
 * @returns {Array} Filtered data
 */
export function applyDateRangeFilter(data, dateRange) {
  if (!dateRange || (!dateRange.start && !dateRange.end)) {
    return data;
  }

  const startDate = dateRange.start ? new Date(dateRange.start) : null;
  const endDate = dateRange.end ? new Date(dateRange.end) : null;

  // Set end date to end of day
  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  return data.filter(item => {
    // Try multiple date fields
    const itemDate = new Date(
      item.transactionDate || 
      item.date || 
      item.calculatedDate || 
      item.paidDate || 
      item.scheduledDate ||
      item.importDate ||
      item.createdDate
    );

    if (isNaN(itemDate.getTime())) {
      return false; // Invalid date
    }

    // Check if date is within range
    if (startDate && itemDate < startDate) {
      return false;
    }
    if (endDate && itemDate > endDate) {
      return false;
    }

    return true;
  });
}

/**
 * Get date range from preset
 * @param {string} preset - Date range preset ('current-month', 'last-month', 'quarter', 'year', 'ytd')
 * @returns {Object} Date range object with start and end dates
 */
export function getDateRangeFromPreset(preset) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (preset) {
    case 'current-month':
      return {
        start: new Date(year, month, 1).toISOString().split('T')[0],
        end: new Date(year, month + 1, 0).toISOString().split('T')[0]
      };

    case 'last-month':
      return {
        start: new Date(year, month - 1, 1).toISOString().split('T')[0],
        end: new Date(year, month, 0).toISOString().split('T')[0]
      };

    case 'quarter': {
      const quarterStartMonth = Math.floor(month / 3) * 3;
      return {
        start: new Date(year, quarterStartMonth, 1).toISOString().split('T')[0],
        end: new Date(year, quarterStartMonth + 3, 0).toISOString().split('T')[0]
      };
    }

    case 'last-quarter': {
      const lastQuarterStartMonth = Math.floor(month / 3) * 3 - 3;
      const lastQuarterYear = lastQuarterStartMonth < 0 ? year - 1 : year;
      const adjustedMonth = lastQuarterStartMonth < 0 ? lastQuarterStartMonth + 12 : lastQuarterStartMonth;
      return {
        start: new Date(lastQuarterYear, adjustedMonth, 1).toISOString().split('T')[0],
        end: new Date(lastQuarterYear, adjustedMonth + 3, 0).toISOString().split('T')[0]
      };
    }

    case 'year':
      return {
        start: new Date(year, 0, 1).toISOString().split('T')[0],
        end: new Date(year, 11, 31).toISOString().split('T')[0]
      };

    case 'last-year':
      return {
        start: new Date(year - 1, 0, 1).toISOString().split('T')[0],
        end: new Date(year - 1, 11, 31).toISOString().split('T')[0]
      };

    case 'ytd':
      return {
        start: new Date(year, 0, 1).toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      };

    case 'last-30-days':
      return {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      };

    case 'last-90-days':
      return {
        start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      };

    default:
      return null;
  }
}

/**
 * Combine multiple filters with AND logic
 * @param {Array} data - Array of data objects
 * @param {Array} filterFunctions - Array of filter functions
 * @returns {Array} Filtered data
 */
export function combineFilters(data, filterFunctions) {
  if (!filterFunctions || filterFunctions.length === 0) {
    return data;
  }

  return filterFunctions.reduce((filtered, filterFn) => {
    return filterFn(filtered);
  }, data);
}

/**
 * Get unique values for a field (useful for filter options)
 * @param {Array} data - Array of data objects
 * @param {string} field - Field name
 * @returns {Array} Array of unique values
 */
export function getUniqueValues(data, field) {
  const values = new Set();
  
  data.forEach(item => {
    const value = item[field];
    if (value !== null && value !== undefined && value !== '') {
      values.add(value);
    }
  });

  return Array.from(values).sort();
}

/**
 * Get filter options from data
 * @param {Array} payees - Array of payee objects
 * @param {Array} plans - Array of plan objects
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Filter options
 */
export function getFilterOptions(payees, plans, transactions) {
  return {
    regions: getUniqueValues(payees, 'region').map(r => {
      // Extract base region (e.g., 'WEST' from 'WEST-001')
      const baseRegion = r.split('-')[0];
      return baseRegion;
    }).filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
    
    plans: plans.map(p => ({
      value: p.id,
      label: p.name
    })),
    
    payees: payees.map(p => ({
      value: p.id,
      label: p.name
    })),
    
    products: getUniqueValues(transactions, 'product'),
    
    productCategories: getUniqueValues(transactions, 'productCategory'),
    
    roles: getUniqueValues(payees, 'role'),
    
    importBatches: getUniqueValues(transactions, 'importBatchId').map(id => {
      const txn = transactions.find(t => t.importBatchId === id);
      return {
        value: id,
        label: txn?.importBatchName || id
      };
    }),
    
    statuses: getUniqueValues(transactions, 'status'),
    
    transactionTypes: getUniqueValues(transactions, 'transactionType'),
    
    channels: getUniqueValues(transactions, 'channel')
  };
}
