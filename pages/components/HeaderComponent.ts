import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HeaderComponent extends BasePage {
  readonly openMenuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly allItemsLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    super(page);
    this.openMenuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
  }

  async openMenu() {
    await this.openMenuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async closeMenu() {
    await this.closeMenuButton.click();
    await this.logoutLink.waitFor({ state: 'hidden' });
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async goToAllItems() {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetAppStateLink.click();
    await this.closeMenu();
  }
}
