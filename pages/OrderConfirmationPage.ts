import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

export class OrderConfirmationPage extends BasePage {
  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.ponyExpressImage = page.getByTestId('pony-express');
    this.backToProductsButton = page.getByTestId('back-to-products');
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }
}
