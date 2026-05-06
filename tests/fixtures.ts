import { test as base, type Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { SaucedemoRoutes } from '../data/api';
import { Products } from '../data/products';

export async function navigateToCartWithItems(page: Page) {
  await page.goto(SaucedemoRoutes.INVENTORY);
  const inventory = new InventoryPage(page);
  await inventory.addToCart(Products.BACKPACK.slug);
  await inventory.addToCart(Products.BIKE_LIGHT.slug);
  await inventory.header.goToCart();
}

export async function navigateToCheckoutStep1(page: Page) {
  await navigateToCartWithItems(page);
  const cart = new CartPage(page);
  await cart.proceedToCheckout();
}

export async function placeOrder(page: Page) {
  await page.goto(SaucedemoRoutes.INVENTORY);
  const inventory = new InventoryPage(page);
  await inventory.addToCart(Products.BACKPACK.slug);
  await inventory.header.goToCart();
  const cart = new CartPage(page);
  await cart.proceedToCheckout();
  const checkout = new CheckoutInfoPage(page);
  await checkout.fillForm('John', 'Doe', '12345');
  await checkout.continue();
  const overview = new CheckoutOverviewPage(page);
  await overview.finish();
}

export const test = base.extend({
  storageState: '.auth/user.json',
});

export const problemTest = base.extend({
  storageState: '.auth/problem-user.json',
});

export const errorTest = base.extend({
  storageState: '.auth/error-user.json',
});

export { expect } from '@playwright/test';
