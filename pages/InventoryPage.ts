import { type Page, type Locator } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';

export class InventoryPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly logo: Locator;
  readonly inventoryList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.logo = page.locator('.app_logo');
    this.inventoryList = page.locator('.inventory_list');
  }

  isLoaded(): Promise<boolean> {
    return this.inventoryList.isVisible();
  }
}
