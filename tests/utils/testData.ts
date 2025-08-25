/**
 * Test data utilities for managing test credentials and sample data
 */

export interface UserCredentials {
  username: string;
  password: string;
  description: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Test user credentials for different user types
 */
export const TEST_USERS: Record<string, UserCredentials> = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user with normal functionality'
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'User account that is locked out'
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'User with problematic UI behavior'
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'User with performance issues'
  },
  error: {
    username: 'error_user',
    password: 'secret_sauce',
    description: 'User that triggers errors'
  },
  visual: {
    username: 'visual_user',
    password: 'secret_sauce',
    description: 'User with visual issues'
  }
};

/**
 * Sample checkout information
 */

/**
 * Invalid credentials for negative testing
 */
export const INVALID_CREDENTIALS = {
  invalidUsername: 'invalid_user',
  invalidPassword: 'wrong_password',
  emptyUsername: '',
  emptyPassword: ''
};

/**
 * Expected error messages
 */
export const ERROR_MESSAGES = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  requiredUsername: 'Epic sadface: Username is required',
  requiredPassword: 'Epic sadface: Password is required'
};

/**
 * Get user credentials by type
 * @param userType - The type of user (standard, locked, problem, performance, error, visual)
 * @returns User credentials
 */
export function getUserCredentials(userType: keyof typeof TEST_USERS): UserCredentials {
  return TEST_USERS[userType];
}

/**
 * Get all user types
 * @returns Array of user types
 */
export function getAllUserTypes(): string[] {
  return Object.keys(TEST_USERS);
}

/**
 * Generate random checkout information
 * @returns Random checkout information
 */
export function generateRandomCheckoutInfo(): CheckoutInfo {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    postalCode: Math.floor(Math.random() * 90000 + 10000).toString()
  };
}

/**
 * Get expected product images for problem user detection
 * Note: This would need to be updated based on actual problematic images
 */
export const EXPECTED_PRODUCT_IMAGES = {
  'Sauce Labs Backpack': 'sauce-backpack-1200x1500',
  'Sauce Labs Bike Light': 'bike-light-1200x1500',
  'Sauce Labs Bolt T-Shirt': 'bolt-shirt-1200x1500',
  'Sauce Labs Fleece Jacket': 'sauce-pullover-1200x1500',
  'Sauce Labs Onesie': 'red-onesie-1200x1500',
  'Test.allTheThings() T-Shirt (Red)': 'red-tatt-1200x1500'
};

/**
 * Get product names for testing
 */
export const PRODUCT_NAMES = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)'
]; 