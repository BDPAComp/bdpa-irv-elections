# Git Commands Cheat Sheet

Quick reference for common Git commands used in BDPA IRV Elections project.

---

## 🚀 Getting Started

### Clone Repository
```bash
# Clone the repo for the first time
git clone https://github.com/your-team/bdpa-irv-elections.git

# Navigate into the folder
cd bdpa-irv-elections
```

### Check Status
```bash
# See what files have changed
git status

# See which branch you're on
git branch
```

---

## 🌿 Working with Branches

### View Branches
```bash
# List all local branches
git branch

# List all branches (local and remote)
git branch -a

# See current branch
git branch --show-current
```

### Create and Switch Branches
```bash
# Create a new branch
git branch feature/my-feature

# Switch to a branch
git checkout feature/my-feature

# Create AND switch in one command (recommended!)
git checkout -b feature/my-feature

# Create branch from dev
git checkout dev
git checkout -b feature/my-feature
```

### Switch Between Branches
```bash
# Switch to dev
git checkout dev

# Switch to main
git checkout main

# Switch to your feature branch
git checkout feature/my-feature
```

### Delete Branches
```bash
# Delete a local branch (after merging)
git branch -d feature/my-feature

# Force delete (if not merged)
git branch -D feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

---

## 💾 Saving Your Work

### Stage Files
```bash
# Stage a specific file
git add filename.js

# Stage all changed files
git add .

# Stage all files in a folder
git add folder/

# Stage files by pattern
git add *.js
```

### Commit Changes
```bash
# Commit with message
git commit -m "Add user authentication"

# Commit with longer message
git commit -m "Add user authentication" -m "Implemented JWT tokens and password hashing"

# Stage and commit in one step (only for tracked files)
git commit -am "Update login validation"
```

### Undo Changes
```bash
# Undo changes to a file (before staging)
git checkout -- filename.js

# Unstage a file (keep changes)
git reset filename.js

# Unstage all files (keep changes)
git reset

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes - DANGEROUS!)
git reset --hard HEAD~1
```

---

## ☁️ Syncing with GitHub

### Pull (Download) Changes
```bash
# Pull changes from remote dev branch
git pull origin dev

# Pull changes from current branch
git pull

# Pull and rebase (cleaner history)
git pull --rebase origin dev
```

### Push (Upload) Changes
```bash
# Push to remote branch
git push origin feature/my-feature

# Push to current branch
git push

# First time pushing a new branch
git push -u origin feature/my-feature

# Force push (DANGEROUS - avoid on shared branches!)
git push --force
```

---

## 🔄 Daily Workflow

### Morning Routine
```bash
# 1. Switch to dev
git checkout dev

# 2. Get latest changes
git pull origin dev

# 3. Create your feature branch
git checkout -b feature/your-feature

# 4. Start coding!
```

### During Development
```bash
# Check what changed
git status

# See detailed changes
git diff

# Stage changes
git add .

# Commit often!
git commit -m "Add login form validation"

# Push regularly (backup!)
git push origin feature/your-feature
```

### End of Day
```bash
# Make sure everything is committed
git status

# Push your work
git push origin feature/your-feature
```

### Ready to Merge
```bash
# Make sure your branch is up to date with dev
git checkout dev
git pull origin dev
git checkout feature/your-feature
git merge dev

# Resolve any conflicts, then:
git add .
git commit -m "Merge dev into feature branch"
git push origin feature/your-feature

# Then create PR on GitHub!
```

---

## 🔍 Viewing History

### See Commits
```bash
# View commit history
git log

# View compact history (one line per commit)
git log --oneline

# View last 5 commits
git log -5

# View history with graph
git log --graph --oneline --all

# Exit log viewer: press 'q'
```

### See Changes
```bash
# See what changed (unstaged)
git diff

# See what changed (staged)
git diff --staged

# See changes in a specific file
git diff filename.js

# See changes in a commit
git show commit-hash
```

---

## 🔀 Merging

### Merge Branches
```bash
# Merge dev into your feature branch
git checkout feature/my-feature
git merge dev

# If conflicts occur:
# 1. Open conflicted files
# 2. Look for <<<<<<< markers
# 3. Choose which changes to keep
# 4. Remove markers
# 5. Save files
git add .
git commit -m "Resolve merge conflicts"
```

### Abort a Merge
```bash
# If you want to cancel a merge
git merge --abort
```

---

## 🆘 Fixing Mistakes

### Oops, Wrong Branch!
```bash
# You committed to dev instead of a feature branch
git checkout dev
git log --oneline  # Find your commit hash

# Create feature branch with your commit
git checkout -b feature/my-feature
git cherry-pick commit-hash

# Go back to dev and remove the commit
git checkout dev
git reset --hard HEAD~1
git push --force origin dev  # Be careful!
```

### Oops, Wrong Commit Message!
```bash
# Change the last commit message
git commit --amend -m "Correct message"

