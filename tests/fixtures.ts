import { test as base } from '@playwright/test';

export const test = base.extend({
  storageState: '.auth/user.json',
});

export const problemTest = base.extend({
  storageState: '.auth/problem-user.json',
});

export const errorTest = base.extend({
  storageState: '.auth/error-user.json',
});

export { expect } from '@playwright/test';
