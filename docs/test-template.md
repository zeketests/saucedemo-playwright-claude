# Test File Template

This template reflects the conventions used across all spec files in this project.
Follow it when creating a new feature's test suite.

---

## File naming

```
tests/<feature>.spec.ts
```

Use a short, lowercase noun or hyphenated phrase that matches the feature area (e.g. `auth`, `cart`, `checkout`, `inventory`).

---

## Imports

```ts
// For files that need an authenticated session (most feature tests):
import { test, expect } from './fixtures';

// For auth tests only (no pre-auth state needed):
import { test, expect } from '@playwright/test';

// Page objects — one per page under test
import { FooPage } from '../pages/FooPage';

// Shared test data
import { Users, VALID_PASSWORD } from '../data/credentials';
import { Products } from '../data/products';
```

> **Rule:** Always import `test` and `expect` from `./fixtures` unless the spec
> is specifically testing login/logout flows, where the pre-authenticated state
> would undermine the test's purpose.

---

## Setup helpers

When multiple tests share the same precondition (e.g. navigate to a page with
items already in the cart), extract it into a module-level async function rather
than repeating it in `beforeEach`.

```ts
import { Page } from '@playwright/test';

async function goToFeatureReady(page: Page) {
  // Shared setup steps
  await page.goto('/some-page.html');
  const somePage = new SomePage(page);
  await somePage.doSetup();
  await expect(page).toHaveURL('/target-page.html');
}
```

Use `test.beforeEach` to call that helper:

```ts
test.beforeEach(async ({ page }) => {
  await goToFeatureReady(page);
});
```

---

## describe blocks

Group tests by feature area and test-plan section. Use the section prefix from
the test plan as part of the describe label so failures map back to the plan
instantly.

```ts
// ─── Section Title (IDs covered) ─────────────────────────────────────────────

test.describe('PREFIX — Human-readable section name', () => {
  // tests go here
});
```

Multiple `describe` blocks per file are fine and encouraged when a feature has
distinct sub-sections (e.g. positive / negative / edge-case).

---

## Individual tests

```ts
test('[PREFIX-NN] should <behaviour> when <condition>', async ({ page }) => {
  const featurePage = new FeaturePage(page);

  await test.step('Action description', async () => {
    // perform the action
  });

  await test.step('Assertion description', async () => {
    await expect(featurePage.someLocator).toBeVisible();
    await expect(page).toHaveURL('/expected-url.html');
  });
});
```

### Naming conventions

| Part | Convention |
|------|-----------|
| Test ID | `[PREFIX-NN]` matching the test plan (e.g. `[AUTH-01]`, `[CART-03]`) |
| Title | `should <expected behaviour>` |
| Step labels | Sentence-case, action-oriented ("Submit empty form", "Verify error is shown") |

### test.step structure

Every test must decompose into at least two named steps:

1. **Action step** — user gesture or navigation
2. **Assertion step** — one or more `expect()` calls that prove the outcome

```ts
await test.step('Click the submit button', async () => {
  await featurePage.submitButton.click();
});

await test.step('Verify success message is shown', async () => {
  await expect(featurePage.successBanner).toBeVisible();
  await expect(featurePage.successBanner).toHaveText('Order placed!');
});
```

---

## Parametrised tests

Use a `for...of` loop over a typed array when the same assertion applies to
multiple inputs or users. Keeps the test count low while covering the matrix.

```ts
const cases = [
  { id: 'PREFIX-01', user: Users.STANDARD },
  { id: 'PREFIX-02', user: Users.VISUAL },
];

for (const { id, user } of cases) {
  test(`[${id}] should do X as ${user}`, async ({ page }) => {
    // ...
  });
}
```

---

## Known defects

When a test documents a known upstream bug, use `test.fail()` with an
explanatory message so the suite alerts if the defect is ever fixed.

```ts
test('[PREFIX-NN] should behave correctly (known defect)', async ({ page }) => {
  test.fail(true, 'Brief description of the defect and why it is expected to fail');

  // Write the test as if the bug did not exist.
  // It will be marked "expected failure" while the defect is open.
});
```

---

## Complete example

```ts
import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { Products } from '../data/products';
import { Page } from '@playwright/test';

// ─── Setup helper ─────────────────────────────────────────────────────────────

async function goToCartWithItems(page: Page) {
  await page.goto('/inventory.html');
  const inventory = new InventoryPage(page);
  await inventory.addToCart(Products.BACKPACK.slug);
  await inventory.header.cartLink.click();
  await expect(page).toHaveURL('/cart.html');
}

// ─── Happy path (FEAT-01 to FEAT-03) ─────────────────────────────────────────

test.describe('FEAT — Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await goToCartWithItems(page);
  });

  test('[FEAT-01] should display item in cart', async ({ page }) => {
    const cart = new CartPage(page);

    await test.step('Verify item is listed', async () => {
      await expect(cart.cartItems).toHaveCount(1);
    });

    await test.step('Verify item name matches catalog', async () => {
      const names = await cart.getItemNames();
      expect(names).toContain(Products.BACKPACK.name);
    });
  });

  test('[FEAT-02] should remove item and clear badge', async ({ page }) => {
    const cart = new CartPage(page);

    await test.step('Remove backpack', async () => {
      await cart.removeItem(Products.BACKPACK.slug);
    });

    await test.step('Verify cart is empty and badge is gone', async () => {
      await expect(cart.cartItems).toHaveCount(0);
      await expect(cart.header.cartBadge).not.toBeVisible();
    });
  });
});

// ─── Edge cases (FEAT-EC) ─────────────────────────────────────────────────────

test.describe('FEAT-EC — Feature Edge Cases', () => {
  test('[FEAT-EC] should handle empty state gracefully', async ({ page }) => {
    await test.step('Navigate to empty state', async () => {
      await page.goto('/cart.html');
    });

    await test.step('Verify empty state UI', async () => {
      const cart = new CartPage(page);
      await expect(cart.cartItems).toHaveCount(0);
    });
  });
});
```

---

## Checklist before committing a new spec

- [ ] File name matches the feature area
- [ ] Non-auth tests import from `./fixtures`
- [ ] Every test has a `[PREFIX-NN]` ID that maps to the test plan
- [ ] Every test has at least one action step and one assertion step
- [ ] Shared setup is extracted into a helper or `beforeEach`, not duplicated
- [ ] Known defects use `test.fail()` with a comment
- [ ] No `page.waitForTimeout()` — use `expect()` with built-in auto-wait
