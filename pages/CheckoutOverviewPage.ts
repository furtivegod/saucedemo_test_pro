import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
}

export class CheckoutOverviewPage extends BasePage {
  // Selectors using data-test attributes
  readonly finishButton = () => this.getByTestId('finish');
  readonly cancelButton = () => this.getByTestId('cancel');
  readonly subtotalLabel = () => this.getByTestId('subtotal-label');
  readonly taxLabel = () => this.getByTestId('tax-label');
  readonly totalLabel = () => this.getByTestId('total-label');
  readonly orderItems = () => this.getByTestId('inventory-item');
  readonly orderItemName = () => this.getByTestId('inventory-item-name');
  readonly orderItemPrice = () => this.getByTestId('inventory-item-price');
  readonly orderItemQuantity = () => this.getByTestId('inventory-item-quantity');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to checkout overview page
   */
  async goto() {
    await super.goto('/checkout-step-two.html');
    await this.waitForPageLoad();
  }

  /**
   * Get all order items
   */
  getOrderItems(): Locator {
    return this.orderItems();
  }

  /**
   * Get order item name by index
   */
  getOrderItemName(index: number): Locator {
    return this.orderItemName().nth(index);
  }

  /**
   * Get order item price by index
   */
  getOrderItemPrice(index: number): Locator {
    return this.orderItemPrice().nth(index);
  }

  /**
   * Get order item quantity by index
   */
  getOrderItemQuantity(index: number): Locator {
    return this.orderItemQuantity().nth(index);
  }


  /**
   * Click cancel button
   */
  async clickCancel() {
    await this.cancelButton().click();
  }

  /**
   * Complete the purchase
   */
  async completePurchase() {
    await this.finishButton().click();
  }

  /**
   * Get subtotal amount
   */
  async getSubtotal(): Promise<number> {
    const subtotalText = await this.subtotalLabel().textContent();
    if (subtotalText) {
      const match = subtotalText.match(/\$(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Get tax amount
   */
  async getTax(): Promise<number> {
    const taxText = await this.taxLabel().textContent();
    if (taxText) {
      const match = taxText.match(/\$(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Get total amount
   */
  async getTotal(): Promise<number> {
    const totalText = await this.totalLabel().textContent();
    if (totalText) {
      const match = totalText.match(/\$(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Get complete order summary
   */
  async getOrderSummary(): Promise<OrderSummary> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();

    return {
      subtotal,
      tax,
      total
    };
  }

  /**
   * Calculate expected total (subtotal + tax)
   */
  async calculateExpectedTotal(): Promise<number> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    return subtotal + tax;
  }

  /**
   * Assert total matches calculated total
   */
  async assertTotalMatchesCalculated() {
    const expectedTotal = await this.calculateExpectedTotal();
    const actualTotal = await this.getTotal();
    expect(actualTotal).toBe(expectedTotal);
  }

  /**
   * Get all order items as objects
   */
  async getOrderItemsData(): Promise<Array<{ name: string; price: number; quantity: number }>> {
    const items: Array<{ name: string; price: number; quantity: number }> = [];
    const itemCount = await this.getOrderItems().count();

    for (let i = 0; i < itemCount; i++) {
      const name = await this.getOrderItemName(i).textContent() || '';
      const priceText = await this.getOrderItemPrice(i).textContent() || '';
      const price = parseFloat(priceText.replace('$', ''));
      const quantityText = await this.getOrderItemQuantity(i).textContent() || '1';
      const quantity = parseInt(quantityText, 10);

      items.push({
        name,
        price,
        quantity
      });
    }

    return items;
  }

  /**
   * Calculate subtotal from items
   */
  async calculateSubtotalFromItems(): Promise<number> {
    const items = await this.getOrderItemsData();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Assert subtotal matches calculated subtotal
   */
  async assertSubtotalMatchesCalculated() {
    const expectedSubtotal = await this.calculateSubtotalFromItems();
    const actualSubtotal = await this.getSubtotal();
    expect(actualSubtotal).toBe(expectedSubtotal);
  }

  /**
   * Assert we're on checkout overview page
   */
  async assertOnCheckoutOverview() {
    await expect(this.page).toHaveURL(/.*\/checkout-step-two\.html/);
  }

  /**
   * Assert finish button is visible
   */
  async assertFinishButtonVisible() {
    await expect(this.finishButton()).toBeVisible();
  }

  /**
   * Assert cancel button is visible
   */
  async assertCancelButtonVisible() {
    await expect(this.cancelButton()).toBeVisible();
  }

  /**
   * Wait for order summary to load
   */
  async waitForOrderSummaryLoad() {
    await this.page.waitForSelector('.summary_subtotal_label', { state: 'visible' });
  }
} 