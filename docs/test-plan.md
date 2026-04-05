# Test Plan — Swag Labs (saucedemo.com)

## Overview

| | |
|---|---|
| **Application** | Swag Labs — https://www.saucedemo.com |
| **Scope** | End-to-end regression coverage for all user-facing flows |
| **Tool** | Playwright + TypeScript |
| **Pattern** | Page Object Model (POM) |
| **Environments** | Chromium (CI), optional Firefox / WebKit expansion |
| **Total Tests** | 67 automated · 67 passing |

---

## Application Map

Discovered by live browser exploration with `playwright-cli`:

| Page | URL | Description |
|------|-----|-------------|
| Login | `/` | Entry point, authenticates all user types |
| Inventory | `/inventory.html` | Product listing, sorting, add-to-cart |
| Product Detail | `/inventory-item.html?id=X` | Single product view, add/remove cart |
| Cart | `/cart.html` | Cart review, remove items, proceed to checkout |
| Checkout Step 1 | `/checkout-step-one.html` | Buyer information form |
| Checkout Step 2 | `/checkout-step-two.html` | Order summary, price breakdown |
| Order Confirmation | `/checkout-complete.html` | Success state, back to products |

**Test Users**

| Username | Password | Expected Behaviour |
|----------|----------|--------------------|
| `standard_user` | `secret_sauce` | Full access, no issues |
| `locked_out_user` | `secret_sauce` | Blocked at login |
| `problem_user` | `secret_sauce` | Logs in, known UI defects |
| `performance_glitch_user` | `secret_sauce` | Logs in with delay |
| `error_user` | `secret_sauce` | Logs in, some actions fail |
| `visual_user` | `secret_sauce` | Logs in, visual defects |

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Automated and passing |
| ⚠️ | Automated — `test.fail()` documents a known defect |

---

## Test Suites

### 1. Authentication · `auth.spec.ts`

**Priority: Critical** — gate to the entire application.

| ID | Scenario | Type | Expected Result | Status |
|----|----------|------|-----------------|--------|
| AUTH-01 | Login with `standard_user` + valid password | Positive | Redirected to `/inventory.html` | ✅ |
| AUTH-02 | Login with `problem_user` + valid password | Positive | Redirected to `/inventory.html` | ✅ |
| AUTH-03 | Login with `performance_glitch_user` + valid password | Positive | Redirected to `/inventory.html` (may be slow) | ✅ |
| AUTH-04 | Login with `error_user` + valid password | Positive | Redirected to `/inventory.html` | ✅ |
| AUTH-05 | Login with `visual_user` + valid password | Positive | Redirected to `/inventory.html` | ✅ |
| AUTH-06 | Submit with empty username and password | Negative | Error: `Username is required` | ✅ |
| AUTH-07 | Submit with username only (no password) | Negative | Error: `Password is required` | ✅ |
| AUTH-08 | Submit with password only (no username) | Negative | Error: `Username is required` | ✅ |
| AUTH-09 | Login with wrong password | Negative | Error: `Username and password do not match` | ✅ |
| AUTH-10 | Login with non-existent username | Negative | Error: `Username and password do not match` | ✅ |
| AUTH-11 | Login with `locked_out_user` | Negative | Error: `Sorry, this user has been locked out.` | ✅ |
| AUTH-12 | Username is case-sensitive | Negative | Error: `Username and password do not match` | ✅ |
| AUTH-13 | Password is case-sensitive | Negative | Error: `Username and password do not match` | ✅ |
| AUTH-14 | Logout via hamburger menu | Positive | Redirected to `/`, session cleared | ✅ |
| AUTH-15 | Access `/inventory.html` without being logged in | Security | Redirected to `/`, error shown | ✅ |
| AUTH-16 | Access `/cart.html` without being logged in | Security | Redirected to `/`, error shown | ✅ |
| AUTH-17 | Access `/checkout-step-one.html` without being logged in | Security | Redirected to `/`, error shown | ✅ |

---

### 2. Inventory / Product Listing · `inventory.spec.ts`

**Priority: High** — primary discovery surface for users.

