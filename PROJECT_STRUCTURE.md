# Project Structure Guide

This document explains how our codebase is organized and where to find things.

---

## 📁 Directory Overview

```
bdpa-irv-elections/
├── .github/                    # GitHub configuration
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
│
├── frontend/                   # Frontend application
│   ├── public/                # Static assets
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── images/
│   │
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/       # Shared components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Loading.jsx
│   │   │   ├── auth/         # Authentication components
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── PasswordReset.jsx
│   │   │   ├── elections/    # Election components
│   │   │   │   ├── ElectionCard.jsx
│   │   │   │   ├── VotingForm.jsx
│   │   │   │   └── ResultsDisplay.jsx
│   │   │   └── layout/       # Layout components
│   │   │       ├── Navbar.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── Footer.jsx
│   │   │
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ElectionView.jsx
│   │   │   ├── HistoryView.jsx
│   │   │   ├── Login.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── services/         # API service layer
│   │   │   ├── api.js       # Base API config
│   │   │   ├── authService.js
│   │   │   ├── electionService.js
│   │   │   └── userService.js
│   │   │
│   │   ├── utils/           # Helper functions
│   │   │   ├── irv.js      # IRV algorithm
│   │   │   ├── validation.js
│   │   │   ├── formatting.js
│   │   │   └── constants.js
│   │   │
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useElections.js
│   │   │   └── useRealtime.js
│   │   │
│   │   ├── context/         # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── styles/          # Stylesheets
│   │   │   ├── global.css
│   │   │   ├── variables.css
│   │   │   └── components/
│   │   │
│   │   ├── App.jsx          # Main app component
│   │   ├── index.js         # Entry point
│   │   └── routes.js        # Route definitions
│   │
│   ├── package.json
│   └── README.md
│
├── backend/                   # Backend application
│   ├── config/               # Configuration
│   │   ├── database.js
│   │   ├── auth.js
│   │   └── api.js
│   │
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── electionController.js
│   │   ├── userController.js
│   │   └── voteController.js
│   │
│   ├── models/               # Database models
│   │   ├── User.js
│   │   ├── Election.js
│   │   ├── Ballot.js
│   │   └── AuditLog.js
│   │
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── elections.js
│   │   ├── users.js
│   │   └── votes.js
│   │
│   ├── middleware/           # Express middleware
│   │   ├── auth.js          # JWT verification
│   │   ├── validation.js    # Input validation
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── errorHandler.js  # Error handling
│   │
│   ├── services/             # Business logic
│   │   ├── authService.js
│   │   ├── electionService.js
│   │   ├── irvService.js    # IRV calculations
│   │   └── apiService.js    # BDPA API wrapper
│   │
│   ├── utils/                # Helper functions
│   │   ├── logger.js
│   │   ├── validators.js
│   │   ├── crypto.js
│   │   └── constants.js
│   │
│   ├── tests/                # Test files
│   │   ├── unit/
│   │   └── integration/
│   │
│   ├── server.js             # Server entry point
│   ├── app.js                # Express app setup
│   ├── package.json
│   └── README.md
│
├── database/                  # Database files
│   ├── migrations/           # Database migrations
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_elections.sql
│   │   └── 003_create_audit_logs.sql
│   │
│   ├── seeds/                # Seed data
│   │   ├── dev/
│   │   └── test/
│   │
│   └── schema.sql            # Complete schema
│
├── docs/                      # Documentation
│   ├── API.md                # Internal API docs
│   ├── SETUP.md              # Setup guide
│   ├── WORKFLOW.md           # Development workflow
│   ├── IRV_ALGORITHM.md      # IRV explanation
│   └── DEPLOYMENT.md         # Deployment guide
│
├── scripts/                   # Utility scripts
│   ├── setup.sh              # Initial setup
│   ├── seed-db.js            # Seed database
│   ├── test-api.sh           # Test API endpoints
│   └── deploy.sh             # Deployment script
│
├── tests/                     # Test suite
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests
│
├── .github/                   # GitHub config
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── CONTRIBUTING.md           # Contribution guide
├── README.md                 # Main readme
└── package.json              # Root dependencies
```

---

## 🎯 Where to Find Things

### Authentication & Authorization
- **Frontend**: `frontend/src/components/auth/`
- **Backend**: `backend/controllers/authController.js`
- **Middleware**: `backend/middleware/auth.js`
- **Services**: `backend/services/authService.js`

### Elections
- **Frontend Components**: `frontend/src/components/elections/`
- **Election Page**: `frontend/src/pages/ElectionView.jsx`
- **Backend Controller**: `backend/controllers/electionController.js`
- **API Service**: `frontend/src/services/electionService.js`

### IRV Algorithm
- **Frontend Calculation**: `frontend/src/utils/irv.js`
- **Backend Calculation**: `backend/services/irvService.js`
- **Documentation**: `docs/IRV_ALGORITHM.md`

