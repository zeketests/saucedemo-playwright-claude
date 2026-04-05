import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutErrors } from '../data/credentials';
import { Products } from '../data/products';
import { Page } from '@playwright/test';

async function goToCheckoutStep1(page: Page) {
  await page.goto('/inventory.html');
  const inventory = new InventoryPage(page);
  await inventory.addToCart(Products.BACKPACK.slug);
  await inventory.addToCart(Products.BIKE_LIGHT.slug);
  await inventory.header.cartLink.click();

  const cart = new CartPage(page);
  await cart.proceedToCheckout();
  await expect(page).toHaveURL('/checkout-step-one.html');
}

// ─── Step 1: Customer Information (CHK1-01 to CHK1-05) ───────────────────────

test.describe('CHK1 — Checkout: Customer Information', () => {
  test.beforeEach(async ({ page }) => {
    await goToCheckoutStep1(page);
  });

  test('[CHK1-01] should show error when submitting empty form', async ({ page }) => {
    const checkout = new CheckoutInfoPage(page);

    await test.step('Submit empty form', async () => {
      await checkout.continue();
    });

    await test.step('Verify first name required error', async () => {
      await expect(checkout.errorMessage).toBeVisible();
      await expect(checkout.errorMessage).toHaveText(CheckoutErrors.FIRST_NAME_REQUIRED);
      await expect(page).toHaveURL('/checkout-step-one.html');
    });
  });

  test('[CHK1-02] should show error when last name is missing', async ({ page }) => {
    const checkout = new CheckoutInfoPage(page);

    await test.step('Fill first name only and submit', async () => {
      await checkout.firstNameInput.fill('John');
      await checkout.continue();
    });

    await test.step('Verify last name required error', async () => {
      await expect(checkout.errorMessage).toBeVisible();
      await expect(checkout.errorMessage).toHaveText(CheckoutErrors.LAST_NAME_REQUIRED);
      await expect(page).toHaveURL('/checkout-step-one.html');
    });
  });

  test('[CHK1-03] should show error when postal code is missing', async ({ page }) => {
    const checkout = new CheckoutInfoPage(page);

    await test.step('Fill first and last name, skip postal code, and submit', async () => {
      await checkout.firstNameInput.fill('John');
      await checkout.lastNameInput.fill('Doe');
      await checkout.continue();
    });

    await test.step('Verify postal code required error', async () => {
      await expect(checkout.errorMessage).toBeVisible();
      await expect(checkout.errorMessage).toHaveText(CheckoutErrors.POSTAL_CODE_REQUIRED);
      await expect(page).toHaveURL('/checkout-step-one.html');
    });
  });

  test('[CHK1-04] should advance to order summary when all fields are filled', async ({ page }) => {
    const checkout = new CheckoutInfoPage(page);

    await test.step('Fill all fields and submit', async () => {
      await checkout.fillForm('John', 'Doe', '12345');
      await checkout.continue();
    });

    await test.step('Verify navigation to order summary', async () => {
      await expect(page).toHaveURL('/checkout-step-two.html');
    });
  });

  test('[CHK1-05] should return to cart when clicking Cancel', async ({ page }) => {
    const checkout = new CheckoutInfoPage(page);
    const cart = new CartPage(page);

    await test.step('Click Cancel', async () => {
      await checkout.cancel();
    });

    await test.step('Verify return to cart with items intact', async () => {
      await expect(page).toHaveURL('/cart.html');
      await expect(cart.cartItems).toHaveCount(2);
    });
  });
});

// ─── Step 2: Order Summary (CHK2-01 to CHK2-08) ──────────────────────────────