| ID | Scenario | Type | Expected Result | Status |
|----|----------|------|-----------------|--------|
| INV-01 | All 6 products displayed on load | Positive | 6 items visible with name, description, price, image | ✅ |
| INV-02 | Default sort is `Name (A to Z)` | Positive | Backpack first, T-Shirt (Red) last | ✅ |
| INV-03 | Sort by `Name (Z to A)` | Positive | T-Shirt (Red) first, Backpack last | ✅ |
| INV-04 | Sort by `Price (low to high)` | Positive | Onesie ($7.99) first, Fleece Jacket ($49.99) last | ✅ |
| INV-05 | Sort by `Price (high to low)` | Positive | Fleece Jacket ($49.99) first, Onesie ($7.99) last | ✅ |
| INV-06 | Add single item to cart from inventory | Positive | Cart badge shows `1`, button changes to `Remove` | ✅ |
| INV-07 | Add multiple items to cart | Positive | Cart badge count reflects total items added | ✅ |
| INV-08 | Remove item from inventory after adding | Positive | Cart badge decrements, button reverts to `Add to cart` | ✅ |
| INV-09 | Cart badge absent when cart is empty | Positive | No badge element rendered | ✅ |
| INV-10 | Click product name navigates to detail page | Positive | URL changes to `/inventory-item.html?id=X` | ✅ |
| INV-11 | Click product image navigates to detail page | Positive | URL changes to `/inventory-item.html?id=X` | ✅ |
| INV-12 | Cart icon navigates to `/cart.html` | Positive | Cart page loads with correct items | ✅ |

---

### 3. Product Detail · `product-detail.spec.ts`

**Priority: Medium** — individual product actions before cart.

| ID | Scenario | Type | Expected Result | Status |
|----|----------|------|-----------------|--------|
| DET-01 | Product detail displays correct name, description, price, image | Positive | All fields match inventory listing | ✅ |
| DET-02 | Add to cart from detail page increments badge | Positive | Badge count increases by 1 | ✅ |
| DET-03 | Button changes to `Remove` after adding to cart | Positive | `Add to cart` → `Remove` | ✅ |
| DET-04 | Remove from cart via detail page decrements badge | Positive | Badge count decreases, button reverts | ✅ |
| DET-05 | `Back to products` button returns to inventory | Positive | URL returns to `/inventory.html` | ✅ |
| DET-06 | Cart state persists when navigating back to inventory | Positive | Previously added items still in cart | ✅ |

---

### 4. Shopping Cart · `cart.spec.ts`

**Priority: High** — last review point before purchase.

| ID | Scenario | Type | Expected Result | Status |
|----|----------|------|-----------------|--------|
| CART-01 | All added items appear in cart with correct name, qty, price | Positive | Each item listed once with qty `1` | ✅ |
| CART-02 | Remove one item from cart | Positive | Item removed, badge decrements | ✅ |
| CART-03 | Remove all items from cart | Positive | Cart is empty, badge disappears | ✅ |
| CART-04 | `Continue Shopping` navigates back to inventory | Positive | URL returns to `/inventory.html` | ✅ |
| CART-05 | Items added in inventory still present after navigating back | Positive | Cart badge and items unchanged | ✅ |
| CART-06 | `Checkout` button navigates to checkout step 1 | Positive | URL changes to `/checkout-step-one.html` | ✅ |
| CART-07 | Cart is empty after logout and re-login | Negative | Cart should be empty after new session | ⚠️ |

> **CART-07 — Known defect:** saucedemo's logout does not clear `localStorage`. The `cart-contents` key persists across sessions, so items reappear after re-login. Marked with `test.fail()` to document the bug and alert if it is ever fixed.

---

### 5. Checkout — Step 1: Customer Information · `checkout.spec.ts`

**Priority: High** — form validation critical for order processing.

| ID | Scenario | Type | Expected Result | Status |
|----|----------|------|-----------------|--------|
| CHK1-01 | Submit empty form | Negative | Error: `First Name is required` | ✅ |
| CHK1-02 | Submit with only first name | Negative | Error: `Last Name is required` | ✅ |
| CHK1-03 | Submit with first and last name, no zip | Negative | Error: `Postal Code is required` | ✅ |
| CHK1-04 | Submit with all fields filled | Positive | Advances to `/checkout-step-two.html` | ✅ |
| CHK1-05 | `Cancel` returns to cart | Positive | URL returns to `/cart.html`, cart unchanged | ✅ |

---

### 6. Checkout — Step 2: Order Summary · `checkout.spec.ts`

**Priority: High** — price integrity before final submission.

