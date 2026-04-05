import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly logo: Locator;
  readonly inventoryList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('.app_logo');
    this.inventoryList = page.locator('.inventory_list');
  }

  isLoaded(): Promise<boolean> {
    return this.inventoryList.isVisible();
  }
}
