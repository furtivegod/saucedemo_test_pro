import { test, expect } from './fixtures';

test.describe('Inventory & Sorting Tests', () => {
  test.describe('Product Sorting', () => {
    test('should sort products by price low to high', async ({ standardUserPage }) => {
      await standardUserPage.goto();
      
      await standardUserPage.selectSortOption('lohi');
      
      await standardUserPage.assertProductsSortedByPriceLowToHigh();
    });

    test('should sort products by price high to low', async ({ standardUserPage }) => {
      await standardUserPage.goto();
      
      await standardUserPage.selectSortOption('hilo');
      
      await standardUserPage.assertProductsSortedByPriceHighToLow();
    });
  });
}); 