| ID | Scenario | Type | Expected Result | Status |
|----|----------|------|-----------------|--------|
| CHK2-01 | All cart items listed with correct name and price | Positive | Items match what was added | ✅ |
| CHK2-02 | Item subtotal is sum of individual item prices | Positive | e.g. $29.99 + $9.99 = $39.98 | ✅ |
| CHK2-03 | Tax is calculated correctly (8%) | Positive | e.g. $39.98 × 0.08 = $3.20 | ✅ |
| CHK2-04 | Total = item subtotal + tax | Positive | e.g. $39.98 + $3.20 = $43.18 | ✅ |
| CHK2-05 | Payment info displayed: `SauceCard #31337` | Positive | Static card info visible | ✅ |
| CHK2-06 | Shipping info displayed: `Free Pony Express Delivery!` | Positive | Shipping label visible | ✅ |
| CHK2-07 | `Finish` button completes order | Positive | Redirected to `/checkout-complete.html` | ✅ |
| CHK2-08 | `Cancel` returns to inventory | Positive | URL returns to `/inventory.html` | ✅ |

---

### 7. Order Confirmation · `order-confirmation.spec.ts`

**Priority: Medium** — post-purchase state and recovery.

| ID | Scenario | Type | Expected Result | Status |
|----|----------|------|-----------------|--------|
| CONF-01 | Confirmation heading: `Thank you for your order!` | Positive | Success message visible | ✅ |
| CONF-02 | Pony Express image displayed | Positive | Confirmation image rendered | ✅ |
| CONF-03 | Cart badge gone after order completes | Positive | No badge visible | ✅ |
| CONF-04 | `Back Home` returns to inventory | Positive | URL returns to `/inventory.html` | ✅ |
| CONF-05 | Inventory has no pre-selected items after order | Positive | All buttons show `Add to cart` | ✅ |

---

### 8. Navigation & Session · `navigation.spec.ts`

**Priority: Medium** — correct routing and session management.

| ID | Scenario | Type | Expected Result | Status |
|----|----------|------|-----------------|--------|
| NAV-01 | Hamburger menu opens with: All Items, About, Logout, Reset App State | Positive | All 4 links present | ✅ |
| NAV-02 | `All Items` link navigates to `/inventory.html` | Positive | Products page loads | ✅ |
| NAV-03 | `Logout` clears session and redirects to login | Positive | Cannot access protected routes after logout | ✅ |
| NAV-04 | `Reset App State` clears cart | Positive | Badge disappears, buttons reset to `Add to cart` | ✅ |
| NAV-05 | Direct URL access to protected page after logout | Security | Redirected to `/` with error | ✅ |

---

## Regression Priority Matrix

| Suite | Spec | Cases | Priority | Risk | Status |
|-------|------|-------|----------|------|--------|
| Authentication | `auth.spec.ts` | 19 | Critical | High | ✅ |
| Inventory / Sorting | `inventory.spec.ts` | 12 | High | Medium | ✅ |
| Shopping Cart | `cart.spec.ts` | 7 | High | High | ✅ |
| Checkout Step 1 (validation) | `checkout.spec.ts` | 5 | High | High | ✅ |
| Checkout Step 2 (price math) | `checkout.spec.ts` | 8 | High | High | ✅ |
| Order Confirmation | `order-confirmation.spec.ts` | 5 | Medium | Medium | ✅ |
| Product Detail | `product-detail.spec.ts` | 6 | Medium | Low | ✅ |
| Navigation & Session | `navigation.spec.ts` | 5 | Medium | Medium | ✅ |

**Recommended regression suite for CI:** AUTH + INV + CART + CHK1 + CHK2 (covers the critical purchase path end-to-end).

---

## Page Objects

```
pages/
├── components/
│   └── HeaderComponent.ts       ✅ hamburger menu, cart badge, cart link
├── LoginPage.ts                 ✅
├── InventoryPage.ts             ✅
├── ProductDetailPage.ts         ✅
├── CartPage.ts                  ✅
├── CheckoutInfoPage.ts          ✅
├── CheckoutOverviewPage.ts      ✅
└── OrderConfirmationPage.ts     ✅
```

---

## Out of Scope

- `About` external link (redirects to saucelabs.com)
- Social media footer links
- `problem_user` / `visual_user` defect cataloguing (intentional bugs, not regressions)
- Performance benchmarks for `performance_glitch_user`
- Cross-browser testing (expandable via `playwright.config.ts` projects)
