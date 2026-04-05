import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { Products, TOTAL_PRODUCTS } from '../data/products';

test.describe('NAV — Navigation & Session', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('[NAV-01] should show all 4 menu items in hamburger menu', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Open hamburger menu', async () => {
      await inventory.header.openMenu();
    });

    await test.step('Verify all 4 menu items are visible', async () => {
      await expect(page.locator('[data-test="inventory-sidebar-link"]')).toBeVisible();
      await expect(page.locator('[data-test="about-sidebar-link"]')).toBeVisible();
      await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
      await expect(page.locator('[data-test="reset-sidebar-link"]')).toBeVisible();
    });

    await test.step('Close hamburger menu', async () => {
      await inventory.header.closeMenu();
    });
  });

  test('[NAV-02] should navigate to inventory when clicking "All Items"', async ({ page }) => {
    const cart = new CartPage(page);

    await test.step('Navigate to cart page', async () => {
      await page.goto('/cart.html');
      await expect(page).toHaveURL('/cart.html');
    });

    await test.step('Click All Items from hamburger menu', async () => {
      await cart.header.goToAllItems();
    });

    await test.step('Verify navigation to inventory', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
  });

  test('[NAV-03] should logout and clear session via hamburger menu', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Logout via hamburger menu', async () => {
      await inventory.header.logout();
    });

    await test.step('Verify session is cleared and login form is shown', async () => {
      await expect(page).toHaveURL('/');
      await expect(new LoginPage(page).usernameInput).toBeVisible();
    });
  });

  test('[NAV-04] should clear cart badge and reset buttons when using "Reset App State"', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Add two items to cart', async () => {
      await inventory.addToCart(Products.BACKPACK.slug);
      await inventory.addToCart(Products.BIKE_LIGHT.slug);
      await expect(inventory.header.cartBadge).toHaveText('2');
    });

    await test.step('Reset app state via hamburger menu', async () => {
      await inventory.header.resetAppState();
    });

    await test.step('Verify cart badge is gone and all buttons reset after reload', async () => {
      await expect(inventory.header.cartBadge).not.toBeVisible();
      // Reload to confirm buttons are fully reset after state clear
      await page.reload();
      await expect(page.locator('[data-test^="add-to-cart"]')).toHaveCount(TOTAL_PRODUCTS);
      await expect(page.locator('[data-test^="remove-"]')).toHaveCount(0);
    });
  });

  test('[NAV-05] should redirect to login with error when accessing protected page after logout', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Logout', async () => {
      await inventory.header.logout();
    });

    await test.step('Attempt to access protected route', async () => {
      await page.goto('/inventory.html');
    });

    await test.step('Verify redirect to login with error', async () => {
      await expect(page).toHaveURL('/');
      await expect(new LoginPage(page).errorMessage).toBeVisible();
    });
  });
});
