import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { Products } from '../data/products';
import { Page } from '@playwright/test';

async function placeOrder(page: Page) {
  await page.goto('/inventory.html');
  const inventory = new InventoryPage(page);
  await inventory.addToCart(Products.BACKPACK.slug);
  await inventory.header.cartLink.click();

  const cart = new CartPage(page);
  await cart.proceedToCheckout();

  const checkoutInfo = new CheckoutInfoPage(page);
  await checkoutInfo.fillForm('John', 'Doe', '12345');
  await checkoutInfo.continue();

  const overview = new CheckoutOverviewPage(page);
  await overview.finish();

  await expect(page).toHaveURL('/checkout-complete.html');
}

test.describe('CONF — Order Confirmation', () => {
  test.beforeEach(async ({ page }) => {
    await placeOrder(page);
  });

  test('[CONF-01] should display the order confirmation heading', async ({ page }) => {
    const confirmation = new OrderConfirmationPage(page);

    await test.step('Verify confirmation heading is displayed', async () => {
      await expect(confirmation.completeHeader).toHaveText('Thank you for your order!');
    });
  });

  test('[CONF-02] should display the Pony Express image', async ({ page }) => {
    const confirmation = new OrderConfirmationPage(page);

    await test.step('Verify Pony Express image is visible', async () => {
      await expect(confirmation.ponyExpressImage).toBeVisible();
    });
  });

  test('[CONF-03] should not show cart badge after order is completed', async ({ page }) => {
    const confirmation = new OrderConfirmationPage(page);

    await test.step('Verify cart badge is not visible', async () => {
      await expect(confirmation.header.cartBadge).not.toBeVisible();
    });
  });

  test('[CONF-04] should navigate back to inventory when clicking "Back Home"', async ({ page }) => {
    const confirmation = new OrderConfirmationPage(page);

    await test.step('Click Back Home', async () => {
      await confirmation.backToProducts();
    });

    await test.step('Verify navigation back to inventory', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
  });

  test('[CONF-05] should show all products with "Add to cart" buttons after order completes', async ({ page }) => {
    const confirmation = new OrderConfirmationPage(page);

    await test.step('Navigate back to inventory', async () => {
      await confirmation.backToProducts();
    });

    await test.step('Verify all 6 products show "Add to cart" with no Remove buttons', async () => {
      const addToCartButtons = page.locator('[data-test^="add-to-cart"]');
      await expect(addToCartButtons).toHaveCount(6);
      await expect(page.locator('[data-test^="remove-"]')).toHaveCount(0);
    });
  });
});