### Database
- **Models**: `backend/models/`
- **Migrations**: `database/migrations/`
- **Seeds**: `database/seeds/`
- **Schema**: `database/schema.sql`

### API Integration
- **BDPA API Wrapper**: `backend/services/apiService.js`
- **API Configuration**: `backend/config/api.js`
- **Frontend API Service**: `frontend/src/services/api.js`

### User Interface
- **Components**: `frontend/src/components/`
- **Pages**: `frontend/src/pages/`
- **Styles**: `frontend/src/styles/`
- **Layout**: `frontend/src/components/layout/`

### Testing
- **Unit Tests**: `tests/unit/`
- **Integration Tests**: `tests/integration/`
- **E2E Tests**: `tests/e2e/`
- **Backend Tests**: `backend/tests/`

---

## 📝 File Naming Conventions

### Frontend (React)

**Components**
- PascalCase: `UserProfile.jsx`, `ElectionCard.jsx`
- One component per file
- Index files: `index.js` (exports multiple components)

**Utilities**
- camelCase: `formatDate.js`, `validateEmail.js`
- Descriptive names

**Styles**
- kebab-case: `election-card.css`, `user-profile.css`
- Match component name

### Backend (Node.js)

**Routes**
- Plural nouns: `elections.js`, `users.js`
- RESTful naming

**Controllers**
- Singular + Controller: `userController.js`, `electionController.js`

**Models**
- PascalCase singular: `User.js`, `Election.js`

**Services**
- Singular + Service: `authService.js`, `electionService.js`

**Middleware**
- camelCase: `authenticate.js`, `validateInput.js`

---

## 🔍 Code Organization Principles

### 1. Separation of Concerns

**Frontend**
```
Presentation Layer (Components)
    ↓
Business Logic (Services/Utils)
    ↓
State Management (Context/Hooks)
    ↓
API Layer (Services)
```

**Backend**
```
Routes (URL handling)
    ↓
Controllers (Request/Response)
    ↓
Services (Business Logic)
    ↓
Models (Data Layer)
```

### 2. Component Structure

**Good Component Organization**
```jsx
// Imports at top
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import './ElectionCard.css';

// Component
export function ElectionCard({ election }) {
  // Hooks
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Event handlers
  const handleVote = () => { /* ... */ };
  
  // Effects
  useEffect(() => { /* ... */ }, []);
  
  // Render
  return (
    <div className="election-card">
      {/* JSX */}
    </div>
  );
}
```

### 3. Service Layer Pattern

**API Service Example**
```javascript
// frontend/src/services/electionService.js
import api from './api';

export const electionService = {
  getAllElections: () => api.get('/elections'),
  getElection: (id) => api.get(`/elections/${id}`),
  createElection: (data) => api.post('/elections', data),
  updateElection: (id, data) => api.patch(`/elections/${id}`, data),
  deleteElection: (id) => api.delete(`/elections/${id}`)
};
```

---

## 🔧 Configuration Files

### Root Level
- `.env` - Environment variables (local, not committed)
- `.env.example` - Environment template (committed)
- `.gitignore` - Git ignore rules
- `package.json` - Project dependencies

### Frontend
- `package.json` - Frontend dependencies
- `.eslintrc.js` - Linting rules
- `jsconfig.json` - JavaScript config

### Backend
- `package.json` - Backend dependencies
- `.eslintrc.js` - Linting rules
- `nodemon.json` - Dev server config

---

## 🚀 Quick Reference

### Adding a New Feature

1. **Create Issue**: `.github/ISSUE_TEMPLATE/feature_request.md`
2. **Create Branch**: `git checkout -b feature/your-feature`
3. **Frontend Components**: `frontend/src/components/`
4. **Backend Logic**: `backend/controllers/` or `backend/services/`
5. **Database Changes**: `database/migrations/`
6. **Tests**: `tests/`
7. **Documentation**: `docs/`
8. **Create PR**: `.github/PULL_REQUEST_TEMPLATE.md`

### Finding Code

**"Where is the login logic?"**
- Frontend: `frontend/src/components/auth/LoginForm.jsx`
- Backend: `backend/controllers/authController.js`

**"Where is the IRV calculation?"**
- Frontend: `frontend/src/utils/irv.js`
- Backend: `backend/services/irvService.js`

**"Where are the API calls made?"**
- Frontend: `frontend/src/services/`

**"Where is user data stored?"**
- Model: `backend/models/User.js`
- Migration: `database/migrations/001_create_users.sql`

---

## 📚 Additional Resources

- [README.md](../README.md) - Project overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - How to contribute
- [docs/SETUP.md](./SETUP.md) - Setup instructions
- [docs/API.md](./API.md) - API documentation
- [docs/WORKFLOW.md](./WORKFLOW.md) - Development workflow

---

**Questions?** Open an issue or ask on Slack!
