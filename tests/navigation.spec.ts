import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { Users, VALID_PASSWORD } from '../data/credentials';
import { Products, TOTAL_PRODUCTS } from '../data/products';

test.describe('NAV — Navigation & Session', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(Users.STANDARD, VALID_PASSWORD);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('[NAV-01] should show all 4 menu items in hamburger menu', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.header.openMenu();

    await expect(page.locator('[data-test="inventory-sidebar-link"]')).toBeVisible();
    await expect(page.locator('[data-test="about-sidebar-link"]')).toBeVisible();
    await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
    await expect(page.locator('[data-test="reset-sidebar-link"]')).toBeVisible();

    await inventory.header.closeMenu();
  });

  test('[NAV-02] should navigate to inventory when clicking "All Items"', async ({ page }) => {
    const cart = new CartPage(page);
    await page.goto('/cart.html');
    await expect(page).toHaveURL('/cart.html');

    await cart.header.goToAllItems();

    await expect(page).toHaveURL('/inventory.html');
  });

  test('[NAV-03] should logout and clear session via hamburger menu', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.header.logout();

    await expect(page).toHaveURL('/');
    await expect(new LoginPage(page).usernameInput).toBeVisible();
  });

  test('[NAV-04] should clear cart badge and reset buttons when using "Reset App State"', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addToCart(Products.BACKPACK.slug);
    await inventory.addToCart(Products.BIKE_LIGHT.slug);
    await expect(inventory.header.cartBadge).toHaveText('2');

    await inventory.header.resetAppState();

    await expect(inventory.header.cartBadge).not.toBeVisible();

    // Reload to confirm buttons are fully reset after state clear
    await page.reload();
    await expect(page.locator('[data-test^="add-to-cart"]')).toHaveCount(TOTAL_PRODUCTS);
    await expect(page.locator('[data-test^="remove-"]')).toHaveCount(0);
  });

  test('[NAV-05] should redirect to login with error when accessing protected page after logout', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.header.logout();

    await page.goto('/inventory.html');

    await expect(page).toHaveURL('/');
    await expect(new LoginPage(page).errorMessage).toBeVisible();
  });
});
