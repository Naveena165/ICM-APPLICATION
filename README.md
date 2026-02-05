# Compensation Plans Module

This module contains all compensation plan-related functionality for the Incentive Compensation Management (ICM) system.

## 📁 Folder Structure

```
compensation-plans/
├── components/          # Plan management UI components
│   ├── CompensationPlans.jsx       # Main plans list and management view
│   ├── CompensationPlans.css       # Styles for plans view
│   ├── CreditCategory.jsx          # Credit category component
│   ├── CreditCategory.css          # Credit category styles
│   ├── CreditCategory.test.js      # Credit category tests
│   ├── QualifyingCriteria.jsx      # Qualifying criteria component
│   ├── QualifyingCriteria.css      # Qualifying criteria styles
│   ├── QualifyingCriteria.test.js  # Qualifying criteria tests
│   └── ParticipantTable.jsx        # Plan participants table
│
├── data/                # Mock data and data models
│   ├── mockPlans.js                # Sample plan data for development
│   └── mockCreditCategories.js     # Sample credit category data
│
├── models/              # Data models and business logic
│   └── CreditCategory.js           # Credit category model class
│
├── reports/             # Plan-specific reports
│   ├── PlanComparisonReport.jsx            # Compare multiple plans
│   ├── PlanComparisonReport.css            # Comparison report styles
│   ├── PlanComparisonReport.test.js        # Comparison report tests
│   ├── PlanPerformanceReport.jsx           # Plan performance metrics
│   ├── PlanPerformanceReport.test.js
│   ├── PlanCostReport.jsx                  # Plan cost analysis
│   ├── PlanCostReport.test.js
│   ├── PlanROIReport.jsx                   # Return on investment analysis
│   └── PlanROIReport.test.js
│
├── styles/              # Shared styles for plans module (future use)
│
├── index.js             # Central export file for the module
└── README.md            # This file
```

## 🎯 Module Purpose

The Compensation Plans module manages all aspects of compensation plan functionality:

- **Plan Management**: Create, view, edit, and manage compensation plans
- **Credit Categories**: Define and manage credit categories for plans
- **Qualifying Criteria**: Set up eligibility and qualifying rules
- **Participant Management**: Manage plan participants and assignments
- **Plan Reports**: Specialized reports for plan analysis and comparison
- **Data Models**: Business logic and data structures for plans

## 📦 Components

### Main Components

#### CompensationPlans
The primary interface for viewing and managing all compensation plans.
- View all active plans
- Search and filter plans
- Create new plans
- Navigate to plan details
- Manage plan lifecycle

#### CreditCategory
Component for managing credit categories within plans.
- Define credit types
- Set credit rules
- Configure credit calculations
- Manage category hierarchies

#### QualifyingCriteria
Component for defining plan eligibility and qualifying rules.
- Set eligibility criteria
- Define qualification thresholds
- Configure rule logic
- Manage criteria groups

#### ParticipantTable
Table component for displaying and managing plan participants.
- View assigned participants
- Add/remove participants
- Track participant status
- Manage participant roles

### Reports

#### PlanComparisonReport
Side-by-side comparison of multiple compensation plans.
- Compare plan structures
- Analyze differences
- Evaluate effectiveness
- Export comparisons

#### PlanPerformanceReport
Performance metrics and analytics for compensation plans.
- Track plan performance
- Monitor KPIs
- Analyze trends
- Identify issues

#### PlanCostReport
Cost analysis and budgeting for compensation plans.
- Total plan costs
- Cost breakdowns
- Budget tracking
- Cost projections

#### PlanROIReport
Return on investment analysis for compensation plans.
- Calculate ROI
- Compare investment vs. returns
- Analyze effectiveness
- Justify plan costs

## 🔌 Usage

### Importing Components

```javascript
// Import individual components
import { 
  CompensationPlans, 
  CreditCategory, 
  QualifyingCriteria,
  ParticipantTable 
} from './compensation-plans';

// Import reports
import { 
  PlanComparisonReport,
  PlanPerformanceReport,
  PlanCostReport,
  PlanROIReport 
} from './compensation-plans';

// Import data
import { mockPlans, mockCreditCategories } from './compensation-plans';

// Import models
import { CreditCategoryModel } from './compensation-plans';
```

### Using in App.jsx

```javascript
import { CompensationPlans } from './compensation-plans';

// In your component
{currentPage === 'compensation-plans' && <CompensationPlans />}
```

## 🧪 Testing

Component test files are included:
- `CreditCategory.test.js` - Credit category component tests
- `QualifyingCriteria.test.js` - Qualifying criteria tests
- `PlanComparisonReport.test.js` - Plan comparison report tests
- `PlanPerformanceReport.test.js` - Performance report tests
- `PlanCostReport.test.js` - Cost report tests
- `PlanROIReport.test.js` - ROI report tests

Run tests with: `npm test`

## 🎨 Styling

- Component-specific styles are co-located with components
- Shared styles can be added to the `styles/` folder
- Follows ICM design system guidelines
- Consistent with other modules (Dashboard, Payees, etc.)

## 📊 Data Models

### CreditCategory Model
Business logic for credit categories including:
- Category validation
- Credit calculations
- Rule evaluation
- Category hierarchies

### Mock Data
- `mockPlans.js` - Sample compensation plans
- `mockCreditCategories.js` - Sample credit categories

## 📝 Notes

- All files from the original scattered structure have been consolidated here
- Import paths in other modules may need to be updated to reference this new structure
- This module is self-contained and can be developed/tested independently
- Models folder contains business logic separate from UI components

## 🔄 Migration Status

✅ Components migrated from `src/components/compensation-plans/`
✅ Data migrated from `src/data/mockPlans.js` and `mockCreditCategories.js`
✅ Model migrated from `src/models/CreditCategory.js`
✅ Reports migrated from `src/components/reports/Plan*.jsx`
✅ Tests included for components and reports
✅ Central index.js created for easy imports

## 🔗 Related Modules

This module integrates with:
- **Payees Module** - Plan participants and assignments
- **Rules Module** - Plan rules and criteria
- **Reports Module** - Additional plan analytics
- **Dashboard Module** - Plan performance summaries

## 🚀 Future Enhancements

Potential additions to this module:
- Plan versioning and history
- Plan templates
- Advanced plan builder UI
- Plan simulation tools
- Bulk plan operations
- Plan approval workflows
