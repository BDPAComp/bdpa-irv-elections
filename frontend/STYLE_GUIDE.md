# BDPA Elections — Style Guide & Component Reference

> **Aesthetic Direction:** *Civic Authority* — Deep navy base, gold accents,  
> serif display headlines. Trustworthy, modern, and accessible.

---

## Quick Start

Every CSS value you need lives in `src/styles/variables.css` as a CSS custom
property. Import `global.css` in your component (which already imports
`variables.css`), then reference variables everywhere. **Never hardcode colors,
spacing, or typography values.**

```css
/* ✅ Do this */
color: var(--text-primary);
padding: var(--space-4);

/* ❌ Never this */
color: #f0f4fc;
padding: 16px;
```

---

## Fonts

| Role        | Family            | Variable          |
|-------------|-------------------|-------------------|
| Display/H1–H6 | Playfair Display | `var(--font-display)` |
| Body/UI     | DM Sans           | `var(--font-body)`    |
| Code/Monospace | DM Mono        | `var(--font-mono)`    |

Loaded from Google Fonts in `variables.css`. No extra import needed.

---

## Color System

### Semantic aliases (use these)

| Variable                | Usage                                |
|-------------------------|--------------------------------------|
| `--bg-primary`          | Page background                      |
| `--bg-secondary`        | Cards, panels                        |
| `--bg-surface`          | Inputs, table rows, hover states     |
| `--bg-surface-raised`   | Focused inputs, elevated cards       |
| `--text-primary`        | Headlines, important text            |
| `--text-secondary`      | Body copy, descriptions              |
| `--text-muted`          | Labels, placeholders, captions       |
| `--text-accent`         | Gold highlights, links               |
| `--accent-primary`      | Gold — primary CTAs (`#d4a017`)      |
| `--accent-hover`        | Lighter gold for hover states        |
| `--accent-muted`        | Transparent gold background tint     |
| `--border-subtle`       | Very faint separators                |
| `--border-default`      | Standard card/input borders          |
| `--border-strong`       | Hover/focus borders                  |
| `--border-accent`       | Gold borders                         |

### Status colors

```css
var(--status-open)     /* green  — open elections   */
var(--status-closed)   /* grey   — closed elections */
var(--status-upcoming) /* blue   — future elections */
var(--status-deleted)  /* red    — deleted items    */
```

---

## Typography Scale

```css
var(--text-xs)    /* 10.24px — labels, badges, captions */
var(--text-sm)    /* 12.8px  — secondary text, table cells */
var(--text-base)  /* 16px    — body default */
var(--text-md)    /* 18px    — slightly larger body */
var(--text-lg)    /* 20px    — card titles, h5 */
var(--text-xl)    /* 25px    — section headings, h4 */
var(--text-2xl)   /* 31px    — h3 */
var(--text-3xl)   /* 39px    — h2 */
var(--text-4xl)   /* 48.8px  — h1 (desktop) */
var(--text-5xl)   /* 61px    — hero / display */
```

### Overline / section label pattern

```jsx
<span className="section-label">Archive</span>
<h2>Election History</h2>
```

Always pair a `.section-label` (small, gold, uppercase) with a heading below it.

---

## Spacing Scale (base-8)

```
--space-1   4px      --space-8   32px
--space-2   8px      --space-10  40px
--space-3   12px     --space-12  48px
--space-4   16px     --space-16  64px
--space-5   20px     --space-20  80px
--space-6   24px     --space-24  96px
```

Use `gap: var(--space-4)`, `padding: var(--space-6)`, etc.

---

## Components

### `.card`

```jsx
<div className="card">Default card</div>
<div className="card card--raised">Elevated surface</div>
<div className="card card--accent">Gold-bordered card</div>
```

### `.badge`

```jsx
<span className="badge badge--open">open</span>
<span className="badge badge--closed">closed</span>
<span className="badge badge--upcoming">upcoming</span>
<span className="badge badge--deleted">deleted</span>

{/* User role badges */}
<span className="badge badge--voter">voter</span>
<span className="badge badge--moderator">moderator</span>
<span className="badge badge--administrator">administrator</span>
<span className="badge badge--reporter">reporter</span>
```

### Buttons

