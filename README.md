# Custom Rules Module

## Overview
The Custom Rules module provides comprehensive functionality for configuring dynamic business logic for the calculation engine. It includes rule creation, editing, versioning, and simulation capabilities.

## Module Structure

```
custom-rules/
├── components/          # React components
│   ├── CustomRules.jsx              # Main rules list and management
│   ├── CustomRules.css              # Styles
│   └── CustomRulesSections.jsx      # Editor section components
├── utils/              # Utility functions (future)
├── styles/             # Additional styles (future)
├── index.js            # Central export point
└── README.md           # This file
```

## Components

### CustomRules (Main Component)
- **Purpose**: Main interface for managing custom business rules
- **Features**:
  - Rules listing with search and filters
  - Category filtering (Rate Table, Tier, Mapping, Flag, Exception)
  - Status filtering (Active, Inactive)
  - Summary statistics
  - Clone, version history, and delete actions
  - Export functionality
  - Rule editor integration

### CustomRuleEditor
- **Purpose**: Comprehensive rule creation and editing interface
- **Features**:
  - Tabbed interface with 5 sections
  - Rule header configuration
  - Lookup keys definition (up to 5 keys)
  - Output values configuration
  - Preview and simulation
  - Version management

### Section Components

#### RuleHeaderSection
- Rule name and category
- Lookup code (unique identifier)
- Status and priority
- Effective date range
- Calculation type
- Description and grouping
- Audit information

#### LookupKeysSection
- Up to 5 configurable lookup keys
- Multi-dimensional rule matching
- Key type selection (Product, Region, Customer Type, Role, Custom)
- Key value configuration
- Multi-key combination logic

#### OutputValuesSection
- Dynamic fields based on calculation type
- Rate/Value configuration
- Multiplier settings
- Threshold ranges
- Boolean flags
- Text values
- Validation rules

#### PreviewSection
- Rule configuration summary
- Sample transaction matching
- Output value simulation
- Match status visualization

#### VersioningSection
- Version history display
- Version comparison
- Change reason tracking
- Restore functionality
- Audit trail

## Usage

### Import the module
```javascript
import { CustomRules } from '../custom-rules';
// or
import CustomRules from '../custom-rules';
```

### Import specific components
```javascript
import { 
  CustomRules,
  RuleHeaderSection,
  LookupKeysSection,
  OutputValuesSection,
  PreviewSection,
  VersioningSection
} from '../custom-rules';
```

### Use in App.jsx
```javascript
import { CustomRules } from './custom-rules';

function App() {
  return (
    <div>
      <CustomRules />
    </div>
  );
}
```

## Rule Categories

### Rate Table
- Commission rates
- Discount rates
- Pricing tiers
- Percentage-based calculations

### Tier
- Performance tiers
- Territory multipliers
- Level-based adjustments
- Threshold-based rules

### Mapping
- Product category mapping
- Customer segment mapping
- Territory assignments
- Classification rules

### Flag
- Boolean indicators
- Eligibility flags
- Qualification markers
- Status indicators

### Exception
- Override rules
- Special case handling
- Exception processing
- Custom logic

## Calculation Types

### Rate
- Percentage-based calculations
- Commission rates
- Discount percentages
- Maximum: 100.00

### Value
- Fixed amount values
- Flat fees
- Bonus amounts
- Absolute values

### Multiplier
- Multiplication factors
- Scaling factors
- Typical range: 0.5 - 2.0
- Performance multipliers

### Boolean
- True/False flags
- Yes/No indicators
- Eligibility markers
- Status flags

### Threshold
- Min/Max ranges
- Boundary conditions
- Range-based rules
- Limit checking

### Text
- String values
- Category names
- Classification labels
- Descriptive values

## Lookup Keys

### Key 1: Product
- Product SKU
- Product category
- Product line

### Key 2: Region
- Geographic region
- Territory
- Sales area

### Key 3: Customer Type
- Customer segment
- Account type
- Customer tier

### Key 4: Role
- Payee role
- Job title
- Position type

### Key 5: Custom Attribute
- Custom field
- Special attribute
- Flexible key

## Versioning

### Version Management
- Automatic version increment on save
- Historical version retention
- Version comparison
- Restore capability

### Change Tracking
- Change reason required
- Modified by tracking
- Modification date
- Audit trail

### Version Matching
- Effective date-based matching
- Transaction date alignment
- Historical accuracy
- Calculation consistency

## Mock Data

### Sample Rules (3 total)
1. **Standard Commission Rate**
   - Category: Rate Table
   - Type: Rate
   - Status: Active
   - Priority: 10

2. **Premium Territory Multiplier**
   - Category: Tier
   - Type: Multiplier
   - Status: Active
   - Priority: 20

3. **Product Category Mapping**
   - Category: Mapping
   - Type: Text
   - Status: Inactive
   - Priority: 5

## Styling

### Design System
- **Colors**: Gradient theme (#0bafd5 to #26c07d)
- **Typography**: Bold headers with gradient text
- **Cards**: Rounded corners (12px) with hover effects
- **Tables**: Gradient headers with hover states
- **Badges**: Color-coded by category and status
- **Tabs**: Active state with gradient background

### Status Colors
- **Active**: Green (#e8f5e9 text #2e7d32)
- **Inactive**: Gray (#f5f5f5 text #757575)
- **Current**: Blue (#e3f2fd text #1565c0)
- **Historical**: Gray (#f5f5f5 text #757575)

### Category Colors
- **Rate Table**: Green (#e8f5e9 text #2e7d32)
- **Tier**: Blue (#e3f2fd text #1565c0)
- **Mapping**: Orange (#fff3e0 text #e65100)
- **Flag**: Purple (#f3e5f5 text #6a1b9a)
- **Exception**: Red (#ffebee text #c62828)

## Features

### Rule Management
- ✅ Create new rules
- ✅ Edit existing rules
- ✅ Clone rules
- ✅ Delete rules
- ✅ Export rules to CSV
- ✅ Search by name or code
- ✅ Filter by category and status

### Rule Configuration
- ✅ Header information
- ✅ Lookup keys (up to 5)
- ✅ Output values
- ✅ Preview and simulation
- ✅ Version management

### Validation
- ✅ Required field validation
- ✅ Unique lookup code
- ✅ Date range validation
- ✅ Priority range (1-100)
- ✅ Rate maximum (100.00)
- ✅ Threshold validation

## Future Enhancements

### Phase 1: API Integration
- Connect to backend rules engine
- Real-time validation
- Rule execution testing

### Phase 2: Advanced Features
- Bulk operations
- Rule templates
- Import/export functionality
- Advanced search

### Phase 3: Testing & Simulation
- Rule testing framework
- Transaction simulation
- Impact analysis
- Performance testing

### Phase 4: Collaboration
- Rule approval workflow
- Comments and annotations
- Change requests
- Team collaboration

## Related Modules

- **Compensation Plans**: Rule application in plans
- **Transactions**: Rule execution on transactions
- **Reports**: Rule impact analysis reports
- **Administration**: Rule permissions and access control

## Notes

- All components are self-contained
- Mock data should be replaced with API calls in production
- Module follows the same pattern as other ICM modules
- Ready for backend integration

## Completion Status

✅ **COMPLETE** - Custom Rules module successfully created and organized following the established pattern.
