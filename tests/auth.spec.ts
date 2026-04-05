import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { Users, VALID_PASSWORD, ErrorMessages, ProtectedRoutes, protectedRouteError } from '../data/credentials';

// ─── Positive Login Scenarios (AUTH-01 to AUTH-05) ───────────────────────────

test.describe('AUTH — Positive Login', () => {
  const validUsers = [
    { id: 'AUTH-01', user: Users.STANDARD },
    { id: 'AUTH-02', user: Users.PROBLEM },
    { id: 'AUTH-04', user: Users.ERROR },
    { id: 'AUTH-05', user: Users.VISUAL },
  ];

  for (const { id, user } of validUsers) {
    test(`[${id}] should login successfully with ${user}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login(user, VALID_PASSWORD);

      await expect(page).toHaveURL('/inventory.html');
    });
  }

  test('[AUTH-01] should display inventory page after login with standard_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(Users.STANDARD, VALID_PASSWORD);

    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryList).toBeVisible();
    await expect(inventoryPage.logo).toHaveText('Swag Labs');
  });

  test('[AUTH-03] should login successfully with performance_glitch_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(Users.PERFORMANCE_GLITCH, VALID_PASSWORD);

    await expect(page).toHaveURL('/inventory.html', { timeout: 15_000 });
  });
});

// ─── Negative Login Scenarios (AUTH-06 to AUTH-13) ───────────────────────────

test.describe('AUTH — Negative Login', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).goto();
  });

  test('[AUTH-06] should show error when username and password are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.USERNAME_REQUIRED);
    await expect(page).toHaveURL('/');
  });

  test('[AUTH-07] should show error when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.usernameInput.fill(Users.STANDARD);
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.PASSWORD_REQUIRED);
    await expect(page).toHaveURL('/');
  });

  test('[AUTH-08] should show error when username is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.USERNAME_REQUIRED);
    await expect(page).toHaveURL('/');
  });

  test('[AUTH-09] should show error for invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(Users.STANDARD, 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.INVALID_CREDENTIALS);
    await expect(page).toHaveURL('/');
  });

  test('[AUTH-10] should show error for non-existent username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('unknown_user', VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.INVALID_CREDENTIALS);
    await expect(page).toHaveURL('/');
  });

  test('[AUTH-11] should show error for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(Users.LOCKED_OUT, VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.LOCKED_OUT);
    await expect(page).toHaveURL('/');
  });

  test('[AUTH-12] username should be case-sensitive', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('Standard_User', VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.INVALID_CREDENTIALS);
    await expect(page).toHaveURL('/');
  });

  test('[AUTH-13] password should be case-sensitive', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(Users.STANDARD, 'Secret_Sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.INVALID_CREDENTIALS);
    await expect(page).toHaveURL('/');
  });
});

// ─── Logout (AUTH-14) ────────────────────────────────────────────────────────

test.describe('AUTH — Logout', () => {
  test('[AUTH-14] should logout via hamburger menu and clear session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(Users.STANDARD, VALID_PASSWORD);
    await expect(page).toHaveURL('/inventory.html');

    await inventoryPage.header.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('[AUTH-14] should not access protected pages after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(Users.STANDARD, VALID_PASSWORD);
    await inventoryPage.header.logout();

    await page.goto('/inventory.html');

    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});

// ─── Protected Route Access (AUTH-15 to AUTH-17) ─────────────────────────────

test.describe('AUTH — Protected Routes', () => {
  for (const { path, label } of ProtectedRoutes) {
    test(`[AUTH-15/16/17] should redirect unauthenticated access to ${label} page`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await page.goto(path);

      await expect(page).toHaveURL('/');
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(protectedRouteError(path));
    });
  }
});
