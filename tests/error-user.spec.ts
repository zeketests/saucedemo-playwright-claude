import { errorTest as test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { Products, SortOptions, ExpectedSortOrder } from '../data/products';
import { SaucedemoRoutes } from '../data/api';

test.describe('ERR — error_user Known Defects', { tag: '@regression' }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(SaucedemoRoutes.INVENTORY);
  });

  // Known defect: add to cart fails for Bolt T-Shirt, Fleece Jacket, and Red T-Shirt.
  // Button stays "Add to cart" and badge does not increment.
  test('[ERR-01] all products should be addable to cart', async ({ page }) => {
    test.fail(true, 'error_user: add to cart fails for Bolt T-Shirt, Fleece Jacket, and Red T-Shirt');

    const inventory = new InventoryPage(page);
    const failingProducts = [Products.BOLT_TSHIRT, Products.FLEECE_JACKET, Products.RED_TSHIRT];

    for (const product of failingProducts) {
      await inventory.addToCart(product.slug);
      await expect(page.locator(`[data-test="remove-${product.slug}"]`)).toBeVisible();
    }
  });

  // Known defect: remove from cart on inventory page fails.
  // After clicking Remove the button does not revert to "Add to cart" and the badge
  // does not decrement. Only reproducible from the inventory page — remove on the
  // cart page works correctly.
  test('[ERR-02] removing an item from the inventory page should revert button and decrement badge', async ({ page }) => {
    test.fail(true, 'error_user: remove from inventory page does not revert button or decrement badge');

    const inventory = new InventoryPage(page);

    await inventory.addToCart(Products.BACKPACK.slug);
    await expect(inventory.header.cartBadge).toHaveText('1');

    await inventory.removeFromCart(Products.BACKPACK.slug);

    await expect(page.locator(`[data-test="add-to-cart-${Products.BACKPACK.slug}"]`)).toBeVisible();
    await expect(inventory.header.cartBadge).not.toBeVisible();
  });

  // Known defect: any sort selection fires an alert "Sorting is broken! This error
  // has been reported to Backtrace." and the product order does not change.
  test('[ERR-03] sorting products should reorder the list without an alert', async ({ page }) => {
    test.fail(true, 'error_user: sort fires alert "Sorting is broken!" and products stay in default order');

    const inventory = new InventoryPage(page);

    page.on('dialog', async (dialog) => {
      throw new Error(`Unexpected dialog: ${dialog.message()}`);
    });

    await inventory.sortBy(SortOptions.NAME_DESC);

    const names = await inventory.getProductNames();
    expect(names).toEqual(ExpectedSortOrder.NAME_DESC);
  });

  // Known defect: clicking Finish on the checkout overview page does not navigate
  // to the order confirmation page. The app stays on checkout-step-two.html and
  // throws a JS TypeError.
  test('[ERR-04] completing checkout should navigate to order confirmation', async ({ page }) => {
    test.fail(true, 'error_user: Finish button on checkout overview does not navigate to checkout-complete');

    await page.goto(SaucedemoRoutes.CART);
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL(SaucedemoRoutes.CHECKOUT_COMPLETE);
  });
});
