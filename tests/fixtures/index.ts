import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

// Define the fixture types
type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  standardUserPage: InventoryPage;
  problemUserPage: InventoryPage;
  performanceUserPage: InventoryPage;
};

// Extend the base test with our fixtures
export const test = base.extend<Fixtures>({
  // Basic page fixtures
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  // Pre-authenticated fixtures
  standardUserPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.waitForPageLoad();
    
    await use(inventoryPage);
  },

  problemUserPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.waitForPageLoad();
    
    await use(inventoryPage);
  },

  performanceUserPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await inventoryPage.waitForPageLoad();
    
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test'; 