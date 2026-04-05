# saucedemo-playwright-claude

End-to-end test automation framework for [saucedemo.com](https://www.saucedemo.com) (Swag Labs), built with [Playwright](https://playwright.dev) and TypeScript. Developed entirely using **Claude** as a demonstration of AI-assisted test automation.

---

## Project Structure

```
saucedemo-playwright-claude/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI: runs tests on every push to main
├── data/
│   ├── credentials.ts              # Users, passwords, error messages, protected routes
│   └── products.ts                 # Product catalog, sort options, expected sort orders
├── docs/
│   └── test-plan.md                # Full test plan with all suites and regression matrix
├── pages/
│   ├── components/
│   │   └── HeaderComponent.ts      # Shared: hamburger menu, cart badge, cart link
│   ├── LoginPage.ts                # Login form interactions
│   └── InventoryPage.ts            # Product listing, sorting, add/remove cart
├── tests/
│   ├── auth.spec.ts                # Suite 1: Authentication (AUTH-01 to AUTH-17)
│   └── inventory.spec.ts           # Suite 2: Inventory / Product Listing (INV-01 to INV-12)
├── playwright.config.ts            # Playwright configuration
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org) v18+
- npm

---

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

---

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run a specific suite
npx playwright test tests/auth.spec.ts
npx playwright test tests/inventory.spec.ts

# Run with UI mode
npm run test:ui

# Open HTML report after a run
npm run test:report
```

---

## Test Coverage

### Implemented

| Suite | Spec | Cases | Status |
|-------|------|-------|--------|
| Authentication | `auth.spec.ts` | 19 | ✅ |
| Inventory / Product Listing | `inventory.spec.ts` | 12 | ✅ |

### Planned (see [docs/test-plan.md](docs/test-plan.md))

| Suite | Cases | Priority |
|-------|-------|----------|
| Product Detail | 6 | Medium |
| Shopping Cart | 7 | High |
| Checkout Step 1 — Customer Info | 5 | High |
| Checkout Step 2 — Order Summary | 8 | High |
| Order Confirmation | 5 | Medium |
| Navigation & Session | 5 | Medium |

---

## Page Objects

| Class | Responsibility |
|-------|---------------|
| `LoginPage` | Username/password form, error messages |
| `InventoryPage` | Product list, sorting, add/remove cart, navigation to detail |
| `HeaderComponent` | Hamburger menu (logout, reset), cart badge, cart link |

---

## CI/CD

Tests run automatically on every push to `main` via GitHub Actions ([.github/workflows/playwright.yml](.github/workflows/playwright.yml)):

1. Checkout → Install Node.js → `npm ci`
2. Install Playwright Chromium browser
3. Run full test suite
4. Upload HTML report as artifact (retained 30 days)

---

## Test Users

| Username | Password | Behaviour |
|----------|----------|-----------|
| `standard_user` | `secret_sauce` | Full access |
| `locked_out_user` | `secret_sauce` | Blocked at login |
| `problem_user` | `secret_sauce` | Logs in, known UI defects |
| `performance_glitch_user` | `secret_sauce` | Logs in with deliberate delay |
| `error_user` | `secret_sauce` | Logs in, some actions fail |
| `visual_user` | `secret_sauce` | Logs in, visual defects |

---

## Built with Claude

This framework was built entirely using **[Claude Code](https://claude.ai/code)** — Anthropic's AI coding assistant.

The workflow used the `playwright-cli` skill to drive a real browser session before writing any test code:

1. **Exploration** — Claude navigated the site live, inspected DOM snapshots, and captured all stable `data-test` selectors
2. **Behavior mapping** — Claude exercised every flow (login, sorting, add/remove cart, checkout, protected routes) and recorded exact error messages and URL transitions
3. **Framework generation** — POM structure, data layer, test specs, CI workflow, and documentation generated from observed behavior
4. **Validation** — Full suite executed and confirmed green before every commit
