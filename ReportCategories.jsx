import React from 'react';
import './ReportCategories.css';

const ReportCategories = ({ onCategoryClick }) => {
  // 7 report categories as per requirements 3.2.2
  const categories = [
    { 
      id: 'payee', 
      name: 'Payee Reports', 
      icon: '👥', 
      count: 5,
      description: 'Earnings, attainment, and performance by payee'
    },
    { 
      id: 'plan', 
      name: 'Plan Reports', 
      icon: '📋', 
      count: 6,
      description: 'Plan performance, cost, ROI, and comparison'
    },
    { 
      id: 'transaction', 
      name: 'Transaction Reports', 
      icon: '📄', 
      count: 5,
      description: 'Imported, credited, rejected, and adjusted transactions'
    },
    { 
      id: 'earnings', 
      name: 'Earnings & Payments', 
      icon: '💰', 
      count: 5,
      description: 'Calculated earnings, pending and paid commissions'
    },
    { 
      id: 'cost', 
      name: 'Cost & Profitability', 
      icon: '📊', 
      count: 5,
      description: 'Cost of sales by product, region, and customer'
    },
    { 
      id: 'compliance', 
      name: 'Compliance & Audit', 
      icon: '✅', 
      count: 5,
      description: 'Rule execution logs and calculation details'
    },
    { 
      id: 'executive', 
      name: 'Executive Dashboards', 
      icon: '👔', 
      count: 1,
      description: 'High-level KPIs and strategic insights'
    }
  ];

  const handleCategoryClick = (categoryId) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
  };

  return (
    <div className="report-categories-section">
      <h2>Report Categories</h2>
      <div className="report-categories-grid">
        {categories.map(category => (
          <div 
            key={category.id} 
            className="report-category-card"
            onClick={() => handleCategoryClick(category.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCategoryClick(category.id);
              }
            }}
          >
            <div className="category-icon">{category.icon}</div>
            <div className="category-content">
              <div className="category-name">{category.name}</div>
              <div className="category-count">{category.count} report{category.count !== 1 ? 's' : ''}</div>
              <div className="category-description">{category.description}</div>
            </div>
            <div className="category-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCategories;
