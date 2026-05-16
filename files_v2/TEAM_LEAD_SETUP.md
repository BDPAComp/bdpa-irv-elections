# Team Lead Setup Guide

This is the one-time setup *you* (the team lead / coach) need to do before the students can start. After this, the students just follow `CODESPACES_SETUP.md`.

## Step 1: Push the Project to GitHub

1. Go to https://github.com/new
2. Repo name: `bdpa-election-app` (or whatever you like)
3. Visibility: **Private** (recommended — keeps competition code private)
4. Don't add a README, .gitignore, or license (we already have them)
5. Click "Create repository"

GitHub will show you commands to push. From your local unzipped project folder:

```bash
cd bdpa-election-app
git init
git add .
git commit -m "Initial commit — BDPA project skeleton"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/bdpa-election-app.git
git push -u origin main
```

## Step 2: Add Your Students as Collaborators

1. Go to the repo on GitHub
2. Click **Settings** (top right)
3. Click **Collaborators** in the left sidebar
4. Click **Add people**
5. Type each student's GitHub username, send invite
6. Pick role: **Write** (lets them push branches but not delete the repo)

Each student gets an email — they have to click "Accept invitation" before they can access the repo.

## Step 3: Set Up Branch Protection

This prevents students from accidentally pushing broken code directly to `main`. Critical for avoiding "I just broke everyone's environment" disasters.

1. Repo → **Settings** → **Branches** in the left sidebar
2. Under "Branch protection rules," click **Add rule** (or "Add branch ruleset" on newer GitHub UIs)
3. Branch name pattern: `main`
4. Check these boxes:
   - ✅ **Require a pull request before merging**
     - Require approvals: **1** (a teammate must review)
   - ✅ **Require status checks to pass before merging** (if you set up CI later)
   - ✅ **Do not allow bypassing the above settings**
5. Click "Create" or "Save changes"

Now no one (including you) can push directly to main without a reviewed PR.

## Step 4: Share the Repo URL with Students

Send them:
- The repo URL: `https://github.com/YOUR-USERNAME/bdpa-election-app`
- Their assigned role (Student A, B, C, or D — see `docs/OWNERSHIP.md`)
- The BDPA API key (for their `.env.local` file)
- A link to `docs/CODESPACES_SETUP.md`

## Step 5: (Optional) Pre-pay or Monitor Codespaces Hours

Each student's free Codespaces hours come from their personal GitHub account, not yours — so you don't pay anything by default. But:

- If a student runs out, they can either wait for the monthly reset, apply for GitHub Student Pack, or you can pay for extra hours
- To monitor team usage, go to your repo → **Insights** → **Usage**

## Step 6: Decide on a Shared Communication Channel

The students need somewhere to coordinate (which files they're editing, asking for help). Options:
- **Slack** (the problem statement mentions BDPA has one)
- **Discord** (free, easy)
- **GitHub Discussions** (built in, no extra account needed) — enable in repo Settings → Features

Whatever you pick, make sure everyone joins on day one.

## What to Tell Each Student

A short message template:

> Hi [name],
>
> You've been added to the BDPA Election System repo: https://github.com/...
>
> You're **Student [A/B/C/D]** — see `docs/OWNERSHIP.md` for the files you own and `docs/REQUIREMENTS.md` for the requirements you're responsible for.
>
> To get started:
> 1. Accept the GitHub invite (check your email)
> 2. Read `docs/CODESPACES_SETUP.md` — it walks through opening the project in your browser
> 3. The BDPA API key is: `[redact this from public messages — share privately]`
>
> Day 1: just get the codespace running and `npm run dev` working. Don't write any code yet — read the docs first.
>
> Daily standup time: [pick a time]
> Coordination channel: [link]

## Sanity Check: Try Opening a Codespace Yourself

Before sending the repo to students, **do this yourself first:**

1. Go to your repo → green "Code" button → "Codespaces" → "Create codespace on main"
2. Wait for it to build (2–3 min)
3. Run `cp .env.example .env.local`, fill in real values
4. Run `npm run dev`
5. Click "Open in Browser" when port 3000 forwards
6. Confirm the landing page loads (redirects to /login)

If anything breaks, fix it before the students try. After your test, **delete your test codespace** (https://github.com/codespaces → ... → Delete) so you don't waste hours.

## When Students Submit Pull Requests

You'll get notifications. For each PR:

1. Click "Files changed" to see what they wrote
2. Check that they're only editing files they own (per `OWNERSHIP.md`)
3. Comment with feedback or click "Approve"
4. Once approved, the student clicks "Squash and merge"

If two students try to merge PRs that touch the same file, GitHub will warn the second one. They'll need to pull `main` and rebase. See `docs/GIT_WORKFLOW.md`.

## Common Issues to Watch For

| Symptom | Cause | Fix |
|---|---|---|
| Student says "my codespace is broken" | They accidentally ran `npm init` or deleted package.json | Have them delete the codespace and create a fresh one |
| Two students editing same file | Didn't read OWNERSHIP.md | Redirect them; suggest the file-creation pattern from the doc |
| Student can't push | Branch protection blocking direct push to main | They need to push to a feature branch and open a PR |
| Codespace runs out of hours mid-project | Heavy daily use | Apply for Student Pack, or pay-as-you-go for the team |
| `.env.local` accidentally committed | They added it to git despite the `.gitignore` | Rotate the API key immediately. Use `git filter-branch` or `git filter-repo` to remove from history |
