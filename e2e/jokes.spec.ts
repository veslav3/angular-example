import { expect, test, type Page } from '@playwright/test';

import { MOCK_JOKES } from '../src/mocks/jokes-data';

function waitForMswResetRef(page: Page) {
  return page.waitForFunction(
    () => typeof (window as { __E2E_RESET_MSW?: () => void }).__E2E_RESET_MSW === 'function',
    { timeout: 15_000 }
  );
}

test.describe('Chuck jokes (MSW pool of 10 jokes)', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    // Must be a self-contained string so the flag exists before the app bundle runs and starts MSW.
    await page.addInitScript("window['__NG_MSW__'] = '1'");
    await page.context().setExtraHTTPHeaders({}); // start clean (loading test can override)
  });

  test.afterEach(async ({ page }) => {
    await page.context().setExtraHTTPHeaders({});
  });

  test('initial load shows ten jokes from the mock pool', async ({ page }) => {
    await page.goto('/');
    await waitForMswResetRef(page);
    await page.evaluate(() => window.__E2E_RESET_MSW?.());
    const items = page.getByTestId('joke-item');
    await expect(items).toHaveCount(10);
    await expect(items.first()).toContainText(MOCK_JOKES[0].value);
    await expect(items.nth(9)).toContainText(MOCK_JOKES[9].value);
  });

  test('initial load shows an error when one jokes request fails', async ({ page }) => {
    await page.context().setExtraHTTPHeaders({ 'x-e2e-fail-at-index': '3' });
    await page.goto('/');
    const items = page.getByTestId('joke-item');
    await expect(items).toHaveCount(0);
    await expect(page.getByTestId('joke-error')).toContainText(
      'Could not load jokes. Try reloading the page.'
    );
  });

  test('each click replaces oldest joke when list is full (FIFO, max 10)', async ({ page }) => {
    await page.goto('/');
    await waitForMswResetRef(page);
    await page.evaluate(() => window.__E2E_RESET_MSW?.());
    const items = page.getByTestId('joke-item');
    await expect(items).toHaveCount(10);
    await page.getByTestId('fetch-joke-button').click();
    await expect(items).toHaveCount(10);
    await expect(items.first()).toContainText(MOCK_JOKES[1].value);
    await expect(items.nth(9)).toContainText(MOCK_JOKES[0].value);
    await page.getByTestId('fetch-joke-button').click();
    await expect(items).toHaveCount(10);
    await expect(items.first()).toContainText(MOCK_JOKES[2].value);
    await expect(items.nth(9)).toContainText(MOCK_JOKES[1].value);
  });

  test('button is disabled and busy while a slow mocked response is in flight', async ({ page }) => {
    await page.goto('/');
    await waitForMswResetRef(page);
    await page.evaluate(() => window.__E2E_RESET_MSW?.());
    await expect(page.getByTestId('joke-item')).toHaveCount(10);
    await page.context().setExtraHTTPHeaders({ 'x-e2e-slow-ms': '1200' });
    const button = page.getByTestId('fetch-joke-button');
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(page.getByTestId('joke-list')).not.toContainText('No jokes yet', { timeout: 1_000 });
    await expect(button).toBeEnabled({ timeout: 15_000 });
    await expect(page.getByTestId('joke-item')).toHaveCount(10);
  });
});
