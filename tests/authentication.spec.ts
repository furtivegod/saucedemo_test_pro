import { test, expect } from './fixtures';
import { ERROR_MESSAGES, INVALID_CREDENTIALS } from './utils/testData';

test.describe('Authentication Tests', () => {
  test.describe('Successful Login', () => {
    test('should successfully login as standard_user and redirect to inventory page', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await loginPage.assertSuccessfulLogin();
    });

    test('should successfully login as problem_user', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login('problem_user', 'secret_sauce');
      await loginPage.assertSuccessfulLogin();
    });

    test('should successfully login as performance_glitch_user', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login('performance_glitch_user', 'secret_sauce');
      await loginPage.assertSuccessfulLogin();
    });
  });

  test.describe('Locked Out User', () => {
    test('should show locked out error message for locked_out_user', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login('locked_out_user', 'secret_sauce');
      await loginPage.assertErrorMessage(ERROR_MESSAGES.lockedOut);
    });
  });

  test.describe('Invalid Credentials', () => {
    test('should show error message for invalid password', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login('standard_user', INVALID_CREDENTIALS.invalidPassword);
      await loginPage.assertErrorMessage(ERROR_MESSAGES.invalidCredentials);
    });
  });
}); 