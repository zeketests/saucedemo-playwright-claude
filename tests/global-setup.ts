import { chromium } from '@playwright/test';
import * as fs from 'fs';
import { Users, VALID_PASSWORD } from '../data/credentials';

async function globalSetup() {
  fs.mkdirSync('.auth', { recursive: true });

  const browser = await chromium.launch();

  // ── standard_user ────────────────────────────────────────────────────────
  const standardCtx = await browser.newContext();
  const standardPage = await standardCtx.newPage();
  await standardPage.goto('https://www.saucedemo.com/');
  await standardPage.locator('[data-test="username"]').fill(Users.STANDARD);
  await standardPage.locator('[data-test="password"]').fill(VALID_PASSWORD);
  await standardPage.locator('[data-test="login-button"]').click();
  await standardPage.waitForURL('**/inventory.html');
  await standardCtx.storageState({ path: '.auth/user.json' });
  await standardCtx.close();

  // ── problem_user ──────────────────────────────────────────────────────────
  const problemCtx = await browser.newContext();
  const problemPage = await problemCtx.newPage();
  await problemPage.goto('https://www.saucedemo.com/');
  await problemPage.locator('[data-test="username"]').fill(Users.PROBLEM);
  await problemPage.locator('[data-test="password"]').fill(VALID_PASSWORD);
  await problemPage.locator('[data-test="login-button"]').click();
  await problemPage.waitForURL('**/inventory.html');
  await problemCtx.storageState({ path: '.auth/problem-user.json' });
  await problemCtx.close();

  await browser.close();
}

export default globalSetup;
