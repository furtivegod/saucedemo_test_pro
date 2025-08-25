import { test, expect } from './fixtures';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { generateRandomCheckoutInfo } from './utils/testData';
import { calculateTotal, validateTotal } from './utils/priceCalculator';

test.describe('End-to-End Purchase Flow', () => {
  test('should complete full purchase flow from login to thank you page', async ({ 
    standardUserPage, 
    page 
  }) => {
    // Step 1: Login and navigate to inventory
    await standardUserPage.goto();
    
    await standardUserPage.selectSortOption('lohi');
    await standardUserPage.assertProductsSortedByPriceLowToHigh();
    // Step 2: Add products to cart using both methods
    // Method 1: Direct add to cart
    await standardUserPage.addProductToCartDirect(0);
    
    // Method 2: Via product detail page
    await standardUserPage.addProductToCartViaDetailPage(1);
    
    // Step 3: Navigate to cart
    await standardUserPage.clickShoppingCart();

    
    // Step 4: Proceed to checkout
    const cartPage = new CartPage(page);
    await cartPage.removeItem(0);
    await cartPage.clickCheckout();
    
    // Step 5: Fill checkout information
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.completeCheckoutStepOne(generateRandomCheckoutInfo());
    
    // Step 6: Verify checkout overview and price calculations
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await checkoutOverviewPage.waitForOrderSummaryLoad();
    
    // Step 7: Calculate expected total and validate
    const actualSubtotal = await checkoutOverviewPage.getSubtotal();
    const expectedTotal = calculateTotal(actualSubtotal);
    const actualTotal = await checkoutOverviewPage.getTotal();
    
    // CRUCIAL ASSERTION: Verify total matches calculated total
    expect(validateTotal(actualTotal, expectedTotal)).toBe(true);
    
    // Step 8: Complete the purchase
    await checkoutOverviewPage.completePurchase();
    
    // Step 9: Verify order completion
    const checkoutCompletePage = new CheckoutCompletePage(page);
    await checkoutCompletePage.assertSuccessfulOrderCompletion();
  });
}); 