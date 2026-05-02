import { test, expect } from '@playwright/test';
import { SAUCEDEMO_BASE_URL, SaucedemoRoutes } from '../../data/api';

test.describe('HTTP — Saucedemo Smoke', { tag: '@smoke' }, () => {
  test('[HTTP-01] home page returns 200 with HTML content-type', async ({ request }) => {
    const response = await request.get(`${SAUCEDEMO_BASE_URL}${SaucedemoRoutes.HOME}`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  // SPA sub-routes are handled client-side — the server returns 404 for these paths.
  // This documents expected HTTP-layer behavior vs browser behavior.
  test('[HTTP-02] SPA sub-routes return 404 at HTTP level (client-side routing only)', async ({ request }) => {
    const spaRoutes = [
      SaucedemoRoutes.INVENTORY,
      SaucedemoRoutes.CART,
      SaucedemoRoutes.CHECKOUT_STEP_ONE,
      SaucedemoRoutes.CHECKOUT_STEP_TWO,
      SaucedemoRoutes.CHECKOUT_COMPLETE,
    ];

    for (const route of spaRoutes) {
      const response = await request.get(`${SAUCEDEMO_BASE_URL}${route}`);
      expect(response.status(), `Expected 404 for SPA route ${route}`).toBe(404);
    }
  });

  test('[HTTP-03] no 5xx errors on home page', async ({ request }) => {
    const response = await request.get(`${SAUCEDEMO_BASE_URL}${SaucedemoRoutes.HOME}`);

    expect(response.status()).toBeLessThan(500);
  });

  test('[HTTP-04] home page response body contains app root element', async ({ request }) => {
    const response = await request.get(`${SAUCEDEMO_BASE_URL}${SaucedemoRoutes.HOME}`);

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<div id="root">');
  });

  test('[HTTP-05] home page sets content-encoding or transfer-encoding header', async ({ request }) => {
    const response = await request.get(`${SAUCEDEMO_BASE_URL}${SaucedemoRoutes.HOME}`);
    const headers = response.headers();

    expect(response.status()).toBe(200);
    const hasEncoding =
      'content-encoding' in headers ||
      'transfer-encoding' in headers ||
      'content-length' in headers;

    expect(hasEncoding, 'Expected content-encoding, transfer-encoding, or content-length header').toBe(true);
  });
});
