# Git Workflow — Avoiding Merge Conflicts

## The Golden Rules

1. **Never push directly to `main`.** Always work on a branch.
2. **Always pull `main` before starting work.**
3. **Always rebase or pull `main` before pushing.**
4. **One open PR per student at a time.**
5. **Don't edit files owned by another student** (see `OWNERSHIP.md`).

## Branch Naming Convention

```
<student-letter>/<short-feature-name>

Examples:
student-a/api-wrapper
student-b/login-page
student-c/dashboard-voter
student-d/irv-algorithm
```

## Daily Workflow (the safe version)

```bash
# 1. Start your day — get the latest main
git checkout main
git pull origin main

# 2. Create your feature branch
git checkout -b student-b/password-recovery

# 3. Work, commit often (every logical unit)
git add src/app/recover/
git commit -m "Add recovery email simulation"

git add src/lib/auth/recoveryTokens.ts
git commit -m "Add token generation for recovery"

# 4. BEFORE pushing, rebase onto latest main
git fetch origin
git rebase origin/main
# If there are conflicts, fix them now (see below)

# 5. Push your branch
git push origin student-b/password-recovery

# 6. Open a Pull Request on GitHub
# Title: "Add password recovery flow"
# Reviewer: Pick another student (any one)

# 7. After approval + merge, delete your branch
git checkout main
git pull origin main
git branch -d student-b/password-recovery
```

## If You Get a Merge Conflict

Don't panic. Conflicts happen.

```bash
git rebase origin/main
# CONFLICT (content): Merge conflict in src/types/user.ts
```

1. Open the conflicted file. You'll see:
   ```
   <<<<<<< HEAD
   their code (the version on main)
   =======
   your code
   >>>>>>> your-branch
   ```
2. **Talk to the owner of that file before resolving.** If you're touching their code, you may be breaking their work.
3. Edit the file to keep what should be kept (often: both pieces, merged sensibly).
4. Then:
   ```bash
   git add <the file you fixed>
   git rebase --continue
   ```
5. If everything goes sideways:
   ```bash
   git rebase --abort   # safely back out
   ```
   Then ask for help.

## Why We Use Rebase (not merge)

Rebase keeps the git history linear and readable. With merge, the log looks like a tangled rope. With rebase, it looks like a clean timeline.

But rebase has one rule: **never rebase a branch that someone else is also working on.** Since each student owns their own branches, this isn't a problem for you.

## Branch Protection (Repo Owner Sets This Up)

In GitHub repo settings, the team lead should configure:
- Branch protection rule for `main`
- Require pull request before merging
- Require 1 approving review
- Require status checks (if you set up CI)
- Don't allow force pushes to main

This makes it *impossible* to accidentally destroy `main`.

## Commit Message Tips

Good commit messages help reviewers and future-you:

```
✅ "Add password strength meter to registration form"
✅ "Fix lockout timer not persisting across server restart"
✅ "Refactor election cache to use SWR instead of manual fetch"

❌ "stuff"
❌ "fix"
❌ "WIP"
❌ "asdfasdf"
```

A good format: `<verb in present tense> <what changed>`.

## When You Forget to Pull First

Symptom:
```
! [rejected] main -> main (fetch first)
error: failed to push some refs
```

Fix:
```bash
git pull origin main --rebase
# Resolve conflicts if any
git push origin <your-branch>
```

## When You Accidentally Commit to Main

```bash
# 1. Create a branch with your changes
git branch student-x/oops

# 2. Reset main back to where it was
git reset --hard origin/main

# 3. Switch to your new branch
git checkout student-x/oops
# Your changes are safe here. Now push it as a proper PR.
```

## .gitignore Essentials

The skeleton already includes a `.gitignore`. Don't commit:
- `node_modules/`
- `.env` (only `.env.example` should be in git)
- `.next/`
- `*.db`, `*.sqlite` (local databases)
- IDE folders (`.vscode/`, `.idea/`)
