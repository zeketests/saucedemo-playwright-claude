import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import {
  Products,
  SortOptions,
  ExpectedSortOrder,
  TOTAL_PRODUCTS,
} from '../data/products';

test.describe('INV — Inventory / Product Listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  // ─── Product Display ──────────────────────────────────────────────────────

  test('[INV-01] should display all 6 products with name, description, price and image', async ({ page }) => {
    await test.step('Count products and verify each has name, description, price and image', async () => {
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
  });

  // ─── Sorting ──────────────────────────────────────────────────────────────

  test('[INV-02] should display products sorted by Name (A to Z) by default', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Verify default sort order is Name A to Z', async () => {
      const names = await inventory.getProductNames();
      expect(names).toEqual(ExpectedSortOrder.NAME_ASC);
    });
  });

  test('[INV-03] should sort products by Name (Z to A)', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Select sort option Name Z to A', async () => {
      await inventory.sortBy(SortOptions.NAME_DESC);
    });

    await test.step('Verify products are sorted Name Z to A', async () => {
      const names = await inventory.getProductNames();
      expect(names).toEqual(ExpectedSortOrder.NAME_DESC);
    });
  });

  test('[INV-04] should sort products by Price (low to high)', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Select sort option Price low to high', async () => {
      await inventory.sortBy(SortOptions.PRICE_ASC);
    });

    await test.step('Verify products are sorted by price ascending', async () => {
      const prices = await inventory.getProductPrices();
      expect(prices).toEqual(ExpectedSortOrder.PRICE_ASC);
    });
  });

  test('[INV-05] should sort products by Price (high to low)', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Select sort option Price high to low', async () => {
      await inventory.sortBy(SortOptions.PRICE_DESC);
    });

    await test.step('Verify products are sorted by price descending', async () => {
      const prices = await inventory.getProductPrices();
      expect(prices).toEqual(ExpectedSortOrder.PRICE_DESC);
    });
  });

  // ─── Cart Interactions ────────────────────────────────────────────────────

  test('[INV-06] should show badge count 1 and change button to Remove when adding a single item', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Add backpack to cart', async () => {
      await inventory.addToCart(Products.BACKPACK.slug);
    });

    await test.step('Verify cart badge shows 1 and button changed to Remove', async () => {
      await expect(inventory.header.cartBadge).toHaveText('1');
      await expect(page.locator(`[data-test="remove-${Products.BACKPACK.slug}"]`)).toBeVisible();
      await expect(page.locator(`[data-test="add-to-cart-${Products.BACKPACK.slug}"]`)).not.toBeVisible();
    });
  });

  test('[INV-07] should reflect correct badge count when adding multiple items', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Add backpack — badge should show 1', async () => {
      await inventory.addToCart(Products.BACKPACK.slug);
      await expect(inventory.header.cartBadge).toHaveText('1');
    });

    await test.step('Add bike light — badge should show 2', async () => {
      await inventory.addToCart(Products.BIKE_LIGHT.slug);
      await expect(inventory.header.cartBadge).toHaveText('2');
    });

    await test.step('Add onesie — badge should show 3', async () => {
      await inventory.addToCart(Products.ONESIE.slug);
      await expect(inventory.header.cartBadge).toHaveText('3');
    });
  });

  test('[INV-08] should decrement badge and revert button when removing an item', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Add two items to cart', async () => {
      await inventory.addToCart(Products.BACKPACK.slug);
      await inventory.addToCart(Products.BIKE_LIGHT.slug);
      await expect(inventory.header.cartBadge).toHaveText('2');
    });

    await test.step('Remove backpack from cart', async () => {
      await inventory.removeFromCart(Products.BACKPACK.slug);
    });

    await test.step('Verify badge decremented and button reverted to Add to cart', async () => {
      await expect(inventory.header.cartBadge).toHaveText('1');
      await expect(page.locator(`[data-test="add-to-cart-${Products.BACKPACK.slug}"]`)).toBeVisible();
    });
  });

  test('[INV-09] should not show cart badge when cart is empty', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Verify no badge on load', async () => {
      await expect(inventory.header.cartBadge).not.toBeVisible();
    });

    await test.step('Add then remove item', async () => {
      await inventory.addToCart(Products.BACKPACK.slug);
      await inventory.removeFromCart(Products.BACKPACK.slug);
    });

    await test.step('Verify badge is gone again', async () => {
      await expect(inventory.header.cartBadge).not.toBeVisible();
    });
  });

  // ─── Navigation ───────────────────────────────────────────────────────────

  test('[INV-10] should navigate to product detail page when clicking product name', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Click product name', async () => {
      await inventory.clickProductName(Products.BACKPACK.name);
    });

    await test.step('Verify navigation to product detail page', async () => {
      await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
    });
  });

  test('[INV-11] should navigate to product detail page when clicking product image', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Click product image', async () => {
      await inventory.clickProductImage(Products.BACKPACK.name);
    });

    await test.step('Verify navigation to product detail page', async () => {
      await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
    });
  });

  test('[INV-12] should navigate to cart page when clicking the cart icon', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step('Add item to cart and click cart icon', async () => {
      await inventory.addToCart(Products.BACKPACK.slug);
      await inventory.header.cartLink.click();
    });

    await test.step('Verify navigation to cart page', async () => {
      await expect(page).toHaveURL('/cart.html');
    });
  });
});
