import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { Users, VALID_PASSWORD, ErrorMessages } from '../data/credentials';

test.describe('Login - Positive Scenarios', () => {
  test('should login successfully with standard_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(Users.STANDARD, VALID_PASSWORD);

    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryList).toBeVisible();
    await expect(inventoryPage.logo).toHaveText('Swag Labs');
  });

  test('should login successfully with problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(Users.PROBLEM, VALID_PASSWORD);

    await expect(page).toHaveURL('/inventory.html');
  });

  test('should login successfully with performance_glitch_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(Users.PERFORMANCE_GLITCH, VALID_PASSWORD);

    await expect(page).toHaveURL('/inventory.html');
  });

  test('should login successfully with error_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(Users.ERROR, VALID_PASSWORD);

    await expect(page).toHaveURL('/inventory.html');
  });

  test('should login successfully with visual_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(Users.VISUAL, VALID_PASSWORD);

    await expect(page).toHaveURL('/inventory.html');
  });
});

test.describe('Login - Negative Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should show error when username and password are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.USERNAME_REQUIRED);
    await expect(page).toHaveURL('/');
  });

  test('should show error when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.usernameInput.fill(Users.STANDARD);
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.PASSWORD_REQUIRED);
    await expect(page).toHaveURL('/');
  });

  test('should show error when username is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.USERNAME_REQUIRED);
    await expect(page).toHaveURL('/');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(Users.STANDARD, 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.INVALID_CREDENTIALS);
    await expect(page).toHaveURL('/');
  });

  test('should show error for non-existent user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('unknown_user', VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.INVALID_CREDENTIALS);
    await expect(page).toHaveURL('/');
  });

  test('should show error for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(Users.LOCKED_OUT, VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.LOCKED_OUT);
    await expect(page).toHaveURL('/');
  });

  test('should be case-sensitive for username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('Standard_User', VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.INVALID_CREDENTIALS);
  });

  test('should be case-sensitive for password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(Users.STANDARD, 'Secret_Sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.INVALID_CREDENTIALS);
  });
});
