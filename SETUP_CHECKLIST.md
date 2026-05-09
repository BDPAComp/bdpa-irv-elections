# GitHub Repository Setup Checklist

Quick checklist for setting up your BDPA NHSCC 2026 IRV Elections repository.

---

## 🎯 Initial Repository Setup

### Step 1: Create the Repository

- [ ] Go to [GitHub](https://github.com)
- [ ] Click "New Repository" (green button)
- [ ] Repository name: `bdpa-irv-elections` (or your team name)
- [ ] Description: "BDPA NHSCC 2026 - IRV Elections System"
- [ ] Choose: **Private** (for now, can make public later)
- [ ] ✅ Check "Add a README file"
- [ ] ✅ Add .gitignore: Choose "Node" or "Python" template
- [ ] ✅ Choose a license: MIT (optional)
- [ ] Click "Create repository"

---

## 👥 Step 2: Add Team Members

- [ ] Go to repository Settings → Collaborators
- [ ] Click "Add people"
- [ ] Add each team member by their GitHub username
- [ ] Set their role: **Write** (allows push access)
- [ ] Each member will receive an email invitation
- [ ] Team members must accept the invitation

---

## 🔧 Step 3: Configure Repository Settings

### Branch Protection (Recommended)

- [ ] Go to Settings → Branches
- [ ] Click "Add rule"
- [ ] Branch name pattern: `main`
- [ ] ✅ Check "Require pull request reviews before merging"
- [ ] ✅ Check "Require review from Code Owners" (optional)
- [ ] Number of approvals: **1**
- [ ] ✅ Check "Dismiss stale pull request approvals when new commits are pushed"
- [ ] Click "Create" or "Save changes"

### Other Settings

- [ ] Settings → General → Features
  - ✅ Enable Issues
  - ✅ Enable Projects (optional, for task tracking)
  - ✅ Enable Wikis (optional, for documentation)
- [ ] Settings → General → Pull Requests
  - ✅ Allow squash merging
  - ✅ Automatically delete head branches

---

## 📁 Step 4: Upload Initial Files

### Team Lead Does This:

1. **Clone the repository locally**
   ```bash
   git clone https://github.com/your-team/bdpa-irv-elections.git
   cd bdpa-irv-elections
   ```

2. **Copy the starter files to the repository**
   - Copy all the files we created:
     - README.md
     - .gitignore
     - .env.example
     - CONTRIBUTING.md
     - PROJECT_STRUCTURE.md
     - .github/ISSUE_TEMPLATE/bug_report.md
     - .github/ISSUE_TEMPLATE/feature_request.md
     - .github/PULL_REQUEST_TEMPLATE.md

3. **Create initial commit**
   ```bash
   git add .
   git commit -m "Initial repository setup with documentation and templates"
   git push origin main
   ```

4. **Create development branch**
   ```bash
   git checkout -b dev
   git push origin dev
   ```

---

## 🌿 Step 5: Set Up Branch Structure

- [ ] Verify `main` branch exists
- [ ] Create and push `dev` branch
- [ ] Set `dev` as default branch (Settings → Branches → Default branch → Change to `dev`)
- [ ] Protect `main` branch (see Step 3)

**Branch Strategy:**
```
main (protected, production-ready)
  └── dev (default, integration branch)
       ├── feature/user-auth
       ├── feature/elections
       ├── feature/dashboard
       └── fix/login-bug
```

---

## 📋 Step 6: Create Initial Issues

Create these issues to track work:

### Setup Issues
- [ ] Issue: "Set up frontend project structure"
- [ ] Issue: "Set up backend project structure"
- [ ] Issue: "Configure database"
- [ ] Issue: "Set up API integration"
- [ ] Issue: "Configure development environment"

### Part 1 Feature Issues
- [ ] Issue: "Implement user authentication (Req 6)"
- [ ] Issue: "Create user types and roles (Req 1)"
- [ ] Issue: "Build dashboard view (Req 4)"
- [ ] Issue: "Build election view (Req 3)"
- [ ] Issue: "Build history view (Req 5)"
- [ ] Issue: "Implement IRV algorithm (Req 9)"
- [ ] Issue: "Add real-time updates (Req 10)"
- [ ] Issue: "Implement security measures (Req 13)"
- [ ] Issue: "Make responsive design (Req 15)"

**Label each issue with:**
- Type: `enhancement`, `bug`, `documentation`
- Priority: `high`, `medium`, `low`
- Part: `part-1`, `part-2`

---

## 🎨 Step 7: Create Labels

Go to Issues → Labels, and create:

### Type Labels
- [ ] `bug` - Something isn't working (red)
- [ ] `enhancement` - New feature (green)
- [ ] `documentation` - Documentation updates (blue)
- [ ] `question` - Questions (purple)

### Priority Labels
- [ ] `priority: high` - Critical (red)
- [ ] `priority: medium` - Important (orange)
- [ ] `priority: low` - Nice to have (yellow)

### Status Labels
- [ ] `status: in-progress` - Currently being worked on (yellow)
- [ ] `status: blocked` - Blocked by something (red)
- [ ] `status: review` - Ready for review (blue)

### Part Labels
- [ ] `part-1` - Part 1 requirements (green)
- [ ] `part-2` - Part 2 changes (purple)

### Component Labels
- [ ] `frontend` - Frontend code (cyan)
- [ ] `backend` - Backend code (brown)
- [ ] `database` - Database related (gray)
- [ ] `api` - API integration (pink)

---

## 👨‍💻 Step 8: Team Member Setup

### Each Team Member Does:

1. **Accept invitation**
   - [ ] Check email for GitHub invitation
   - [ ] Click "Accept invitation"

2. **Clone the repository**
   ```bash
   git clone https://github.com/your-team/bdpa-irv-elections.git
   cd bdpa-irv-elections
   ```

3. **Set up environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your settings
   # Add your API key when you get it
   ```

4. **Install dependencies**
   ```bash
   # If using Node.js
   npm install
   
   # If using Python
   pip install -r requirements.txt
   ```

5. **Create your first branch**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-name-setup
   ```

6. **Test that everything works**
   ```bash
   # Try running the app
   npm run dev  # or python app.py
   ```

---

## 📚 Step 9: Set Up Project Documentation

Create a Wiki (optional but recommended):

- [ ] Go to repository → Wiki tab
- [ ] Create home page with:
  - Project overview
  - Quick start guide
  - Team member roles
  - Meeting notes
  - API key instructions
  - Troubleshooting guide

Or use GitHub Projects:

- [ ] Go to Projects tab
- [ ] Click "New project"
- [ ] Choose "Board" template
- [ ] Create columns:
  - To Do
  - In Progress
  - In Review
  - Done
- [ ] Link issues to project board

---

## 🔐 Step 10: Security Setup

### Protect Sensitive Data

- [ ] **Never commit .env files**
  - Verify `.env` is in `.gitignore`
  - Check no secrets are in code

- [ ] **Get API key from BDPA**
  - Use BDPABot on Slack or contact staff
  - Add to your local `.env` file
  - Share API key only with team members (securely)

- [ ] **Set up secrets for CI/CD** (if using)
  - Settings → Secrets and variables → Actions
  - Add secrets needed for deployment

### Security Checklist

- [ ] `.gitignore` includes `.env`
- [ ] `.env.example` has no real secrets
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No database credentials in code

---

## ✅ Step 11: Verify Everything

### Repository Checklist

- [ ] README.md is clear and helpful
- [ ] .gitignore prevents sensitive files
- [ ] .env.example shows required variables
- [ ] CONTRIBUTING.md explains workflow
- [ ] Issue templates work
- [ ] PR template works
- [ ] Branch protection is enabled
- [ ] All team members have access
- [ ] Labels are created
- [ ] Initial issues are created

### Team Checklist

- [ ] Everyone can clone the repo
- [ ] Everyone can create branches
- [ ] Everyone can push to their branches
- [ ] Everyone can create PRs
- [ ] Code review process is clear
- [ ] Communication channel set up (Slack/Discord)

---

## 🚀 Step 12: First Team Commit

Have a short team meeting:

1. **Quick GitHub training**
   - [ ] Review branching strategy
   - [ ] Walk through creating a PR
   - [ ] Practice code review

2. **Assign initial tasks**
   - [ ] Review open issues
   - [ ] Each member picks 1-2 starter issues
   - [ ] Assign issues on GitHub

3. **Set up communication**
   - [ ] Daily standup time (5-10 minutes)
   - [ ] Slack/Discord channel for quick questions
   - [ ] Weekly planning meeting

4. **First commits**
   - [ ] Each member makes a small change
   - [ ] Create PR
   - [ ] Get review
   - [ ] Merge

---

## 📅 Ongoing Maintenance

### Daily
- [ ] Check for new issues/PRs
- [ ] Respond to code review comments
- [ ] Sync with team on progress

### Weekly
- [ ] Review open PRs
- [ ] Update issue statuses
- [ ] Close completed issues
- [ ] Plan next week's work

### Before Competition
- [ ] Test on localhost:3000
- [ ] Review all requirements
- [ ] Complete code review
- [ ] Test on different devices
- [ ] Prepare deployment

---

## 🎯 Success Criteria

Your repository is ready when:

✅ All team members can clone and run the project  
✅ Branch protection prevents accidental main branch pushes  
✅ Issue and PR templates guide contributions  
✅ Documentation clearly explains project setup  
✅ Team workflow is established and understood  
✅ First few PRs have been successfully merged  

---

## 🆘 Troubleshooting

### Common Issues

**"I can't push to main"**
- That's correct! Always create a feature branch and PR

**"I don't have permission"**
- Check that you accepted the invitation
- Ask team lead to verify collaborator access

**"Git says 'fatal: not a git repository'"**
- You're not in the repository folder
- Run `cd bdpa-irv-elections` first

**"npm install fails"**
- Check Node.js version: `node --version`
- Try deleting `node_modules` and `package-lock.json`
- Run `npm install` again

**"I have merge conflicts"**
- Pull latest from dev: `git pull origin dev`
- Resolve conflicts in your editor
- Stage, commit, and push

---

## 📞 Getting Help

- **GitHub Issues**: For bugs and features
- **Slack/Discord**: For quick questions
- **Team Lead**: For permissions and access
- **BDPA Staff**: For API keys and competition questions

---

**You're all set! Time to start coding! 🚀**
