import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(path: string = '') {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get element by data-test attribute
   */
  getByTestId(testId: string): Locator {
    return this.page.locator(`[data-test="${testId}"]`);
  }
} 