```jsx
{/* Variants */}
<button className="btn btn-primary">Primary CTA</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-ghost">Ghost / Subtle</button>
<button className="btn btn-danger">Destructive</button>

{/* Sizes */}
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary">Default</button>
<button className="btn btn-primary btn-lg">Large</button>

{/* Icon-only */}
<button className="btn btn-ghost btn-icon">✕</button>

{/* Loading state */}
<button className="btn btn-primary" disabled>
  <span className="spinner" /> Loading…
</button>
```

### Forms

```jsx
<div className="form-group">
  <label className="form-label required" htmlFor="email">Email</label>
  <input id="email" type="email" className="form-input" />
  <span className="form-help">We'll never share your email.</span>
  <span className="form-error">This field is required.</span>
</div>

{/* Error state */}
<input className="form-input error" />

{/* Password strength */}
<div className="password-strength password-strength--strong">
  <div className="password-strength__bar" />
  <div className="password-strength__bar" />
  <div className="password-strength__bar" />
</div>
{/* Classes: --weak | --moderate | --strong */}
```

### Alerts

```jsx
<div className="alert alert--success">Success message</div>
<div className="alert alert--warning">Warning message</div>
<div className="alert alert--danger">Error message</div>
<div className="alert alert--info">Info message</div>
```

### Spinner / Loading

```jsx
<span className="spinner" />           {/* inline, small */}
<span className="spinner spinner--lg" />{/* larger */}

{/* Full section loading state */}
<div className="spinner-overlay">
  <span className="spinner spinner--lg" />
</div>
```

### Skeleton loading

```jsx
{/* While data loads, show placeholder shapes */}
<div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 8 }} />
<div className="skeleton" style={{ height: 16, width: '40%' }} />
```

### Pagination

```jsx
<div className="pagination">
  <button className="pagination__btn" onClick={() => setPage(1)}>«</button>
  <button className="pagination__btn" onClick={() => setPage(p => p - 1)}>‹</button>
  <button className="pagination__btn active">3</button>
  <button className="pagination__btn" onClick={() => setPage(p => p + 1)}>›</button>
  <button className="pagination__btn" onClick={() => setPage(last)}>»</button>
</div>
```

### Modal

```jsx
<div className="modal-backdrop">
  <div className="modal">
    <div className="modal__header">
      <h2 className="modal__title">Confirm Action</h2>
      <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
    </div>
    <hr className="divider" />
    {/* modal body */}
    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
    </div>
  </div>
</div>
```

---

## Animation Utilities

```jsx
{/* Fade-in on mount */}
<div className="animate-fade-in">...</div>

{/* Stagger children with inline style delays */}
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-fade-in"
    style={{ animationDelay: `${i * 60}ms` }}
  >
    {item.name}
  </div>
))}
```

---

## Z-Index Layers

```
--z-base       0   — default flow
--z-raised     10  — sticky cards
--z-dropdown   100 — dropdowns
--z-sticky     200 — navbar
--z-overlay    300 — dimmed overlays
--z-modal      400 — modals
--z-toast      500 — toast notifications
--z-tooltip    600 — tooltips
```

---

## Breakpoints (mobile-first)

```
sm  ≥ 640px
md  ≥ 768px
lg  ≥ 1024px
xl  ≥ 1280px
```

Write your base styles for mobile, then add `@media (min-width: 640px) { ... }` 
overrides. See `global.css` for examples.

---

## Shadows

```css
var(--shadow-sm)   /* Subtle lift */
var(--shadow-md)   /* Cards */
var(--shadow-lg)   /* Dropdowns, popovers */
var(--shadow-xl)   /* Modals */
var(--shadow-gold) /* Gold glow — use on accent cards */
```

---

## DO / DON'T

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use CSS variables for everything | Hardcode hex colors |
| Use `--font-display` for headings | Use system fonts |
| Use semantic badge variants | Create ad-hoc badge styles |
| Use `animate-fade-in` on page entry | Add random animations |
| Show `spinner-overlay` while fetching | Leave blank space while loading |
| Use `form-error` for validation | Use red text without the class |
| Mobile-first CSS | Desktop-only styles |
| Use `--space-*` for all spacing | Use `px` values directly |