test.describe('CHK2 — Checkout: Order Summary', () => {
  test.beforeEach(async ({ page }) => {
    await goToCheckoutStep1(page);

    const checkout = new CheckoutInfoPage(page);
    await checkout.fillForm('John', 'Doe', '12345');
    await checkout.continue();
    await expect(page).toHaveURL('/checkout-step-two.html');
  });

  test('[CHK2-01] should list all cart items with correct names and prices', async ({ page }) => {
    const overview = new CheckoutOverviewPage(page);

    await test.step('Verify item names match added products', async () => {
      const names = await overview.getItemNames();
      expect(names).toContain(Products.BACKPACK.name);
      expect(names).toContain(Products.BIKE_LIGHT.name);
    });

    await test.step('Verify item prices match catalog data', async () => {
      const prices = await overview.getItemPrices();
      expect(prices).toContain(`$${Products.BACKPACK.price}`);
      expect(prices).toContain(`$${Products.BIKE_LIGHT.price}`);
    });
  });

  test('[CHK2-02] should show correct item subtotal', async ({ page }) => {
    const overview = new CheckoutOverviewPage(page);
    const expectedSubtotal = (Products.BACKPACK.price + Products.BIKE_LIGHT.price).toFixed(2);

    await test.step('Verify subtotal equals sum of item prices', async () => {
      await expect(overview.subtotalLabel).toHaveText(`Item total: $${expectedSubtotal}`);
    });
  });

  test('[CHK2-03] should show correct tax amount (8%)', async ({ page }) => {
    const overview = new CheckoutOverviewPage(page);
    const subtotal = Products.BACKPACK.price + Products.BIKE_LIGHT.price;
    const expectedTax = (subtotal * 0.08).toFixed(2);

    await test.step('Verify tax is 8% of subtotal', async () => {
      await expect(overview.taxLabel).toHaveText(`Tax: $${expectedTax}`);
    });
  });

  test('[CHK2-04] should show correct order total (subtotal + tax)', async ({ page }) => {
    const overview = new CheckoutOverviewPage(page);
    const subtotal = Products.BACKPACK.price + Products.BIKE_LIGHT.price;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const expectedTotal = (subtotal + tax).toFixed(2);

    await test.step('Verify total equals subtotal plus tax', async () => {
      await expect(overview.totalLabel).toHaveText(`Total: $${expectedTotal}`);
    });
  });

  test('[CHK2-05] should display payment information', async ({ page }) => {
    const overview = new CheckoutOverviewPage(page);

    await test.step('Verify payment info shows SauceCard #31337', async () => {
      await expect(overview.paymentInfoValue).toHaveText('SauceCard #31337');
    });
  });

  test('[CHK2-06] should display shipping information', async ({ page }) => {
    const overview = new CheckoutOverviewPage(page);

    await test.step('Verify shipping info shows Free Pony Express Delivery', async () => {
      await expect(overview.shippingInfoValue).toHaveText('Free Pony Express Delivery!');
    });
  });

  test('[CHK2-07] should navigate to order confirmation when clicking Finish', async ({ page }) => {
    const overview = new CheckoutOverviewPage(page);

    await test.step('Click Finish', async () => {
      await overview.finish();
    });

    await test.step('Verify navigation to order confirmation', async () => {
      await expect(page).toHaveURL('/checkout-complete.html');
    });
  });

  test('[CHK2-08] should return to inventory when clicking Cancel', async ({ page }) => {
    const overview = new CheckoutOverviewPage(page);

    await test.step('Click Cancel', async () => {
      await overview.cancel();
    });

    await test.step('Verify navigation back to inventory', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
  });
});

// ─── Edge Case: Checkout with empty cart ─────────────────────────────────────

test.describe('CHK-EC — Checkout: Edge Cases', () => {
  test('[CHK-EC] should allow checkout with empty cart and show $0 totals', async ({ page }) => {
    await test.step('Navigate directly to empty cart and proceed to checkout', async () => {
      await page.goto('/cart.html');
      const cart = new CartPage(page);
      await cart.proceedToCheckout();
      await expect(page).toHaveURL('/checkout-step-one.html');
    });

    await test.step('Fill checkout form and continue', async () => {
      const checkout = new CheckoutInfoPage(page);
      await checkout.fillForm('John', 'Doe', '12345');
      await checkout.continue();
      await expect(page).toHaveURL('/checkout-step-two.html');
    });

    await test.step('Verify all totals show $0 (saucedemo omits decimals for zero)', async () => {
      const overview = new CheckoutOverviewPage(page);
      // saucedemo omits decimals for subtotal ($0) but keeps them for tax/total ($0.00)
      await expect(overview.subtotalLabel).toHaveText('Item total: $0');
      await expect(overview.taxLabel).toHaveText('Tax: $0.00');
      await expect(overview.totalLabel).toHaveText('Total: $0.00');
    });
  });
});
