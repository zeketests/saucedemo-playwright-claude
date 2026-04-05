import { type Page, type Locator } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';

export class ProductDetailPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productDescription = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.productImage = page.locator('[data-test="inventory-item"] img');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async goBackToInventory() {
    await this.backToProductsButton.click();
  }
}
