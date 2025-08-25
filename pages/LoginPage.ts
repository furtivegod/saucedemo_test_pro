import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Selectors using data-test attributes
  readonly usernameInput = () => this.getByTestId('username');
  readonly passwordInput = () => this.getByTestId('password');
  readonly loginButton = () => this.getByTestId('login-button');
  readonly errorMessage = () => this.getByTestId('error');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Fill username field
   */
  async fillUsername(username: string) {
    await this.usernameInput().fill(username);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string) {
    await this.passwordInput().fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.loginButton().click();
  }

  /**
   * Perform login with given credentials
   */
  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Assert successful login by checking if we're redirected to inventory page
   */
  async assertSuccessfulLogin() {
    await expect(this.page).toHaveURL(/.*\/inventory\.html/);
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
   * Assert we're still on login page (failed login)
   */
  async assertStillOnLoginPage() {
    await expect(this.page).toHaveURL(/.*\/$/);
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
} 