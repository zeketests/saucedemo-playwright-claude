import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.cartItems = page.getByTestId('inventory-item');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async removeItem(slug: string) {
    await this.page.getByTestId(`remove-${slug}`).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  getItemNames(): Promise<string[]> {
    return this.cartItems
      .getByTestId('inventory-item-name')
      .allTextContents();
  }

  getItemQuantities(): Promise<string[]> {
    return this.cartItems
      .getByTestId('item-quantity')
      .allTextContents();
  }

  getItemPrices(): Promise<string[]> {
    return this.cartItems
      .getByTestId('inventory-item-price')
      .allTextContents();
  }
}
