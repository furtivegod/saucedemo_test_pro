import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  // Selectors using data-test attributes
  readonly completeHeader = () => this.getByTestId('complete-header');
  readonly completeText = () => this.getByTestId('complete-text');
  readonly ponyExpressImage = () => this.getByTestId('pony-express');
  readonly backHomeButton = () => this.getByTestId('back-to-products');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to checkout complete page
   */
  async goto() {
    await super.goto('/checkout-complete.html');
    await this.waitForPageLoad();
  }

  /**
   * Click back home button
   */
  async clickBackHome() {
    await this.backHomeButton().click();
  }

  /**
   * Get complete header text
   */
  async getCompleteHeaderText(): Promise<string> {
    return await this.completeHeader().textContent() || '';
  }

  /**
   * Get complete text
   */
  async getCompleteText(): Promise<string> {
    return await this.completeText().textContent() || '';
  }

  /**
   * Assert order completion message
   */
  async assertOrderCompletionMessage() {
    await expect(this.completeHeader()).toHaveText('Thank you for your order!');
  }

  /**
   * Assert order completion details
   */
  async assertOrderCompletionDetails() {
    await expect(this.completeText()).toContainText('Your order has been dispatched');
  }

  /**
   * Assert pony express image is visible
   */
  async assertPonyExpressImageVisible() {
    await expect(this.ponyExpressImage()).toBeVisible();
  }

  /**
   * Assert back home button is visible
   */
  async assertBackHomeButtonVisible() {
    await expect(this.backHomeButton()).toBeVisible();
  }

  /**
   * Assert we're on checkout complete page
   */
  async assertOnCheckoutComplete() {
    await expect(this.page).toHaveURL(/.*\/checkout-complete\.html/);
  }

  /**
   * Complete all assertions for successful order
   */
  async assertSuccessfulOrderCompletion() {
    await this.assertOnCheckoutComplete();
    await this.assertOrderCompletionMessage();
    await this.assertOrderCompletionDetails();
    await this.assertPonyExpressImageVisible();
    await this.assertBackHomeButtonVisible();
  }

  /**
   * Wait for completion page to load
   */
  async waitForCompletionPageLoad() {
    await this.page.waitForSelector('[data-test="complete-header"]', { state: 'visible' });
  }
} 