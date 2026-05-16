# BDPA Elections — Setup & Developer Guide

## Quick Start (3 commands)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server on port 3000
npm run dev

# 3. Open in browser
# → http://127.0.0.1:3000
```

---

## Getting React + Vite Installed

### Prerequisites

- **Node.js v18+** — Download from https://nodejs.org (choose the LTS version)
- Verify after installing:
  ```bash
  node --version   # should print v18.x.x or higher
  npm --version    # should print 9.x.x or higher
  ```

### Step-by-step on a Windows AWS WorkSpace

1. **Download Node.js LTS** from https://nodejs.org and run the installer.  
   Accept all defaults. Restart your terminal after.

2. **Open a terminal** (Command Prompt or PowerShell) and navigate to your desktop:
   ```cmd
   cd %USERPROFILE%\Desktop
   ```

3. **Copy this project folder** to `%USERPROFILE%\Desktop\source`, or create it fresh:
   ```cmd
   mkdir source
   cd source
   ```

4. **Place all project files** into `source\` (or clone your repo there).

5. **Install dependencies:**
   ```cmd
   npm install
   ```
   This reads `package.json` and downloads React, Vite, and React Router into
   a `node_modules\` folder. Takes ~30 seconds.

6. **Start the dev server:**
   ```cmd
   npm run dev
   ```
   You should see:
   ```
   VITE v5.x.x  ready in 300ms
   ➜  Local:   http://127.0.0.1:3000/
   ```

7. **Open http://127.0.0.1:3000** in your browser. Done!

---

## Building for Production (recommended for judging)

```bash
npm run build     # compiles everything into dist/
npm run preview   # serves dist/ on port 3000 (production mode)
```

Run `npm run preview` instead of `npm run dev` when judges are scoring — it's
faster, hides development errors, and behaves exactly like the deployed version.

---

## Project Structure

```
source/
├── index.html                    Vite entry point
├── vite.config.js                Dev server config (port 3000)
├── package.json                  Dependencies + npm scripts
├── STYLE_GUIDE.md                ← You are here
│
└── src/
    ├── main.jsx                  React root mount
    ├── App.jsx                   Router + auth gate
    │
    ├── styles/
    │   ├── variables.css         🎨 ALL design tokens (colors, spacing, fonts)
    │   └── global.css            Reset + base styles + reusable classes
    │
    ├── components/
    │   └── layout/
    │       ├── Navbar.jsx/.css   Permanent nav (Req 8)
    │       └── Layout.jsx        Page wrapper
    │
    └── pages/
        ├── auth/
        │   ├── LoginPage.jsx/.css       Req 6 — login
        │   └── ForgotPasswordPage.jsx   Req 7 — password recovery
        │
        ├── dashboard/
        │   └── DashboardPage.jsx/.css   Req 4 — role-aware home
        │
        ├── election/
        │   └── ElectionViewPage.jsx/.css Req 3, 9, 10 — vote + results
        │
        └── history/
            └── HistoryPage.jsx/.css     Req 5 — all past elections
```

---

## What Each Developer Needs to Do Next

### 1. Wire up authentication (App.jsx, LoginPage.jsx)
- Replace the mock `user` state in `App.jsx` with a real auth context
- Store session in `localStorage` (for "remember me") or `sessionStorage`
- Hash passwords with bcrypt or SHA-256 + salt before storing

### 2. Connect to the API (all pages)
- Every `// TODO: replace with real API call` comment marks an API integration point
- Use the key in your API requests: add it as `x-api-key` header
- Base URL: https://hscc18f802d3.docs.apiary.io (see API docs)

### 3. Implement IRV (ElectionViewPage.jsx, HistoryPage.jsx)
- Add `src/utils/irv.js` with the algorithm from Requirement 9
- Call it wherever you see `// TODO: computeIRV(...)`

### 4. Local database for users (Requirement 6, 13)
- The API doesn't store passwords — you need a local DB (SQLite, lowdb, etc.)
- Store: username, email, hashed password, role, city, state, zip, address
- Track: failed login attempts, lockout expiry, last IP, last login timestamp

### 5. Real-time updates (ElectionViewPage.jsx)
- The `setInterval` polling at 10 seconds is already stubbed in
- Replace the empty `fetchElection` body with your real API call

---

## Environment Tips

- Never commit API keys. Use a `.env` file:
  ```
  VITE_API_KEY=your_key_here
  VITE_API_BASE=https://hscc18f802d3.docs.apiary.io
  ```
  Access in code: `import.meta.env.VITE_API_KEY`

- The `.gitignore` should exclude `node_modules/` and `.env`

---

## Password Recovery Simulation (Requirement 7)

Email sending is simulated by logging to the browser console.  
To see recovery emails during judging:

1. Open DevTools (`F12`)
2. Go to the **Console** tab
3. Trigger a password reset — a full formatted email appears in the console

No external email service is used.
