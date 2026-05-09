# Contributing to BDPA IRV Elections

Thank you for contributing to our team's BDPA NHSCC 2026 project! 🎉

This guide will help you understand our workflow and how to contribute effectively.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style Guide](#code-style-guide)
- [Testing](#testing)
- [Communication](#communication)

---

## 🚀 Getting Started

### First Time Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-team/bdpa-irv-elections.git
   cd bdpa-irv-elections
   ```

2. **Set up your environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API key and configuration
   ```

3. **Install dependencies**
   ```bash
   npm install  # or pip install -r requirements.txt
   ```

4. **Create your first branch**
   ```bash
   git checkout -b feature/your-name-setup
   ```

---

## 🔄 Development Workflow

### Daily Routine

**1. Start of Day - Sync with Team**
```bash
# Make sure you're on dev branch
git checkout dev

# Get latest changes
git pull origin dev

# Create your feature branch
git checkout -b feature/your-feature-name
```

**2. During Development - Commit Often**
```bash
# Check what you've changed
git status

# Stage your changes
git add .

# Commit with a clear message
git commit -m "Add user login validation"

# Push to GitHub regularly
git push origin feature/your-feature-name
```

**3. End of Day - Push Your Work**
```bash
# Make sure everything is committed
git status

# Push to GitHub (backup your work!)
git push origin feature/your-feature-name
```

---

## 🌳 Branching Strategy

### Branch Types

```
main (protected)
  ├── dev (integration branch)
      ├── feature/user-authentication
      ├── feature/election-dashboard
      ├── feature/irv-algorithm
      ├── fix/login-bug
      └── docs/api-documentation
```

### Branch Naming

**Features** (new functionality)
```bash
git checkout -b feature/voter-dashboard
git checkout -b feature/irv-vote-counting
git checkout -b feature/password-reset
```

**Bug Fixes**
```bash
git checkout -b fix/login-validation
git checkout -b fix/mobile-layout
```

**Documentation**
```bash
git checkout -b docs/setup-guide
git checkout -b docs/api-endpoints
```

**Refactoring**
```bash
git checkout -b refactor/database-schema
git checkout -b refactor/api-service
```

### Branch Naming Rules

✅ **Good Names**
- `feature/user-authentication`
- `fix/ballot-submission-error`
- `docs/installation-guide`

❌ **Bad Names**
- `new-stuff`
- `johns-branch`
- `temp`
- `asdf`

---

## 💬 Commit Guidelines

### Commit Message Format

```
<type>: <short description>

[optional longer description]
```

### Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Examples

✅ **Good Commits**
```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve ballot submission timeout error"
git commit -m "docs: update API endpoint documentation"
git commit -m "refactor: simplify IRV counting algorithm"
```

❌ **Bad Commits**
```bash
git commit -m "changes"
git commit -m "fixed stuff"
git commit -m "update"
git commit -m "WIP"
```

### Commit Best Practices

1. **Commit often** - Small, focused commits are better than large ones
2. **One logical change per commit** - Don't mix unrelated changes
3. **Write clear messages** - Future you will thank you
4. **Test before committing** - Make sure your code works
5. **Don't commit secrets** - No API keys, passwords, etc.

---

## 🔀 Pull Request Process

### Creating a Pull Request

1. **Push your branch to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Go to GitHub and create PR**
   - Click "Compare & pull request"
   - Choose base: `dev` ← compare: `feature/your-feature-name`
   - Fill out the PR template (see below)

3. **PR Template**
   ```markdown
   ## 📝 Description
   Brief description of what this PR does

   ## 🎯 Type of Change
   - [ ] 🆕 New feature
   - [ ] 🐛 Bug fix
   - [ ] 📚 Documentation update
   - [ ] ♻️ Code refactoring
   - [ ] ⚡ Performance improvement

   ## 🧪 Testing
   How did you test these changes?
   - [ ] Tested on desktop
   - [ ] Tested on mobile
   - [ ] All tests pass
   - [ ] No console errors

   ## 📸 Screenshots
   (If UI changes, add before/after screenshots)

   ## ✅ Checklist
   - [ ] Code follows team style guide
   - [ ] Self-reviewed my code
   - [ ] Commented complex code
   - [ ] Updated documentation
   - [ ] No merge conflicts
   - [ ] Tested thoroughly
   ```

4. **Request reviewers**
   - Assign at least one team member to review
   - Tag relevant people in comments

5. **Address feedback**
   - Make requested changes
   - Push updates to the same branch
   - Respond to comments

6. **Merge**
   - Once approved, merge into `dev`
   - Delete your feature branch after merging

### PR Review Guidelines

**As a Reviewer:**
- ✅ Review within 24 hours
- ✅ Test the code locally
- ✅ Check for bugs and issues
- ✅ Suggest improvements kindly
- ✅ Approve when ready

**As the PR Author:**
- ✅ Respond to all comments
- ✅ Make requested changes
- ✅ Ask questions if unclear
- ✅ Thank reviewers
- ✅ Don't take feedback personally - we're all learning!

---

## 🎨 Code Style Guide

### General Principles

1. **Be Consistent** - Follow existing code patterns
2. **Be Clear** - Write code that's easy to understand
3. **Be Comments** - Explain complex logic
4. **Be Tested** - Test your code before pushing

### JavaScript/TypeScript

```javascript
// ✅ Good
function calculateIRVWinner(ballots, options) {
  // Implementation of IRV algorithm
  const votes = countFirstChoices(ballots);
  
  // Check if anyone has >50%
  if (hasWinner(votes, ballots.length)) {
    return findWinner(votes);
  }
  
  // Eliminate candidate with fewest votes
  const eliminated = findLowestVote(votes);
  return calculateIRVWinner(redistributeVotes(ballots, eliminated), options);
}

// ❌ Bad
function calc(b,o){
  let v=cnt(b);if(w(v,b.length))return f(v);
  let e=l(v);return calc(r(b,e),o);
}
```

### Python

```python
# ✅ Good
def calculate_irv_winner(ballots, options):
    """
    Calculate the winner using Instant-Runoff Voting algorithm.
    
    Args:
        ballots: List of voter ballots with rankings
        options: List of available options
        
    Returns:
        The winning option or None if no winner
    """
    votes = count_first_choices(ballots)
    
    if has_winner(votes, len(ballots)):
        return find_winner(votes)
    
    eliminated = find_lowest_vote(votes)
    return calculate_irv_winner(redistribute_votes(ballots, eliminated), options)

# ❌ Bad
def c(b,o):
    v=cnt(b)
    if w(v,len(b)):return f(v)
    e=l(v)
    return c(r(b,e),o)
```

### Naming Conventions

**Variables & Functions**
- JavaScript: `camelCase`
- Python: `snake_case`
- Be descriptive: `userEmail` not `ue`

**Constants**
- All languages: `UPPER_SNAKE_CASE`
- Example: `MAX_LOGIN_ATTEMPTS = 3`

**Classes**
- All languages: `PascalCase`
- Example: `class UserAuthentication`

### Comments

```javascript
// ✅ Good - Explain WHY, not WHAT
// Use 5-minute window to prevent vote manipulation
const VOTE_CHANGE_WINDOW = 5 * 60 * 1000;

// ❌ Bad - Obvious
// Set variable to 300000
const VOTE_CHANGE_WINDOW = 300000;
```

---

## 🧪 Testing

### Before Committing

**Checklist:**
- [ ] Code runs without errors
- [ ] Tested on `localhost:3000`
- [ ] No console errors or warnings
- [ ] Tested on mobile view (responsive)
- [ ] Tested with different user types
- [ ] API calls work correctly

### Manual Testing Steps

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Test your feature**
   - Click through all UI elements
   - Try edge cases (empty fields, long text, etc.)
   - Test with different user accounts
   - Check mobile responsiveness

3. **Check for errors**
   - Open browser console (F12)
   - Look for red errors
   - Fix any issues before pushing

---

## 💬 Communication

### Daily Standups (Recommended)

Quick 5-10 minute team check-in:
1. What did I do yesterday?
2. What will I do today?
3. Any blockers or questions?

### Communication Channels

**Slack/Discord**
- Quick questions
- Daily updates
- Sharing links/resources

**GitHub Issues**
- Bug reports
- Feature requests
- Task tracking

**Pull Request Comments**
- Code review discussions
- Technical questions
- Implementation details

### When to Ask for Help

🆘 **Ask Immediately If:**
- You're stuck for more than 30 minutes
- You don't understand a requirement
- You're about to make a major change
- You broke something and can't fix it

💪 **Try First, Then Ask:**
- Google the error message
- Check documentation
- Read similar code in the project
- Ask a teammate

---

## 🚫 Things to Avoid

### Never Commit

- ❌ API keys or secrets
- ❌ `.env` files
- ❌ Large files (videos, datasets)
- ❌ Dependencies (`node_modules/`, `venv/`)
- ❌ IDE configuration files
- ❌ Build artifacts

### Never Do

- ❌ Push directly to `main`
- ❌ Commit without testing
- ❌ Ignore merge conflicts
- ❌ Work on someone else's branch without asking
- ❌ Force push (`git push -f`) on shared branches
- ❌ Delete others' code without discussing

---

## 🎉 Recognition

Great contributions deserve recognition! We celebrate:
- 🏆 First merged PR
- 🌟 Helpful code reviews
- 🐛 Finding critical bugs
- 💡 Clever solutions
- 📚 Great documentation

---

## ❓ Questions?

- Check this guide first
- Ask on Slack/Discord
- Create a GitHub issue
- Talk to the team lead

---

**Remember: We're a team! Help each other, communicate often, and let's build something amazing! 🚀**