# If already pushed, need force push:
git push --force origin feature/my-feature
```

### Oops, Forgot a File!
```bash
# Add file to the last commit
git add forgotten-file.js
git commit --amend --no-edit

# If already pushed:
git push --force origin feature/my-feature
```

### Oops, Committed Secrets!
```bash
# Remove file from git but keep local copy
git rm --cached .env
git commit -m "Remove .env from git"
git push origin feature/my-feature

# IMPORTANT: Still visible in history!
# For real secrets, you need to:
# 1. Rotate the secret (get new API key)
# 2. Use git filter-branch or BFG Repo-Cleaner
```

---

## 📊 Useful Commands

### Information
```bash
# See remote repository URL
git remote -v

# See who changed what in a file
git blame filename.js

# See file content at specific commit
git show commit-hash:path/to/file.js

# List files in a commit
git show --name-only commit-hash
```

### Stashing (Temporary Save)
```bash
# Save current changes temporarily
git stash

# Save with a message
git stash save "Work in progress on login"

# List all stashes
git stash list

# Apply most recent stash
git stash apply

# Apply specific stash
git stash apply stash@{1}

# Apply and remove stash
git stash pop

# Delete a stash
git stash drop stash@{1}

# Delete all stashes
git stash clear
```

### Cleaning Up
```bash
# See what would be deleted
git clean -n

# Delete untracked files
git clean -f

# Delete untracked files and folders
git clean -fd

# Delete ignored files too
git clean -fdx
```

---

## 🚨 Emergency Commands

### Undo Everything (NUCLEAR OPTION)
```bash
# Discard ALL local changes (CANNOT UNDO!)
git reset --hard HEAD

# Go back to exact state of remote branch
git fetch origin
git reset --hard origin/dev
```

### Recover Deleted Commits
```bash
# See all commits (even deleted ones)
git reflog

# Recover a commit
git checkout commit-hash
git checkout -b recovery-branch
```

---

## 📋 Git Aliases (Optional)

Add these to your `~/.gitconfig` for shortcuts:

```bash
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    df = diff
    lg = log --oneline --graph --all
    last = log -1 HEAD
    unstage = reset HEAD --
    undo = reset --soft HEAD~1
```

Then use:
```bash
git st        # instead of git status
git co dev    # instead of git checkout dev
git br        # instead of git branch
git ci -m     # instead of git commit -m
```

---

## 🎯 Quick Reference Table

| Task | Command |
|------|---------|
| Clone repo | `git clone <url>` |
| Check status | `git status` |
| Create branch | `git checkout -b feature/name` |
| Switch branch | `git checkout branch-name` |
| Stage all files | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin branch-name` |
| Pull | `git pull origin dev` |
| Merge dev | `git merge dev` |
| View history | `git log --oneline` |
| Undo changes | `git checkout -- filename` |
| Update from remote | `git pull origin dev` |

---

## 💡 Pro Tips

1. **Commit early, commit often** - Small commits are easier to review and debug

2. **Write clear commit messages** - Future you will thank you
   ```bash
   # Good ✅
   git commit -m "Add email validation to login form"
   
   # Bad ❌
   git commit -m "updates"
   ```

3. **Pull before you push** - Avoid conflicts
   ```bash
   git pull origin dev
   git push origin feature/my-branch
   ```

4. **Use branches for everything** - Never work directly on main or dev
   ```bash
   git checkout -b feature/new-feature
   ```

5. **Check before you commit** - Review what you're committing
   ```bash
   git status
   git diff
   git add .
   git commit -m "message"
   ```

6. **Keep branches up to date** - Merge dev regularly
   ```bash
   git checkout dev
   git pull origin dev
   git checkout feature/my-branch
   git merge dev
   ```

---

## 🆘 When Things Go Wrong

**"I'm on the wrong branch!"**
```bash
git stash                    # Save changes
git checkout correct-branch  # Switch
git stash pop               # Apply changes
```

**"I have merge conflicts!"**
```bash
# 1. Open the conflicted files
# 2. Look for <<<<<<< ======= >>>>>>> markers
# 3. Choose which code to keep
# 4. Delete the markers
# 5. Save the file
git add .
git commit -m "Resolve conflicts"
```

**"I committed to the wrong branch!"**
```bash
git log --oneline           # Find commit hash
git checkout correct-branch
git cherry-pick <hash>      # Copy commit to correct branch
git checkout wrong-branch
git reset --hard HEAD~1     # Remove from wrong branch
```

**"I pushed sensitive data!"**
```bash
# 1. Remove from git
git rm --cached .env
git commit -m "Remove sensitive file"
git push

# 2. IMPORTANT: Change the secrets!
#    Old values are still in git history
```

---

## 📚 Learning Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
- [Git Visualizer](https://git-school.github.io/visualizing-git/)

---

**Need help? Ask your team or create an issue!** 🤝
