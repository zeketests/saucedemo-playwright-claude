import { type Page, type Locator } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';
import { type SortOption } from '../data/products';

export class InventoryPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly logo: Locator;
  readonly inventoryList: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.logo = page.locator('.app_logo');
    this.inventoryList = page.locator('[data-test="inventory-container"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  // Returns scoped locator for a single product card by name
  getProductCard(productName: string): Locator {
    return this.inventoryList
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: productName });
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async addToCart(slug: string) {
    await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async removeFromCart(slug: string) {
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async clickProductName(productName: string) {
    await this.getProductCard(productName)
      .locator('[data-test$="-title-link"]')
      .click();
  }

  async clickProductImage(productName: string) {
    await this.getProductCard(productName)
      .locator('[data-test$="-img-link"]')
      .click();
  }

  getProductNames(): Promise<string[]> {
    return this.inventoryList
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  }

  getProductPrices(): Promise<string[]> {
    return this.inventoryList
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();
  }

  isLoaded(): Promise<boolean> {
    return this.inventoryList.isVisible();
  }
}
