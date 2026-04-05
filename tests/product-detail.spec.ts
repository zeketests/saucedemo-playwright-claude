import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { Products } from '../data/products';

const PRODUCT = Products.BACKPACK;

test.describe('DET — Product Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
    const inventory = new InventoryPage(page);
    await inventory.clickProductName(PRODUCT.name);
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
  });

  test('[DET-01] should display correct product name, description, price and image', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await test.step('Verify product details match catalog data', async () => {
      await expect(detail.productName).toHaveText(PRODUCT.name);
      await expect(detail.productPrice).toHaveText(`$${PRODUCT.price}`);
      await expect(detail.productDescription).not.toBeEmpty();
      await expect(detail.productImage).toBeVisible();
    });
  });

  test('[DET-02] should increment cart badge when adding to cart from detail page', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await test.step('Verify cart is initially empty', async () => {
      await expect(detail.header.cartBadge).not.toBeVisible();
    });

    await test.step('Add product to cart', async () => {
      await detail.addToCart();
    });

    await test.step('Verify cart badge shows 1', async () => {
      await expect(detail.header.cartBadge).toHaveText('1');
    });
  });

  test('[DET-03] should change button from "Add to cart" to "Remove" after adding', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await test.step('Verify initial button state is "Add to cart"', async () => {
      await expect(detail.addToCartButton).toBeVisible();
      await expect(detail.removeButton).not.toBeVisible();
    });

    await test.step('Add product to cart', async () => {
      await detail.addToCart();
    });

    await test.step('Verify button changed to "Remove"', async () => {
      await expect(detail.removeButton).toBeVisible();
      await expect(detail.addToCartButton).not.toBeVisible();
    });
  });

  test('[DET-04] should decrement cart badge and revert button when removing from detail page', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await test.step('Add product to cart', async () => {
      await detail.addToCart();
      await expect(detail.header.cartBadge).toHaveText('1');
    });

    await test.step('Remove product from cart', async () => {
      await detail.removeFromCart();
    });

    await test.step('Verify badge is gone and button reverted to "Add to cart"', async () => {
      await expect(detail.header.cartBadge).not.toBeVisible();
      await expect(detail.addToCartButton).toBeVisible();
      await expect(detail.removeButton).not.toBeVisible();
    });
  });

  test('[DET-05] should return to inventory when clicking "Back to products"', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await test.step('Click "Back to products"', async () => {
      await detail.goBackToInventory();
    });

    await test.step('Verify navigation back to inventory', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
  });

  test('[DET-06] should persist cart state when navigating back to inventory', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    const inventory = new InventoryPage(page);

    await test.step('Add product to cart from detail page', async () => {
      await detail.addToCart();
      await expect(detail.header.cartBadge).toHaveText('1');
    });

    await test.step('Navigate back to inventory', async () => {
      await detail.goBackToInventory();
    });

    await test.step('Verify cart state persists on inventory page', async () => {
      await expect(inventory.header.cartBadge).toHaveText('1');
      await expect(page.locator(`[data-test="remove-${PRODUCT.slug}"]`)).toBeVisible();
    });
  });
});
