import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { Users, VALID_PASSWORD } from '../data/credentials';
import { Products } from '../data/products';

const PRODUCT = Products.BACKPACK;

test.describe('DET — Product Detail', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(Users.STANDARD, VALID_PASSWORD);

    const inventory = new InventoryPage(page);
    await inventory.clickProductName(PRODUCT.name);
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
  });

  test('[DET-01] should display correct product name, description, price and image', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await expect(detail.productName).toHaveText(PRODUCT.name);
    await expect(detail.productPrice).toHaveText(`$${PRODUCT.price}`);
    await expect(detail.productDescription).not.toBeEmpty();
    await expect(detail.productImage).toBeVisible();
  });

  test('[DET-02] should increment cart badge when adding to cart from detail page', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await expect(detail.header.cartBadge).not.toBeVisible();

    await detail.addToCart();

    await expect(detail.header.cartBadge).toHaveText('1');
  });

  test('[DET-03] should change button from "Add to cart" to "Remove" after adding', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await expect(detail.addToCartButton).toBeVisible();
    await expect(detail.removeButton).not.toBeVisible();

    await detail.addToCart();

    await expect(detail.removeButton).toBeVisible();
    await expect(detail.addToCartButton).not.toBeVisible();
  });

  test('[DET-04] should decrement cart badge and revert button when removing from detail page', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await detail.addToCart();
    await expect(detail.header.cartBadge).toHaveText('1');

    await detail.removeFromCart();

    await expect(detail.header.cartBadge).not.toBeVisible();
    await expect(detail.addToCartButton).toBeVisible();
    await expect(detail.removeButton).not.toBeVisible();
  });

  test('[DET-05] should return to inventory when clicking "Back to products"', async ({ page }) => {
    const detail = new ProductDetailPage(page);

    await detail.goBackToInventory();

    await expect(page).toHaveURL('/inventory.html');
  });

  test('[DET-06] should persist cart state when navigating back to inventory', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    const inventory = new InventoryPage(page);

    await detail.addToCart();
    await expect(detail.header.cartBadge).toHaveText('1');

    await detail.goBackToInventory();

    await expect(inventory.header.cartBadge).toHaveText('1');
    await expect(page.locator(`[data-test="remove-${PRODUCT.slug}"]`)).toBeVisible();
  });
});
