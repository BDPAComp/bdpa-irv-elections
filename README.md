# BDPA NHSCC 2026 - IRV Elections System

🗳️ **A secure electronic voting system using Instant-Runoff Voting (IRV)**

Built by [Your Team Name] for the BDPA National High School Computer Competition 2026

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Team Workflow](#team-workflow)
- [Contributing](#contributing)
- [Team Members](#team-members)

---

## 🎯 About the Project

This application allows voters to participate in elections using Instant-Runoff Voting (IRV), where voters rank candidates from most to least favored. The system supports four user types:

- **Voters** - Cast and manage their ranked-choice ballots
- **Moderators** - Manage voter eligibility for elections
- **Administrators** - Create and manage elections and users
- **Reporters** - View historical election results

---

## ✨ Features

### Part 1: Core Features
- ✅ Secure user authentication with password recovery
- ✅ Role-based access control (4 user types)
- ✅ Personalized dashboards for each user type
- ✅ Real-time election updates (no page refresh needed)
- ✅ Complete election history with sorting and filtering
- ✅ IRV algorithm implementation
- ✅ Mobile-responsive design
- ✅ Security hardening (XSS/SQL injection prevention)
- ✅ Performance optimization with caching

### Part 2: Enhanced Features
- ✨ Election audit logs
- ✨ Detailed IRV results with elimination rounds
- ⏰ Expiration warnings for closing elections
- 🔐 Security audit log (last 5 logins)
- ✏️ User profile self-editing
- 👥 Reporter assignment system
- 🕐 Human-friendly timestamps
- 📝 Open registration with admin approval
- ⏱️ 5-minute vote change window

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React / Vue / Angular / Your Choice]
- **Styling**: [Tailwind CSS / Bootstrap / CSS / Your Choice]
- **State Management**: [Redux / Vuex / Your Choice]

### Backend
- **Runtime**: [Node.js / Python / Your Choice]
- **Framework**: [Express / Flask / Django / Your Choice]
- **Database**: [PostgreSQL / MongoDB / MySQL / Your Choice]

### External Services
- **API**: BDPA Elections IRV API (Required)
- **API Base URL**: `https://elections-irv.api.hscc.bdpa.org/v1`

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js (if using Node backend/frontend)
node --version  # Should be v16+ or higher

# Python (if using Python backend)
python --version  # Should be 3.8+

# Git
git --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-team/bdpa-irv-elections.git
   cd bdpa-irv-elections
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API key and other configuration
   ```

3. **Install dependencies**
   
   For Node.js:
   ```bash
   npm install
   ```
   
   For Python:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database**
   ```bash
   # Add your database setup commands here
   npm run db:setup
   # or
   python manage.py migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   python app.py
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

### API Key Setup

1. Contact BDPA NHSCC staff or use the BDPABot on Slack to get your API key
2. Add to `.env` file:
   ```
   API_KEY=your-api-key-here
   API_BASE_URL=https://elections-irv.api.hscc.bdpa.org/v1
   ```
3. **NEVER commit your API key to GitHub!**

---

## 📁 Project Structure

```
bdpa-irv-elections/
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service calls
│   │   ├── utils/        # Helper functions
│   │   └── App.js        # Main app component
│   ├── public/
│   └── package.json
│
├── backend/              # Backend application
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── middleware/      # Authentication, etc.
│   ├── utils/           # Helper functions
│   └── server.js        # Main server file
│
├── database/            # Database scripts
│   ├── migrations/
│   └── seeds/
│
├── docs/                # Documentation
│   ├── API.md          # Internal API docs
│   ├── SETUP.md        # Detailed setup guide
│   └── WORKFLOW.md     # Development workflow
│
├── tests/              # Test files
│   ├── unit/
│   └── integration/
│
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore rules
├── README.md           # This file
└── package.json        # Dependencies
```

---

## 📚 API Documentation

Full API documentation: https://hscc18f802d3.docs.apiary.io

### Key Endpoints

```
GET    /info                              # System metadata
GET    /elections                         # List all elections
POST   /elections                         # Create election
GET    /elections/:id                     # Get election details
PATCH  /elections/:id                     # Update election
DELETE /elections/:id                     # Delete election
GET    /elections/:id/ballots             # Get all ballots
PUT    /elections/:id/ballots/:voter_id   # Cast/update vote
DELETE /elections/:id/ballots/:voter_id   # Delete vote
```

**Important Notes:**
- All requests require `Authorization: bearer YOUR-API-KEY` header
- All request/response bodies are JSON
- Timestamps are in milliseconds since Unix epoch
- Rate limit: 10 requests/second per API key

---

## 👥 Team Workflow

### Branching Strategy

- `main` - Production-ready code (protected branch)
- `dev` - Development integration branch
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/update-name` - Documentation updates

### Development Process

1. **Create a branch**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Add user authentication system"
   ```

3. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to GitHub
   - Click "Compare & pull request"
   - Add description of changes
   - Request review from teammates
   - Assign to yourself

5. **Code Review**
   - At least one team member reviews
   - Address any feedback
   - Once approved, merge into `dev`

6. **Testing**
   - Test on `dev` branch
   - When stable, merge `dev` into `main`

### Commit Message Guidelines

Use clear, descriptive commit messages:

```bash
# Good ✅
git commit -m "Add IRV vote counting algorithm"
git commit -m "Fix login form validation bug"
git commit -m "Update dashboard UI for mobile responsiveness"

# Bad ❌
git commit -m "Updates"
git commit -m "Fixed stuff"
git commit -m "WIP"
```

---

## 🤝 Contributing

### Before You Start
1. Check existing issues and pull requests
2. Discuss major changes with the team
3. Follow the code style guide (see below)

### Code Style

- Use consistent indentation (2 or 4 spaces)
- Add comments for complex logic
- Write descriptive variable names
- Keep functions small and focused
- Write tests for new features

### Pull Request Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How did you test this?

## Checklist
- [ ] Code follows style guide
- [ ] Comments added for complex code
- [ ] Tests pass
- [ ] No console errors
- [ ] Tested on mobile
```

---

## 👨‍💻 Team Members

- **Team Lead**: [Name] - [@github-username]
- **Frontend Developer**: [Name] - [@github-username]
- **Backend Developer**: [Name] - [@github-username]
- **UI/UX Designer**: [Name] - [@github-username]
- **QA Tester**: [Name] - [@github-username]

---

## 📝 License

This project is created for the BDPA NHSCC 2026 competition.

---

## 🙏 Acknowledgments

- BDPA NHSCC for hosting the competition
- API provided by BDPA Elections, Inc.
- All team members for their hard work!

---

## 📞 Contact

Questions? Reach out to the team on [Slack] `https://app.slack.com/client/T01P6S2FCQ7/C0B2KRC8PMZ` or open an issue!

**Good luck and happy coding! 🚀**
