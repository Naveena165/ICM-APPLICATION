import React, { useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import Transactions from './components/Transactions';
import { PayeesList } from './payees';
import ClassificationRules from './components/rules/ClassificationRules';
import { ImportAssistants } from './import-center';
import { CompensationPlans } from './compensation-plans';
import { CustomRules } from './custom-rules';
import { ReportsAnalytics } from './reports';
import { Administration } from './administration';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const toggleTransactions = () => {
    setTransactionsOpen(!transactionsOpen);
    setRulesOpen(false);
  };

  const toggleRules = () => {
    setRulesOpen(!rulesOpen);
    setTransactionsOpen(false);
  };

  return (
    <div className="app">
      <header className="top-header">
        <div className="header-left">
          <div className="header-brand">
            <div className="brand-logo">💼</div>
            <span className="brand-name">Incentive Management</span>
          </div>
        </div>
        <div className="header-right">
          <div className="header-search-container">
            <span className="header-search-icon">🔍</span>
            <input type="text" placeholder="Search..." className="header-search-input" />
          </div>
          <div className="header-icons">
            <span className="header-icon">🔔</span>
            <span className="header-icon">⚙️</span>
            <span className="header-icon user-avatar">👤</span>
          </div>
        </div>
      </header>
      <div className="app-content">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="app-logo">💼</div>
            <div className="app-name">Incentive Management</div>
          </div>
          <nav className="sidebar-nav">
            {/* 1. Dashboard */}
            <div 
              className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} 
              onClick={() => navigateTo('dashboard')}
              title="Dashboard"
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Dashboard</span>
            </div>

            {/* 2. Transactions with Dropdown */}
            <div className="nav-item-group">
              <div 
                className={`nav-item ${transactionsOpen ? 'open' : ''} ${['transactions', 'base-transactions', 'credit-transactions', 'earnings', 'payments'].includes(currentPage) ? 'active' : ''}`}
                onClick={toggleTransactions}
                title="Transactions"
              >
                <span className="nav-icon">💳</span>
                <span className="nav-label">Transactions</span>
                <span className={`nav-arrow ${transactionsOpen ? 'open' : ''}`}>▼</span>
              </div>
              {transactionsOpen && (
                <div className="nav-submenu">
                  <div 
                    className={`nav-subitem ${currentPage === 'base-transactions' ? 'active' : ''}`}
                    onClick={() => navigateTo('base-transactions')}
                  >
                    <span className="nav-sublabel">Base Transactions</span>
                  </div>
                  <div 
                    className={`nav-subitem ${currentPage === 'credit-transactions' ? 'active' : ''}`}
                    onClick={() => navigateTo('credit-transactions')}
                  >
                    <span className="nav-sublabel">Credit Transactions</span>
                  </div>
                  <div 
                    className={`nav-subitem ${currentPage === 'earnings' ? 'active' : ''}`}
                    onClick={() => navigateTo('earnings')}
                  >
                    <span className="nav-sublabel">Earnings</span>
                  </div>
                  <div 
                    className={`nav-subitem ${currentPage === 'payments' ? 'active' : ''}`}
                    onClick={() => navigateTo('payments')}
                  >
                    <span className="nav-sublabel">Payments</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Payee Management */}
            <div 
              className={`nav-item ${currentPage === 'payees' ? 'active' : ''}`} 
              onClick={() => navigateTo('payees')}
              title="Payee Management"
            >
              <span className="nav-icon">👥</span>
              <span className="nav-label">Payee Management</span>
            </div>

            {/* 4. Compensation Plans */}
            <div 
              className={`nav-item ${currentPage === 'compensation-plans' ? 'active' : ''}`} 
              onClick={() => navigateTo('compensation-plans')}
              title="Compensation Plans"
            >
              <span className="nav-icon">📑</span>
              <span className="nav-label">Compensation Plans</span>
            </div>

            {/* 5. Rules with Dropdown */}
            <div className="nav-item-group">
              <div 
                className={`nav-item ${rulesOpen ? 'open' : ''} ${['rules', 'classification-rules', 'compensation-rules', 'custom-rules'].includes(currentPage) ? 'active' : ''}`}
                onClick={toggleRules}
                title="Rules"
              >
                <span className="nav-icon">📋</span>
                <span className="nav-label">Rules</span>
                <span className={`nav-arrow ${rulesOpen ? 'open' : ''}`}>▼</span>
              </div>
              {rulesOpen && (
                <div className="nav-submenu">
                  <div 
                    className={`nav-subitem ${currentPage === 'classification-rules' ? 'active' : ''}`}
                    onClick={() => navigateTo('classification-rules')}
                  >
                    <span className="nav-sublabel">Classification Rules</span>
                  </div>
                  <div 
                    className={`nav-subitem ${currentPage === 'compensation-rules' ? 'active' : ''}`}
                    onClick={() => navigateTo('compensation-rules')}
                  >
                    <span className="nav-sublabel">Compensation Rules</span>
                  </div>
                  <div 
                    className={`nav-subitem ${currentPage === 'custom-rules' ? 'active' : ''}`}
                    onClick={() => navigateTo('custom-rules')}
                  >
                    <span className="nav-sublabel">Custom Rules</span>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Import Center */}
            <div 
              className={`nav-item ${currentPage === 'import' ? 'active' : ''}`} 
              onClick={() => navigateTo('import')}
              title="Import Center"
            >
              <span className="nav-icon">📤</span>
              <span className="nav-label">Import Center</span>
            </div>

            {/* 7. Reports */}
            <div 
              className={`nav-item ${currentPage === 'reports' ? 'active' : ''}`} 
              onClick={() => navigateTo('reports')}
              title="Reports"
            >
              <span className="nav-icon">📈</span>
              <span className="nav-label">Reports</span>
            </div>

            {/* 8. Administration */}
            <div 
              className={`nav-item ${currentPage === 'administration' ? 'active' : ''}`} 
              onClick={() => navigateTo('administration')}
              title="Administration"
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">Administration</span>
            </div>
          </nav>
        </aside>
        <main className="app-main">
        {currentPage === 'dashboard' && <Dashboard />}
        
        {currentPage === 'payees' && <PayeesList />}

        {currentPage === 'base-transactions' && <Transactions initialTransactionType="base" isStandalonePage={true} />}

        {currentPage === 'credit-transactions' && <Transactions initialTransactionType="crediting" isStandalonePage={true} />}

        {currentPage === 'earnings' && <Transactions initialTransactionType="earnings" isStandalonePage={true} />}

        {currentPage === 'payments' && <Transactions initialTransactionType="payments" isStandalonePage={true} />}

        {currentPage === 'compensation-plans' && <CompensationPlans />}

        {currentPage === 'classification-rules' && <ClassificationRules />}

        {currentPage === 'compensation-rules' && <div style={{padding: '40px', textAlign: 'center'}}><h2>Compensation Rules</h2><p>Coming soon...</p></div>}

        {currentPage === 'custom-rules' && <CustomRules />}

        {currentPage === 'import' && <ImportAssistants />}

        {currentPage === 'reports' && <ReportsAnalytics />}

        {currentPage === 'administration' && <Administration />}
        </main>
      </div>
    </div>
  );
}

export default App;
