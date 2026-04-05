import { type Page, type Locator } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';

export class CartPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async removeItem(slug: string) {
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  getItemNames(): Promise<string[]> {
    return this.cartItems
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  }

  getItemQuantities(): Promise<string[]> {
    return this.cartItems
      .locator('[data-test="item-quantity"]')
      .allTextContents();
  }

  getItemPrices(): Promise<string[]> {
    return this.cartItems
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();
  }
}
