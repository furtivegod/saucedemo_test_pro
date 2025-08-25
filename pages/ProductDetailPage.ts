import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productName = () => this.getByTestId('inventory-item-name');
  readonly productPrice = () => this.getByTestId('inventory-item-price');
  readonly productDescription = () => this.getByTestId('inventory-item-desc');
  readonly addToCartButton = () => this.getByTestId('add-to-cart');
  readonly removeFromCartButton = () => this.getByTestId('remove');
  readonly backToProductsButton = () => this.getByTestId('back-to-products');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to product detail page from inventory
   */
  async gotoFromInventory(productIndex: number) {
    await this.page.locator('data-test="inventory-item"').nth(productIndex).locator('[data-test="inventory-item-name"]').click();
    await this.waitForPageLoad();
  }

  async addToCart() {
    await this.addToCartButton().click();
  }

  async removeFromCart() {
    await this.removeFromCartButton().click();
  }

  async backToProducts() {
    await this.backToProductsButton().click();
  }

  async getProductName(): Promise<string> {
    return await this.productName().textContent() || '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice().textContent() || '';
  }

  async getProductDescription(): Promise<string> {
    return await this.productDescription().textContent() || '';
  }

  async assertProductDetailsDisplayed() {
    await expect(this.productName()).toBeVisible();
    await expect(this.productPrice()).toBeVisible();
    await expect(this.productDescription()).toBeVisible();
  }

  async assertAddToCartButtonVisible() {
    await expect(this.addToCartButton()).toBeVisible();
  }

  async assertRemoveFromCartButtonVisible() {
    await expect(this.removeFromCartButton()).toBeVisible();
  }

  async assertBackToProductsButtonVisible() {
    await expect(this.backToProductsButton()).toBeVisible();
  }
} 