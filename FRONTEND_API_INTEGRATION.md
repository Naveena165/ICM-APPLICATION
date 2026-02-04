# Frontend API Integration Guide

This document describes how the Credit Rules frontend integrates with the backend API.

## Overview

The Credit Rules management UI has been updated to use real API endpoints instead of mock data. This enables full CRUD operations with persistent storage in the database.

## Architecture

```
┌─────────────────────────────────────────┐
│   CreditRules.jsx Component             │
│   - UI State Management                 │
│   - User Interactions                   │
│   - Data Transformation                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   creditRulesApi.js Service             │
│   - HTTP Request Handling               │
│   - Error Management                    │
│   - Response Formatting                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Backend API (Express Server)          │
│   - Route Handling                      │
│   - Business Logic                      │
│   - Database Operations                 │
└─────────────────────────────────────────┘
```

## Setup Instructions

### 1. Backend Setup

First, ensure the backend server is running:

```bash
cd ICM/backend

# Install dependencies (if not already done)
npm install

# Create .env file from example
cp .env.example .env

# Initialize the database
node scripts/init-db.js

# Start the server
npm start
```

The backend server will start on `http://localhost:3001`.

### 2. Frontend Setup

Configure the frontend to connect to the backend:

```bash
cd ICM

# Create .env file from example
cp .env.example .env

# Verify the API URL is correct
# REACT_APP_API_BASE_URL=http://localhost:3001

# Install dependencies (if not already done)
npm install

# Start the frontend
npm start
```

The frontend will start on `http://localhost:3000`.

## Data Transformation

The frontend and backend use different data formats. The `CreditRules.jsx` component handles transformation:

### Frontend Format (Component State)

```javascript
{
  id: 'CR-123',
  ruleName: 'Direct Sales Commission',
  priority: 1,
  effectiveStartDate: '2025-01-01',
  effectiveEndDate: '2025-12-31',
  status: 'Active',
  ruleType: 'Attribute-Based',
  description: 'Standard commission...',
  transactionFilters: {
    transactionType: 'Sale',
    customerType: 'Enterprise',
    // ...
  },
  creditAssignments: [
    {
      payeeType: 'Primary',
      hierarchyRole: 'Sales Rep',
      creditType: 'Full',
      percentage: 100
    }
  ]
}
```

### Backend Format (API)

```javascript
{
  rule_id: 'CR-123',
  rule_name: 'Direct Sales Commission',
  priority: 1,
  effective_start_date: '2025-01-01',
  effective_end_date: '2025-12-31',
  status: 'Active',
  rule_type: 'Attribute-Based',
  description: 'Standard commission...',
  filters: [
    {
      transaction_type: 'Sale',
      customer_type: 'Enterprise',
      // ...
    }
  ],
  payee_assignments: [
    {
      payee_type: 'Primary',
      hierarchy_role: 'Sales Rep',
      credit_type: 'Full',
      split_percentage: 100
    }
  ]
}
```

## API Operations

### List Rules

```javascript
// Component calls
const rules = await creditRulesApi.listRules({
  status: 'Active',
  include_details: true,
  is_current_version: true
});

// API endpoint
GET /api/credit-rules?status=Active&include_details=true&is_current_version=true
```

### Create Rule

```javascript
// Component calls
const newRule = await creditRulesApi.createRule(apiData);

// API endpoint
POST /api/credit-rules
Content-Type: application/json
x-user-id: admin

{
  rule_name: "...",
  rule_type: "...",
  // ...
}
```

### Update Rule

```javascript
// Component calls
const updatedRule = await creditRulesApi.updateRule(ruleId, apiData);

// API endpoint
PUT /api/credit-rules/:ruleId
Content-Type: application/json
x-user-id: admin

{
  rule_name: "...",
  // ...
}
```

### Activate/Deactivate Rule

```javascript
// Component calls
await creditRulesApi.activateRule(ruleId);
await creditRulesApi.deactivateRule(ruleId);

// API endpoints
POST /api/credit-rules/:ruleId/activate
DELETE /api/credit-rules/:ruleId
```

## Error Handling

The integration includes comprehensive error handling:

### Network Errors

```javascript
try {
  await creditRulesApi.createRule(data);
} catch (error) {
  if (error.status === 0) {
    // Network error - backend not reachable
    console.error('Cannot connect to backend server');
  }
}
```

### Validation Errors

```javascript
try {
  await creditRulesApi.createRule(data);
} catch (error) {
  if (error.status === 400) {
    // Validation error
    console.error('Validation failed:', error.message);
  }
}
```

### Server Errors

```javascript
try {
  await creditRulesApi.createRule(data);
} catch (error) {
  if (error.status === 500) {
    // Server error
    console.error('Server error:', error.message);
  }
}
```

## UI States

The component manages several UI states:

### Loading State

Displayed when fetching data from the API:

```javascript
{isLoading && (
  <div className="loading-state">
    <div className="spinner"></div>
    <p>Loading credit rules...</p>
  </div>
)}
```

### Error State

Displayed when API calls fail:

```javascript
{loadError && (
  <div className="error-state">
    <div className="alert alert-error">
      <strong>Error:</strong> {loadError}
    </div>
    <button onClick={loadRules}>Retry</button>
  </div>
)}
```

### Success State

Displayed after successful operations:

```javascript
{submitSuccess && (
  <div className="alert alert-success">
    <strong>Success!</strong> Rule created successfully.
  </div>
)}
```

## Testing the Integration

### 1. Manual Testing

1. Start both backend and frontend servers
2. Navigate to Credit Rules page
3. Verify rules load from database
4. Create a new rule and verify it persists
5. Edit a rule and verify version increments
6. Toggle rule status and verify changes persist
7. Test error scenarios (stop backend, invalid data)

### 2. API Testing

Use the backend API testing guide:

```bash
# See ICM/backend/API_TESTING_GUIDE.md
```

### 3. Browser DevTools

Monitor network requests in browser DevTools:

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Perform operations in UI
5. Verify API calls and responses

## Troubleshooting

### Backend Not Reachable

**Symptom**: "Network error" or "Cannot connect to backend"

**Solution**:
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check backend logs for errors
3. Verify CORS is configured correctly
4. Check firewall settings

### CORS Errors

**Symptom**: "CORS policy" errors in browser console

**Solution**:
1. Verify backend CORS configuration in `server.js`
2. Ensure frontend URL is allowed
3. Check CORS_ORIGIN in backend `.env`

### Data Not Persisting

**Symptom**: Changes don't persist after page refresh

**Solution**:
1. Verify database file exists: `ICM/backend/db/credit_rules.db`
2. Check database permissions
3. Verify API calls are successful (check Network tab)
4. Check backend logs for database errors

### Version Conflicts

**Symptom**: "non-current version" errors

**Solution**:
1. Reload rules list to get latest versions
2. Verify `is_current_version` flag is correct
3. Check database for duplicate current versions

## Future Enhancements

Potential improvements to the integration:

1. **Caching**: Implement client-side caching to reduce API calls
2. **Optimistic Updates**: Update UI immediately, rollback on error
3. **WebSocket**: Real-time updates when rules change
4. **Pagination**: Handle large numbers of rules efficiently
5. **Batch Operations**: Support bulk create/update/delete
6. **Offline Support**: Queue operations when backend unavailable
7. **Request Cancellation**: Cancel in-flight requests on navigation
8. **Retry Logic**: Automatic retry with exponential backoff

## Related Documentation

- [Backend API Documentation](./backend/README.md)
- [API Testing Guide](./backend/API_TESTING_GUIDE.md)
- [Database Schema](./database/README.md)
- [Services README](./src/services/README.md)
