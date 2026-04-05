import { test as base } from '@playwright/test';

/**
 * Pre-authenticated test fixture for standard_user.
 * Loads `.auth/user.json` as the browser context storage state so tests
 * start already logged in — no UI login step required.
 *
 * Import `test` and `expect` from this file in all non-auth spec files.
 */
export const test = base.extend({
  storageState: '.auth/user.json',
});

export { expect } from '@playwright/test';
