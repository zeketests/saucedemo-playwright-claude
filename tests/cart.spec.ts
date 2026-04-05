import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { Users, VALID_PASSWORD } from '../data/credentials';
import { Products } from '../data/products';

async function loginAndGoToCart(page: any) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(Users.STANDARD, VALID_PASSWORD);

  const inventory = new InventoryPage(page);
  await inventory.addToCart(Products.BACKPACK.slug);
  await inventory.addToCart(Products.BIKE_LIGHT.slug);
  await inventory.header.cartLink.click();
  await expect(page).toHaveURL('/cart.html');
}

test.describe('CART — Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToCart(page);
  });

  test('[CART-01] should display all added items with correct name, quantity and price', async ({ page }) => {
    const cart = new CartPage(page);

    await expect(cart.cartItems).toHaveCount(2);

    const names = await cart.getItemNames();
    expect(names).toContain(Products.BACKPACK.name);
    expect(names).toContain(Products.BIKE_LIGHT.name);

    const quantities = await cart.getItemQuantities();
    expect(quantities).toEqual(['1', '1']);

    const prices = await cart.getItemPrices();
    expect(prices).toContain(`$${Products.BACKPACK.price}`);
    expect(prices).toContain(`$${Products.BIKE_LIGHT.price}`);
  });

  test('[CART-02] should remove a single item and decrement cart badge', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.removeItem(Products.BACKPACK.slug);

    await expect(cart.cartItems).toHaveCount(1);
    await expect(cart.header.cartBadge).toHaveText('1');
    const names = await cart.getItemNames();
    expect(names).not.toContain(Products.BACKPACK.name);
  });

  test('[CART-03] should remove all items and hide cart badge', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.removeItem(Products.BACKPACK.slug);
    await cart.removeItem(Products.BIKE_LIGHT.slug);

    await expect(cart.cartItems).toHaveCount(0);
    await expect(cart.header.cartBadge).not.toBeVisible();
  });

  test('[CART-04] should navigate back to inventory when clicking "Continue Shopping"', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.continueShopping();

    await expect(page).toHaveURL('/inventory.html');
  });

  test('[CART-05] should persist cart items after navigating back to inventory and returning', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.continueShopping();
    await expect(page).toHaveURL('/inventory.html');

    const inventory = new InventoryPage(page);
    await expect(inventory.header.cartBadge).toHaveText('2');

    await inventory.header.cartLink.click();

    await expect(page).toHaveURL('/cart.html');
    await expect(cart.cartItems).toHaveCount(2);
  });

  test('[CART-06] should navigate to checkout step 1 when clicking Checkout', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.proceedToCheckout();

    await expect(page).toHaveURL('/checkout-step-one.html');
  });

  // Known saucedemo defect: logout does not clear localStorage, so cart-contents
  // persists across sessions. Marked test.fail() — will alert if ever fixed upstream.
  test('[CART-07] should start with an empty cart after logout and re-login', async ({ page }) => {
    test.fail(true, 'saucedemo does not clear cart on logout (localStorage not cleared)');

    const cart = new CartPage(page);
    await expect(cart.header.cartBadge).toHaveText('2');

    await cart.header.logout();
    await expect(page).toHaveURL('/');

    const loginPage = new LoginPage(page);
    await loginPage.login(Users.STANDARD, VALID_PASSWORD);
    await expect(page).toHaveURL('/inventory.html');

    const inventory = new InventoryPage(page);
    await expect(inventory.header.cartBadge).not.toBeVisible();
  });
});
