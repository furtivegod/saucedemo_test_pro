import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  // Selectors using data-test attributes
  readonly firstNameInput = () => this.getByTestId('firstName');
  readonly lastNameInput = () => this.getByTestId('lastName');
  readonly postalCodeInput = () => this.getByTestId('postalCode');
  readonly continueButton = () => this.getByTestId('continue');
  readonly cancelButton = () => this.getByTestId('cancel');
  readonly errorMessage = () => this.getByTestId('error');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to checkout page
   */
  async goto() {
    await super.goto('/checkout-step-one.html');
    await this.waitForPageLoad();
  }

  /**
   * Fill first name
   */
  async fillFirstName(firstName: string) {
    await this.firstNameInput().fill(firstName);
  }

  /**
   * Fill last name
   */
  async fillLastName(lastName: string) {
    await this.lastNameInput().fill(lastName);
  }

  /**
   * Fill postal code
   */
  async fillPostalCode(postalCode: string) {
    await this.postalCodeInput().fill(postalCode);
  }

  /**
   * Fill all checkout information
   */
  async fillCheckoutInfo(info: CheckoutInfo) {
    await this.fillFirstName(info.firstName);
    await this.fillLastName(info.lastName);
    await this.fillPostalCode(info.postalCode);
  }

  /**
   * Click continue button
   */
  async clickContinue() {
    await this.continueButton().click();
  }

  /**
   * Click cancel button
   */
  async clickCancel() {
    await this.cancelButton().click();
  }

  /**
   * Complete checkout step one
   */
  async completeCheckoutStepOne(info: CheckoutInfo) {
    await this.fillCheckoutInfo(info);
    await this.clickContinue();
  }

  /**
   * Assert error message is displayed
   */
  async assertErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage()).toBeVisible();
    await expect(this.errorMessage()).toHaveText(expectedMessage);
  }

  /**
   * Assert error message contains specific text
   */
  async assertErrorMessageContains(expectedText: string) {
    await expect(this.errorMessage()).toBeVisible();
    await expect(this.errorMessage()).toContainText(expectedText);
  }

  /**
   * Get error message text
   */
  async getErrorMessageText(): Promise<string> {
    return await this.errorMessage().textContent() || '';
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage().isVisible();
  }

  /**
   * Assert we're on checkout step one page
   */
  async assertOnCheckoutStepOne() {
    await expect(this.page).toHaveURL(/.*\/checkout-step-one\.html/);
  }

  /**
   * Assert we're on checkout step two page
   */
  async assertOnCheckoutStepTwo() {
    await expect(this.page).toHaveURL(/.*\/checkout-step-two\.html/);
  }
} 