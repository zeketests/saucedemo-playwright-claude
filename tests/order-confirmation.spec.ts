import { test, expect, placeOrder } from './fixtures';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { SaucedemoRoutes } from '../data/api';

test.describe('CONF — Order Confirmation', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await placeOrder(page);
  });

  test('[CONF-01] should display the order confirmation heading', { tag: '@smoke' }, async ({ page }) => {
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
      await expect(page).toHaveURL(SaucedemoRoutes.INVENTORY);
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
