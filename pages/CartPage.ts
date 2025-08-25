import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export class CartPage extends BasePage {
  // Selectors using data-test attributes
  readonly cartList = () => this.getByTestId('cart-list');
  readonly checkoutButton = () => this.getByTestId('checkout');
  readonly continueShoppingButton = () => this.getByTestId('continue-shopping');
  readonly cartItem = () => this.getByTestId('inventory-item');
  readonly cartItemName = () => this.getByTestId('inventory-item-name');
  readonly cartItemPrice = () => this.getByTestId('inventory-item-price');
  readonly cartItemQuantity = () => this.getByTestId('inventory-item-quantity');


  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to cart page
   */
  async goto() {
    await super.goto('/cart.html');
    await this.waitForPageLoad();
  }

  /**
   * Get all cart items
   */
  getCartItems(): Locator {
    return this.cartItem();
  }

  /**
   * Get cart item name by index
   */
  getCartItemName(index: number): Locator {
    return this.cartItemName().nth(index);
  }

  /**
   * Get cart item price by index
   */
  getCartItemPrice(index: number): Locator {
    return this.cartItemPrice().nth(index);
  }

  /**
   * Get cart item quantity by index
   */
  getCartItemQuantity(index: number): Locator {
    return this.cartItemQuantity().nth(index);
  }

  /**
   * Get remove button by index
   */
  getRemoveButton(index: number): Locator {
    return this.cartItem().nth(index).locator('[data-test^="remove"]');
  }

  /**
   * Remove item from cart by index
   */
  async removeItem(index: number) {
    await this.getRemoveButton(index).click();
  }

  /**
   * Click checkout button
   */
  async clickCheckout() {
    await this.checkoutButton().click();
  }

  /**
   * Click continue shopping button
   */
  async clickContinueShopping() {
    await this.continueShoppingButton().click();
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    return await this.getCartItems().count();
  }

  /**
   * Get all cart items as objects
   */
  async getCartItemsData(): Promise<CartItem[]> {
    const items: CartItem[] = [];
    const itemCount = await this.getCartItems().count();

    for (let i = 0; i < itemCount; i++) {
      const name = await this.getCartItemName(i).textContent() || '';
      const priceText = await this.getCartItemPrice(i).textContent() || '';
      const price = parseFloat(priceText.replace('$', ''));
      const quantityText = await this.getCartItemQuantity(i).textContent() || '1';
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
   * Calculate total price of all items in cart
   */
  async calculateTotalPrice(): Promise<number> {
    const items = await this.getCartItemsData();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Assert cart is empty
   */
  async assertCartIsEmpty() {
    await expect(this.getCartItems()).toHaveCount(0);
  }

  /**
   * Assert cart has specific number of items
   */
  async assertCartItemCount(expectedCount: number) {
    await expect(this.getCartItems()).toHaveCount(expectedCount);
  }

  /**
   * Assert specific item is in cart
   */
  async assertItemInCart(itemName: string) {
    const items = await this.getCartItemsData();
    const itemNames = items.map(item => item.name);
    expect(itemNames).toContain(itemName);
  }

  /**
   * Assert checkout button is visible
   */
  async assertCheckoutButtonVisible() {
    await expect(this.checkoutButton()).toBeVisible();
  }

  /**
   * Assert continue shopping button is visible
   */
  async assertContinueShoppingButtonVisible() {
    await expect(this.continueShoppingButton()).toBeVisible();
  }

  /**
   * Wait for cart to load
   */
  async waitForCartLoad() {
    await this.page.waitForSelector('.cart_item, .cart_list', { state: 'visible' });
  }
} 