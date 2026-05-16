# Codespaces Setup Guide (For Students)

Welcome! This project uses **GitHub Codespaces**, which means you don't need to install anything on your computer. Your dev environment lives in the cloud and is identical for every team member — Mac, Windows, and Chromebook users all see the exact same thing.

## What You Need Before Starting

1. **A GitHub account** — sign up free at https://github.com/signup
2. **The team's repo URL** — your team lead will share this with you
3. **A modern web browser** — Chrome, Edge, Firefox, Safari all work

That's it. No Node.js install, no command-line setup, no version mismatches.

## Step 1: Get Added to the Repo

Send your GitHub username to your team lead. They'll add you as a collaborator. You'll get an email — click "Accept invitation."

## Step 2: Apply for GitHub Student Pack (Optional but Recommended)

GitHub gives students extra free Codespaces hours (180/month vs 60/month for regular accounts).

Apply at: https://education.github.com/pack

You'll need to upload proof you're a student (school ID, transcript, or `.edu` email). Approval usually takes 1–2 days.

Even without the pack, 60 hours/month is plenty for this project unless you're coding 2+ hours every single day.

## Step 3: Launch Your Codespace

1. Go to the project repo on GitHub
2. Click the green **"< > Code"** button
3. Click the **"Codespaces"** tab
4. Click **"Create codespace on main"**

A new browser tab will open showing VS Code. The first time, it takes about **2–3 minutes** to set everything up — you'll see "Setting up your codespace…" with a build log scrolling by. **Don't close the tab.**

When it's done, you'll see a terminal at the bottom with a welcome message and a file explorer on the left.

## Step 4: Configure Your Environment Variables

The app needs a few secrets to work. In the terminal at the bottom of VS Code, type:

```bash
cp .env.example .env.local
```

Then click `.env.local` in the file explorer and fill in:

- `BDPA_API_KEY` — your team's API key (get this from your team lead)
- `JWT_SECRET` — paste any long random string. Easy way: in the terminal, type:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  and copy the output.

Leave the rest as defaults for now.

## Step 5: Start the App

In the terminal:

```bash
npm run dev
```

After a few seconds, you'll see:
```
- Local:        http://localhost:3000
```

A popup in VS Code will say "Your application running on port 3000 is available." Click **"Open in Browser"**. The app loads in a new tab.

That's it — you're now coding in a real Linux dev environment with all dependencies installed.

## Daily Workflow

### Starting your work session

1. Open https://github.com/codespaces
2. Click your codespace to resume it (or click your most recent one)
3. It restores from where you left off in about 30 seconds
4. Open the terminal, type `npm run dev`, start coding

### Stopping your work session

**Important: stop your codespace when done.** Idle codespaces still count against your monthly hours.

- Click the bottom-left corner of VS Code (the green "Codespaces" indicator)
- Pick **"Stop Current Codespace"**

Or just close the browser tab — codespaces auto-stop after 30 minutes of inactivity, but stopping manually saves you those 30 minutes.

### Pushing your work to GitHub

Use the **Source Control** panel (the branch icon on the left sidebar) or use the terminal:

```bash
git checkout -b student-x/my-feature   # your branch
git add .
git commit -m "Add login form validation"
git push origin student-x/my-feature
```

Then open a Pull Request on GitHub. See `docs/GIT_WORKFLOW.md` for the full team workflow.

## Working from Local VS Code (Optional)

If you'd rather use VS Code on your computer instead of in the browser:

1. Install VS Code from https://code.visualstudio.com (free, all OSes)
2. Install the **"GitHub Codespaces"** extension in VS Code
3. Sign in with your GitHub account
4. From the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`): "Codespaces: Connect to Codespace"

Your codespace still runs in the cloud — you just get a nicer editor experience. The terminal commands still run on the Linux container.

## Troubleshooting

### "Setting up your codespace" hangs for more than 10 minutes
Refresh the browser tab. If still stuck, delete the codespace (https://github.com/codespaces → "..." menu → Delete) and create a new one.

### `npm run dev` shows errors about missing modules
The auto-install probably didn't finish. Run:
```bash
npm install
```
manually in the terminal.

### Port 3000 doesn't open / "site can't be reached"
In the bottom panel of VS Code, click the **"Ports"** tab. Make sure port 3000 is listed and "Public" is set. If not, right-click → "Change Port Visibility" → "Public".

### "You've used all your free Codespaces hours"
Either:
- Wait until the monthly reset (1st of the month)
- Apply for the GitHub Student Pack for more free hours
- Ask the team lead about upgrading the project to use organization-paid Codespaces

### Codespace feels slow
Default codespaces are 2-core/4GB. If your browser tab is also heavy, you can:
- Stop other browser tabs
- Or, from the codespace creation page, pick a 4-core/8GB machine (uses your hours faster but feels snappier)

## Budget Reminder

| Plan | Free hours/month |
|---|---|
| Regular GitHub account | 60 hours (2-core machine) |
| GitHub Student Pack | 180 hours (2-core machine) |

The hours apply only when your codespace is *running*. Stopped codespaces don't count.

Storage limits: 15 GB free for regular accounts, 20 GB for students. Our codespace uses ~3 GB. You can have multiple codespaces but it's best to keep just one for this project.

## Quick Reference Card

```bash
# Start the app
npm run dev

# Run tests (for Student D mainly)
npm test

# Generate a JWT secret for .env.local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# See which student owns the file I want to edit
cat docs/OWNERSHIP.md

# Create a new branch and start working
git checkout -b student-x/feature-name

# Push to share with the team
git add . && git commit -m "message" && git push origin student-x/feature-name
```
