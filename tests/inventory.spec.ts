import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { Users, VALID_PASSWORD } from '../data/credentials';
import {
  Products,
  SortOptions,
  ExpectedSortOrder,
  TOTAL_PRODUCTS,
} from '../data/products';

test.describe('INV — Inventory / Product Listing', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(Users.STANDARD, VALID_PASSWORD);
    await expect(page).toHaveURL('/inventory.html');
  });

  // ─── Product Display ──────────────────────────────────────────────────────

  test('[INV-01] should display all 6 products with name, description, price and image', async ({ page }) => {
    const inventory = new InventoryPage(page);

    const items = page.locator('[data-test="inventory-item"]');
    await expect(items).toHaveCount(TOTAL_PRODUCTS);

    for (let i = 0; i < TOTAL_PRODUCTS; i++) {
      const item = items.nth(i);
      await expect(item.locator('[data-test="inventory-item-name"]')).not.toBeEmpty();
      await expect(item.locator('[data-test="inventory-item-desc"]')).not.toBeEmpty();
      await expect(item.locator('[data-test="inventory-item-price"]')).not.toBeEmpty();
      await expect(item.locator('img')).toBeVisible();
    }
  });

  // ─── Sorting ──────────────────────────────────────────────────────────────

  test('[INV-02] should display products sorted by Name (A to Z) by default', async ({ page }) => {
    const inventory = new InventoryPage(page);

    const names = await inventory.getProductNames();

    expect(names).toEqual(ExpectedSortOrder.NAME_ASC);
  });

  test('[INV-03] should sort products by Name (Z to A)', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.sortBy(SortOptions.NAME_DESC);

    const names = await inventory.getProductNames();
    expect(names).toEqual(ExpectedSortOrder.NAME_DESC);
  });

  test('[INV-04] should sort products by Price (low to high)', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.sortBy(SortOptions.PRICE_ASC);

    const prices = await inventory.getProductPrices();
    expect(prices).toEqual(ExpectedSortOrder.PRICE_ASC);
  });

  test('[INV-05] should sort products by Price (high to low)', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.sortBy(SortOptions.PRICE_DESC);

    const prices = await inventory.getProductPrices();
    expect(prices).toEqual(ExpectedSortOrder.PRICE_DESC);
  });

  // ─── Cart Interactions ────────────────────────────────────────────────────

  test('[INV-06] should show badge count 1 and change button to Remove when adding a single item', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addToCart(Products.BACKPACK.slug);

    await expect(inventory.header.cartBadge).toHaveText('1');
    await expect(page.locator(`[data-test="remove-${Products.BACKPACK.slug}"]`)).toBeVisible();
    await expect(page.locator(`[data-test="add-to-cart-${Products.BACKPACK.slug}"]`)).not.toBeVisible();
  });

  test('[INV-07] should reflect correct badge count when adding multiple items', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addToCart(Products.BACKPACK.slug);
    await expect(inventory.header.cartBadge).toHaveText('1');

    await inventory.addToCart(Products.BIKE_LIGHT.slug);
    await expect(inventory.header.cartBadge).toHaveText('2');

    await inventory.addToCart(Products.ONESIE.slug);
    await expect(inventory.header.cartBadge).toHaveText('3');
  });

  test('[INV-08] should decrement badge and revert button when removing an item', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addToCart(Products.BACKPACK.slug);
    await inventory.addToCart(Products.BIKE_LIGHT.slug);
    await expect(inventory.header.cartBadge).toHaveText('2');

    await inventory.removeFromCart(Products.BACKPACK.slug);

    await expect(inventory.header.cartBadge).toHaveText('1');
    await expect(page.locator(`[data-test="add-to-cart-${Products.BACKPACK.slug}"]`)).toBeVisible();
  });

  test('[INV-09] should not show cart badge when cart is empty', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await expect(inventory.header.cartBadge).not.toBeVisible();

    await inventory.addToCart(Products.BACKPACK.slug);
    await inventory.removeFromCart(Products.BACKPACK.slug);

    await expect(inventory.header.cartBadge).not.toBeVisible();
  });

  // ─── Navigation ───────────────────────────────────────────────────────────

  test('[INV-10] should navigate to product detail page when clicking product name', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.clickProductName(Products.BACKPACK.name);

    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
  });

  test('[INV-11] should navigate to product detail page when clicking product image', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.clickProductImage(Products.BACKPACK.name);

    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
  });

  test('[INV-12] should navigate to cart page when clicking the cart icon', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addToCart(Products.BACKPACK.slug);
    await inventory.header.cartLink.click();

    await expect(page).toHaveURL('/cart.html');
  });
});
