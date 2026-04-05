# saucedemo-playwright-claude

End-to-end test automation framework for [saucedemo.com](https://www.saucedemo.com) (Swag Labs), built with [Playwright](https://playwright.dev) and TypeScript. Developed entirely using **Claude** as a demonstration of AI-assisted test automation.

---

## Project Structure

```
saucedemo-playwright-claude/
├── .github/
│   └── workflows/
│       └── playwright.yml              # CI: runs tests on every push to main
├── data/
│   ├── credentials.ts                  # Users, passwords, error messages, protected routes
│   └── products.ts                     # Product catalog, sort options, expected sort orders
├── docs/
│   └── test-plan.md                    # Full test plan with all suites and regression matrix
├── pages/
│   ├── components/
│   │   └── HeaderComponent.ts          # Shared: hamburger menu, cart badge, cart link
│   ├── LoginPage.ts                    # Login form interactions
│   ├── InventoryPage.ts                # Product listing, sorting, add/remove cart
│   ├── ProductDetailPage.ts            # Single product view, add/remove cart
│   ├── CartPage.ts                     # Cart review, remove items, navigation
│   ├── CheckoutInfoPage.ts             # Checkout step 1: customer information form
│   ├── CheckoutOverviewPage.ts         # Checkout step 2: order summary and price totals
│   └── OrderConfirmationPage.ts        # Order confirmation and post-purchase state
├── tests/
│   ├── auth.spec.ts                    # Suite 1: Authentication (AUTH-01 to AUTH-17)
│   ├── inventory.spec.ts               # Suite 2: Inventory / Product Listing (INV-01 to INV-12)
│   ├── product-detail.spec.ts          # Suite 3: Product Detail (DET-01 to DET-06)
│   ├── cart.spec.ts                    # Suite 4: Shopping Cart (CART-01 to CART-07)
│   ├── checkout.spec.ts                # Suites 5 & 6: Checkout Steps 1 & 2 (CHK1/CHK2)
│   ├── order-confirmation.spec.ts      # Suite 7: Order Confirmation (CONF-01 to CONF-05)
│   └── navigation.spec.ts              # Suite 8: Navigation & Session (NAV-01 to NAV-05)
├── playwright.config.ts                # Playwright configuration
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
npx playwright test tests/cart.spec.ts
npx playwright test tests/checkout.spec.ts
npx playwright test tests/order-confirmation.spec.ts
npx playwright test tests/navigation.spec.ts

# Run with UI mode
npm run test:ui

# Open HTML report after a run
npm run test:report
```

---

## Test Coverage

**67 tests · 67 passing**

| Suite | Spec | Cases | Status |
|-------|------|-------|--------|
| Authentication | `auth.spec.ts` | 19 | ✅ |
| Inventory / Product Listing | `inventory.spec.ts` | 12 | ✅ |
| Product Detail | `product-detail.spec.ts` | 6 | ✅ |
| Shopping Cart | `cart.spec.ts` | 7 | ✅ |
| Checkout Step 1 — Customer Info | `checkout.spec.ts` | 5 | ✅ |
| Checkout Step 2 — Order Summary | `checkout.spec.ts` | 8 | ✅ |
| Order Confirmation | `order-confirmation.spec.ts` | 5 | ✅ |
| Navigation & Session | `navigation.spec.ts` | 5 | ✅ |

> **Note — CART-07:** `test.fail()` is used to document a known saucedemo defect where logout does not clear `localStorage`, causing cart data to persist across sessions. The test will alert if this behaviour ever changes.

---

## Page Objects

| Class | Responsibility |
|-------|---------------|
| `LoginPage` | Username/password form, error messages |
| `InventoryPage` | Product list, sorting, add/remove cart, navigation to detail |
| `ProductDetailPage` | Single product info, add/remove cart, back-to-products |
| `CartPage` | Cart items, remove, continue shopping, proceed to checkout |
| `CheckoutInfoPage` | Customer info form, validation errors, cancel |
| `CheckoutOverviewPage` | Order summary, price totals, finish/cancel |
| `OrderConfirmationPage` | Confirmation message, back to products |
| `HeaderComponent` | Hamburger menu (logout, reset, all items), cart badge, cart link |

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

1. **Exploration** — Claude navigated the site live, inspected DOM snapshots, and captured all stable `data-test` selectors across every page
2. **Behavior mapping** — Claude exercised every flow (login, sorting, cart, checkout, protected routes) and recorded exact error messages, URL transitions, and price calculations
3. **Framework generation** — POM structure, data layer, test specs, CI workflow, and documentation generated from observed behavior
4. **Validation** — Full suite executed and confirmed green before every commit
5. **Bug discovery** — Live exploration uncovered that saucedemo's logout does not clear `localStorage`, which is documented as a known defect in CART-07
