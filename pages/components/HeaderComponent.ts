import { type Page, type Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly openMenuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly allItemsLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openMenuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
  }

  async openMenu() {
    await this.openMenuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async closeMenu() {
    await this.closeMenuButton.click();
    await this.logoutLink.waitFor({ state: 'hidden' });
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
