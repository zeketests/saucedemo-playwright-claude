import { test, expect, navigateToCartWithItems } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { Users, VALID_PASSWORD } from '../data/credentials';
import { Products } from '../data/products';
import { SaucedemoRoutes } from '../data/api';

test.describe('CART — Shopping Cart', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCartWithItems(page);
  });

  test('[CART-01] should display all added items with correct name, quantity and price', { tag: '@smoke' }, async ({ page }) => {
    const cart = new CartPage(page);

    await test.step('Verify 2 items are listed', async () => {
      await expect(cart.cartItems).toHaveCount(2);
    });

    await test.step('Verify item names match added products', async () => {
      const names = await cart.getItemNames();
      expect(names).toContain(Products.BACKPACK.name);
      expect(names).toContain(Products.BIKE_LIGHT.name);
    });

    await test.step('Verify quantities are 1 each', async () => {
      const quantities = await cart.getItemQuantities();
      expect(quantities).toEqual(['1', '1']);
    });

    await test.step('Verify prices match catalog data', async () => {
      const prices = await cart.getItemPrices();
      expect(prices).toContain(`$${Products.BACKPACK.price}`);
      expect(prices).toContain(`$${Products.BIKE_LIGHT.price}`);
    });
  });

  test('[CART-02] should remove a single item and decrement cart badge', async ({ page }) => {
    const cart = new CartPage(page);

    await test.step('Remove backpack from cart', async () => {
      await cart.removeItem(Products.BACKPACK.slug);
    });

    await test.step('Verify cart shows 1 item and badge decremented', async () => {
      await expect(cart.cartItems).toHaveCount(1);
      await expect(cart.header.cartBadge).toHaveText('1');
      const names = await cart.getItemNames();
      expect(names).not.toContain(Products.BACKPACK.name);
    });
  });

  test('[CART-03] should remove all items and hide cart badge', async ({ page }) => {
    const cart = new CartPage(page);

    await test.step('Remove both items from cart', async () => {
      await cart.removeItem(Products.BACKPACK.slug);
      await cart.removeItem(Products.BIKE_LIGHT.slug);
    });

    await test.step('Verify cart is empty and badge is gone', async () => {
      await expect(cart.cartItems).toHaveCount(0);
      await expect(cart.header.cartBadge).not.toBeVisible();
    });
  });

  test('[CART-04] should navigate back to inventory when clicking "Continue Shopping"', async ({ page }) => {
    const cart = new CartPage(page);

    await test.step('Click Continue Shopping', async () => {
      await cart.continueShopping();
    });

    await test.step('Verify navigation to inventory', async () => {
      await expect(page).toHaveURL(SaucedemoRoutes.INVENTORY);
    });
  });

  test('[CART-05] should persist cart items after navigating back to inventory and returning', async ({ page }) => {
    const cart = new CartPage(page);

    await test.step('Navigate back to inventory', async () => {
      await cart.continueShopping();
      await expect(page).toHaveURL(SaucedemoRoutes.INVENTORY);
    });

    await test.step('Verify cart badge still shows 2', async () => {
      const inventory = new InventoryPage(page);
      await expect(inventory.header.cartBadge).toHaveText('2');
    });

    await test.step('Return to cart and verify items are still there', async () => {
      const inventory = new InventoryPage(page);
      await inventory.header.goToCart();
      await expect(page).toHaveURL(SaucedemoRoutes.CART);
      await expect(cart.cartItems).toHaveCount(2);
    });
  });

  test('[CART-06] should navigate to checkout step 1 when clicking Checkout', { tag: '@smoke' }, async ({ page }) => {
    const cart = new CartPage(page);

    await test.step('Click Checkout', async () => {
      await cart.proceedToCheckout();
    });

    await test.step('Verify navigation to checkout step 1', async () => {
      await expect(page).toHaveURL(SaucedemoRoutes.CHECKOUT_STEP_ONE);
    });
  });

  // Known saucedemo defect: logout does not clear localStorage, so cart-contents
  // persists across sessions. Marked test.fail() — will alert if ever fixed upstream.
  test('[CART-07] should start with an empty cart after logout and re-login', async ({ page }) => {
    test.fail(true, 'saucedemo does not clear cart on logout (localStorage not cleared)');

    const cart = new CartPage(page);
    await expect(cart.header.cartBadge).toHaveText('2');

    await test.step('Logout', async () => {
      await cart.header.logout();
      await expect(page).toHaveURL(SaucedemoRoutes.HOME);
    });

    await test.step('Re-login as standard_user', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.login(Users.STANDARD, VALID_PASSWORD);
      await expect(page).toHaveURL(SaucedemoRoutes.INVENTORY);
    });

    await test.step('Verify cart is empty after new session', async () => {
      const inventory = new InventoryPage(page);
      await expect(inventory.header.cartBadge).not.toBeVisible();
    });
  });
});
