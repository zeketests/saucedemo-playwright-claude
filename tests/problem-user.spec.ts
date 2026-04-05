import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { SortOptions, TOTAL_PRODUCTS } from '../data/products';

/**
 * problem_user defect documentation.
 *
 * These tests use test.fail() to document known bugs in the problem_user account.
 * They will alert if any of these defects are ever fixed upstream.
 */
test.describe('PROB — problem_user Known Defects', () => {
  test.use({ storageState: '.auth/problem-user.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  // Known defect: all product images share the same broken src instead of showing
  // individual product images. The src points to a dog image for every product.
  test('[PROB-01] all product images should have unique and valid src attributes', async ({ page }) => {
    test.fail(true, 'problem_user: all product images render the same broken src (dog image)');

    await test.step('Collect all product image src attributes', async () => {
      const images = page.locator('[data-test="inventory-item"] img');
      await expect(images).toHaveCount(TOTAL_PRODUCTS);

      const srcs: string[] = [];
      for (let i = 0; i < TOTAL_PRODUCTS; i++) {
        const src = await images.nth(i).getAttribute('src');
        srcs.push(src ?? '');
      }

      await test.step('Verify all src values are unique (no shared broken image)', async () => {
        const uniqueSrcs = new Set(srcs);
        expect(uniqueSrcs.size).toBe(TOTAL_PRODUCTS);
      });
    });
  });

  // Known defect: sort by Name Z to A has no effect for problem_user — the product
  // order stays the same as the default A to Z sort.
  test('[PROB-02] sort by Name (Z to A) should reorder products correctly', async ({ page }) => {
    test.fail(true, 'problem_user: sort Z to A does not reorder products (order unchanged)');

    const inventory = new InventoryPage(page);

    await test.step('Get initial product order', async () => {
      const initialNames = await inventory.getProductNames();

      await test.step('Select sort Name Z to A', async () => {
        await inventory.sortBy(SortOptions.NAME_DESC);
      });

      await test.step('Verify products are now in reversed order', async () => {
        const sortedNames = await inventory.getProductNames();
        expect(sortedNames).not.toEqual(initialNames);
        expect(sortedNames).toEqual([...initialNames].reverse());
      });
    });
  });
});
