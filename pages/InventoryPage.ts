import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface Product {
  name: string;
  price: number;
  description: string;
}

export class InventoryPage extends BasePage {
  // Consistent data-test based selectors via BasePage
  readonly productSortContainer = () => this.getByTestId('product-sort-container');
  readonly inventoryContainer = () => this.getByTestId('inventory-container');
  readonly shoppingCartBadge = () => this.getByTestId('shopping-cart-badge');
  readonly shoppingCartLink = () => this.getByTestId('shopping-cart-link');

  // Item-level lists (no parent chaining required)
  readonly inventoryItem = () => this.getByTestId('inventory-item');
  readonly inventoryItemName = () => this.page.locator('[data-test="inventory-item-name"], .inventory_item_name');
  readonly inventoryItemPrice = () => this.getByTestId('inventory-item-price');
  readonly inventoryItemDescription = () => this.getByTestId('inventory-item-desc');

  // Dynamic buttons within list, targeted by index (prefix match)
  readonly addToCartButtons = () => this.page.locator('[data-test^="add-to-cart"]');
  readonly removeFromCartButtons = () => this.page.locator('[data-test^="remove"]');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/inventory.html');
    await this.waitForPageLoad();
  }

  // Accessors by index using direct lists
  getProductItems(): Locator {
    return this.inventoryItem();
  }

  getProductName(index: number): Locator {
    return this.inventoryItemName().nth(index);
  }

  getProductPrice(index: number): Locator {
    return this.inventoryItemPrice().nth(index);
  }

  getAddToCartButton(index: number): Locator {
    return this.addToCartButtons().nth(index);
  }

  getRemoveFromCartButton(index: number): Locator {
    return this.removeFromCartButtons().nth(index);
  }

  async selectSortOption(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.productSortContainer().selectOption(option);
  }

  async addProductToCartDirect(index: number) {
    await this.getAddToCartButton(index).click();
    // State-based wait: ensure the button toggled to Remove
    await expect(this.getRemoveFromCartButton(index)).toBeVisible();
  }

  async addProductToCartViaDetailPage(index: number) {
    await this.getProductName(index).click();
    await this.page.waitForSelector('[data-test="inventory-item-name"]', { state: 'visible' });
    await this.page.locator('[data-test^="add-to-cart"]').click();
    await this.page.locator('[data-test="back-to-products"]').click();
    // State-based wait: ensure the button toggled to Remove after returning
    await expect(this.getRemoveFromCartButton(index)).toBeVisible();
  }

  async addProductToCart(index: number) {
    await this.addProductToCartDirect(index);
  }

  async removeProductFromCart(index: number) {
    await this.getRemoveFromCartButton(index).click();
    await this.waitForCartUpdate();
  }

  async waitForCartUpdate() {
    // Prefer a state-based signal over fixed timeout.
    await expect(this.shoppingCartBadge()).toBeVisible();
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.shoppingCartBadge();
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      return parseInt(text || '0', 10);
    }
    return 0;
  }

  async clickShoppingCart() {
    await this.shoppingCartLink().click();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.inventoryItemPrice().allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.inventoryItemName().allTextContents();
    return names;
  }

  async assertProductsSortedByPriceLowToHigh() {
    const prices = await this.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  }

  async assertProductsSortedByPriceHighToLow() {
    const prices = await this.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  }

  async assertProductsSortedAlphabetically() {
    const names = await this.getProductNames();
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  }

  async assertProductsSortedAlphabeticallyReverse() {
    const names = await this.getProductNames();
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);
  }

  async assertCartBadgeCount(expectedCount: number) {
    if (expectedCount === 0) {
      await expect(this.shoppingCartBadge()).not.toBeVisible();
    } else {
      await expect(this.shoppingCartBadge()).toBeVisible();
      await expect(this.shoppingCartBadge()).toHaveText(expectedCount.toString());
    }
  }
} 