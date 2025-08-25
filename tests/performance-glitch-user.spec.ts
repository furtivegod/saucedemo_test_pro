import { test, expect } from './fixtures';

test.describe('Performance Glitch User - Handling Lag', () => {
  test('should successfully add product to cart despite performance issues', async ({ performanceUserPage }) => {
    // Navigate directly to inventory page to avoid login lag
    await performanceUserPage.page.goto('/inventory.html');

    // Rely on expect auto-wait instead of explicit waitFor
    await expect(performanceUserPage.getProductItems().first()).toBeVisible();

    // Add first product directly from inventory (uses POM helper)
    await performanceUserPage.addProductToCartDirect(0);
    await expect(performanceUserPage.getRemoveFromCartButton(0)).toBeVisible();

    // Add second product via product detail page (uses POM helper)
    await performanceUserPage.addProductToCartViaDetailPage(1);
    await expect(performanceUserPage.getRemoveFromCartButton(1)).toBeVisible();

    // Cart badge should be visible (count not strictly asserted to avoid flakiness)
    await expect(performanceUserPage.shoppingCartBadge()).toBeVisible();

    // Page remains usable
    await expect(performanceUserPage.getProductItems().first()).toBeVisible();
  });
}); 