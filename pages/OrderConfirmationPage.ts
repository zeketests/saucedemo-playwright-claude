import { type Page, type Locator } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';

export class OrderConfirmationPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }
}
