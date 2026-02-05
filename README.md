# Payees Management Module

This module contains all payee-related functionality for the Incentive Compensation Management (ICM) system.

## 📁 Folder Structure

```
payees/
├── components/          # Payee management UI components
│   ├── PayeesList.jsx          # Main payees list view
│   ├── PayeesList.css          # Styles for payees list
│   ├── AddPayee.jsx            # Add new payee form
│   ├── AddPayee.css            # Styles for add payee form
│   ├── PayeeDetail.jsx         # Single payee detail view
│   ├── PayeeDetail.css         # Styles for payee detail
│   └── PayeeDetails.jsx        # Alternative payee details component
│
├── data/                # Mock data and data models
│   └── mockPayees.js           # Sample payee data for development
│
├── reports/             # Payee-specific reports
│   ├── PayeeAttainmentReport.jsx           # Payee goal attainment report
│   ├── PayeeAttainmentReport.css           # Styles for attainment report
│   ├── PayeeAttainmentReport.test.js       # Tests for attainment report
│   ├── PayeeCommissionHistoryReport.jsx    # Commission history by payee
│   ├── PayeeCommissionHistoryReport.test.js
│   ├── EarningsByPayeeReport.jsx           # Earnings breakdown by payee
│   ├── EarningsByPayeeReport.test.js
│   ├── OverpaidUnderpaidPayeesReport.jsx   # Payment discrepancy report
│   └── OverpaidUnderpaidPayeesReport.test.js
│
├── styles/              # Shared styles for payees module (future use)
│
├── index.js             # Central export file for the module
└── README.md            # This file
```

## 🎯 Module Purpose

The Payees module manages all aspects of payee (commission recipients) functionality:

- **Payee Management**: View, add, edit, and manage payee information
- **Payee Details**: Detailed view of individual payee records
- **Payee Reports**: Specialized reports focused on payee performance and earnings
- **Data Models**: Mock data and data structures for payees

## 📦 Components

### Main Components

#### PayeesList
The primary interface for viewing and managing all payees in the system.
- Search and filter payees
- View payee summary information
- Navigate to detailed payee views
- Add new payees

#### AddPayee
Form component for creating new payee records.
- Input validation
- Field management
- Integration with payee data store

#### PayeeDetail / PayeeDetails
Detailed view of individual payee information.
- Complete payee profile
- Commission history
- Performance metrics
- Edit capabilities

### Reports

#### PayeeAttainmentReport
Shows how payees are performing against their goals and quotas.

#### PayeeCommissionHistoryReport
Historical view of commission payments for each payee.

#### EarningsByPayeeReport
Breakdown of earnings by individual payee.

#### OverpaidUnderpaidPayeesReport
Identifies payment discrepancies and reconciliation needs.

## 🔌 Usage

### Importing Components

```javascript
// Import individual components
import { PayeesList, AddPayee, PayeeDetail } from './payees';

// Import reports
import { PayeeAttainmentReport, EarningsByPayeeReport } from './payees';

// Import data
import { mockPayees } from './payees';
```

### Using in App.jsx

```javascript
import { PayeesList } from './payees';

// In your component
{currentPage === 'payees' && <PayeesList />}
```

## 🧪 Testing

All report components include test files:
- `*.test.js` files contain unit and integration tests
- Run tests with: `npm test`

## 🎨 Styling

- Component-specific styles are co-located with components
- Shared styles can be added to the `styles/` folder
- Follows ICM design system guidelines

## 📝 Notes

- All files from the original scattered structure have been consolidated here
- Import paths in other modules may need to be updated to reference this new structure
- This module is self-contained and can be developed/tested independently

## 🔄 Migration Status

✅ Components migrated from `src/components/payees/`
✅ Data migrated from `src/data/mockPayees.js`
✅ Reports migrated from `src/components/reports/Payee*.jsx`
✅ Tests included for all reports
✅ Central index.js created for easy imports
