/**
 * ReportCategories Component Tests
 * Tests for category rendering and navigation handlers
 * Requirements: 3.2
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ReportCategories from './ReportCategories';

describe('ReportCategories Component', () => {
  describe('Category Rendering', () => {
    test('should render the section header', () => {
      render(<ReportCategories />);
      expect(screen.getByText('Report Categories')).toBeInTheDocument();
    });

    test('should render all seven category cards', () => {
      render(<ReportCategories />);
      const categoryCards = document.querySelectorAll('.report-category-card');
      expect(categoryCards).toHaveLength(7);
    });

    test('should render Payee Reports category with correct data', () => {
      render(<ReportCategories />);
      expect(screen.getByText('Payee Reports')).toBeInTheDocument();
      expect(screen.getByText('👥')).toBeInTheDocument();
      expect(screen.getByText('Earnings, attainment, and performance by payee')).toBeInTheDocument();
    });

    test('should render Plan Reports category with correct data', () => {
      render(<ReportCategories />);
      expect(screen.getByText('Plan Reports')).toBeInTheDocument();
      expect(screen.getByText('📋')).toBeInTheDocument();
      expect(screen.getByText('6 reports')).toBeInTheDocument();
      expect(screen.getByText('Plan performance, cost, ROI, and comparison')).toBeInTheDocument();
    });

    test('should render Transaction Reports category with correct data', () => {
      render(<ReportCategories />);
      expect(screen.getByText('Transaction Reports')).toBeInTheDocument();
      expect(screen.getByText('📄')).toBeInTheDocument();
      expect(screen.getByText('Imported, credited, rejected, and adjusted transactions')).toBeInTheDocument();
    });

    test('should render Earnings & Payments category with correct data', () => {
      render(<ReportCategories />);
      expect(screen.getByText('Earnings & Payments')).toBeInTheDocument();
      expect(screen.getByText('💰')).toBeInTheDocument();
      expect(screen.getByText('Calculated earnings, pending and paid commissions')).toBeInTheDocument();
    });

    test('should render Cost & Profitability category with correct data', () => {
      render(<ReportCategories />);
      expect(screen.getByText('Cost & Profitability')).toBeInTheDocument();
      expect(screen.getByText('📊')).toBeInTheDocument();
      expect(screen.getByText('Cost of sales by product, region, and customer')).toBeInTheDocument();
    });

    test('should render Compliance & Audit category with correct data', () => {
      render(<ReportCategories />);
      expect(screen.getByText('Compliance & Audit')).toBeInTheDocument();
      expect(screen.getByText('✅')).toBeInTheDocument();
      expect(screen.getByText('Rule execution logs and calculation details')).toBeInTheDocument();
    });

    test('should render Executive Dashboards category with correct data', () => {
      render(<ReportCategories />);
      expect(screen.getByText('Executive Dashboards')).toBeInTheDocument();
      expect(screen.getByText('👔')).toBeInTheDocument();
      expect(screen.getByText('1 report')).toBeInTheDocument();
      expect(screen.getByText('High-level KPIs and strategic insights')).toBeInTheDocument();
    });

    test('should render correct report counts for all categories', () => {
      render(<ReportCategories />);
      
      // 5 categories have 5 reports each
      const fiveReports = screen.getAllByText('5 reports');
      expect(fiveReports).toHaveLength(5);
      
      // 1 category has 6 reports
      expect(screen.getByText('6 reports')).toBeInTheDocument();
      
      // 1 category has 1 report
      expect(screen.getByText('1 report')).toBeInTheDocument();
    });

    test('should render navigation arrows on all category cards', () => {
      render(<ReportCategories />);
      const arrows = screen.getAllByText('→');
      expect(arrows).toHaveLength(7);
    });

    test('should render all category icons', () => {
      render(<ReportCategories />);
      const icons = document.querySelectorAll('.category-icon');
      expect(icons).toHaveLength(7);
      
      expect(icons[0]).toHaveTextContent('👥');
      expect(icons[1]).toHaveTextContent('📋');
      expect(icons[2]).toHaveTextContent('📄');
      expect(icons[3]).toHaveTextContent('💰');
      expect(icons[4]).toHaveTextContent('📊');
      expect(icons[5]).toHaveTextContent('✅');
      expect(icons[6]).toHaveTextContent('👔');
    });

    test('should render all category descriptions', () => {
      render(<ReportCategories />);
      const descriptions = document.querySelectorAll('.category-description');
      expect(descriptions).toHaveLength(7);
    });

    test('should render categories in correct order', () => {
      render(<ReportCategories />);
      const categoryCards = document.querySelectorAll('.report-category-card');
      const categoryNames = Array.from(categoryCards).map(card => 
        card.querySelector('.category-name').textContent
      );
      
      expect(categoryNames).toEqual([
        'Payee Reports',
        'Plan Reports',
        'Transaction Reports',
        'Earnings & Payments',
        'Cost & Profitability',
        'Compliance & Audit',
        'Executive Dashboards'
      ]);
    });
  });

  describe('Navigation Handlers - Click Events', () => {
    test('should call onCategoryClick when Payee Reports is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const payeeCard = screen.getByText('Payee Reports').closest('.report-category-card');
      await user.click(payeeCard);
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('payee');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(1);
    });

    test('should call onCategoryClick when Plan Reports is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const planCard = screen.getByText('Plan Reports').closest('.report-category-card');
      await user.click(planCard);
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('plan');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(1);
    });

    test('should call onCategoryClick when Transaction Reports is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const transactionCard = screen.getByText('Transaction Reports').closest('.report-category-card');
      await user.click(transactionCard);
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('transaction');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(1);
    });

    test('should call onCategoryClick when Earnings & Payments is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const earningsCard = screen.getByText('Earnings & Payments').closest('.report-category-card');
      await user.click(earningsCard);
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('earnings');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(1);
    });

    test('should call onCategoryClick when Cost & Profitability is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const costCard = screen.getByText('Cost & Profitability').closest('.report-category-card');
      await user.click(costCard);
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('cost');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(1);
    });

    test('should call onCategoryClick when Compliance & Audit is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const complianceCard = screen.getByText('Compliance & Audit').closest('.report-category-card');
      await user.click(complianceCard);
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('compliance');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(1);
    });

    test('should call onCategoryClick when Executive Dashboards is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const executiveCard = screen.getByText('Executive Dashboards').closest('.report-category-card');
      await user.click(executiveCard);
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('executive');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(1);
    });

    test('should not throw error when onCategoryClick is not provided', async () => {
      const user = userEvent.setup();
      
      render(<ReportCategories />);
      
      const payeeCard = screen.getByText('Payee Reports').closest('.report-category-card');
      
      // Should not throw error
      await expect(user.click(payeeCard)).resolves.not.toThrow();
    });

    test('should handle multiple clicks on same category', async () => {
      const user = userEvent.setup();
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const payeeCard = screen.getByText('Payee Reports').closest('.report-category-card');
      await user.click(payeeCard);
      await user.click(payeeCard);
      await user.click(payeeCard);
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('payee');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(3);
    });

    test('should handle clicks on different categories', async () => {
      const user = userEvent.setup();
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const payeeCard = screen.getByText('Payee Reports').closest('.report-category-card');
      const planCard = screen.getByText('Plan Reports').closest('.report-category-card');
      
      await user.click(payeeCard);
      await user.click(planCard);
      
      expect(mockOnCategoryClick).toHaveBeenNthCalledWith(1, 'payee');
      expect(mockOnCategoryClick).toHaveBeenNthCalledWith(2, 'plan');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Navigation Handlers - Keyboard Events', () => {
    test('should call onCategoryClick when Enter key is pressed', () => {
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const payeeCard = screen.getByText('Payee Reports').closest('.report-category-card');
      fireEvent.keyPress(payeeCard, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('payee');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(1);
    });

    test('should call onCategoryClick when Space key is pressed', () => {
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const planCard = screen.getByText('Plan Reports').closest('.report-category-card');
      fireEvent.keyPress(planCard, { key: ' ', code: 'Space', charCode: 32 });
      
      expect(mockOnCategoryClick).toHaveBeenCalledWith('plan');
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(1);
    });

    test('should not call onCategoryClick for other keys', () => {
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const payeeCard = screen.getByText('Payee Reports').closest('.report-category-card');
      fireEvent.keyPress(payeeCard, { key: 'a', code: 'KeyA', charCode: 97 });
      fireEvent.keyPress(payeeCard, { key: 'Tab', code: 'Tab', charCode: 9 });
      fireEvent.keyPress(payeeCard, { key: 'Escape', code: 'Escape', charCode: 27 });
      
      expect(mockOnCategoryClick).not.toHaveBeenCalled();
    });

    test('should support keyboard navigation on all categories', () => {
      const mockOnCategoryClick = jest.fn();
      
      render(<ReportCategories onCategoryClick={mockOnCategoryClick} />);
      
      const categoryCards = document.querySelectorAll('.report-category-card');
      
      categoryCards.forEach((card, index) => {
        fireEvent.keyPress(card, { key: 'Enter', code: 'Enter', charCode: 13 });
      });
      
      expect(mockOnCategoryClick).toHaveBeenCalledTimes(7);
    });
  });

  describe('Accessibility', () => {
    test('should have role="button" on all category cards', () => {
      render(<ReportCategories />);
      const categoryCards = screen.getAllByRole('button');
      expect(categoryCards).toHaveLength(7);
    });

    test('should have tabIndex on all category cards', () => {
      render(<ReportCategories />);
      const categoryCards = document.querySelectorAll('.report-category-card');
      
      categoryCards.forEach(card => {
        expect(card).toHaveAttribute('tabIndex', '0');
      });
    });

    test('should be keyboard navigable', () => {
      render(<ReportCategories />);
      const categoryCards = document.querySelectorAll('.report-category-card');
      
      categoryCards.forEach(card => {
        expect(card).toHaveAttribute('role', 'button');
        expect(card).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('Component Structure', () => {
    test('should render with correct CSS class hierarchy', () => {
      render(<ReportCategories />);
      
      const section = document.querySelector('.report-categories-section');
      expect(section).toBeInTheDocument();
      
      const grid = section.querySelector('.report-categories-grid');
      expect(grid).toBeInTheDocument();
      
      const cards = grid.querySelectorAll('.report-category-card');
      expect(cards).toHaveLength(7);
    });

    test('should render category card with correct structure', () => {
      render(<ReportCategories />);
      
      const firstCard = document.querySelector('.report-category-card');
      
      expect(firstCard.querySelector('.category-icon')).toBeInTheDocument();
      expect(firstCard.querySelector('.category-content')).toBeInTheDocument();
      expect(firstCard.querySelector('.category-name')).toBeInTheDocument();
      expect(firstCard.querySelector('.category-count')).toBeInTheDocument();
      expect(firstCard.querySelector('.category-description')).toBeInTheDocument();
      expect(firstCard.querySelector('.category-arrow')).toBeInTheDocument();
    });

    test('should render grid layout', () => {
      render(<ReportCategories />);
      
      const grid = document.querySelector('.report-categories-grid');
      expect(grid).toBeInTheDocument();
      expect(grid.children).toHaveLength(7);
    });
  });
});
