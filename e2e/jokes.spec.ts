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

  test('first fetch appends one joke from the mock pool', async ({ page }) => {
    await page.goto('/');
    await waitForMswResetRef(page);
    await page.evaluate(() => window.__E2E_RESET_MSW?.());
    await page.getByTestId('fetch-joke-button').click();
    const items = page.getByTestId('joke-item');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText(MOCK_JOKES[0].value);
  });

  test('second fetch appends the next joke in sequence', async ({ page }) => {
    await page.goto('/');
    await waitForMswResetRef(page);
    await page.evaluate(() => window.__E2E_RESET_MSW?.());
    await page.getByTestId('fetch-joke-button').click();
    await expect(page.getByTestId('joke-item')).toHaveCount(1);
    await page.getByTestId('fetch-joke-button').click();
    const items = page.getByTestId('joke-item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText(MOCK_JOKES[0].value);
    await expect(items.nth(1)).toContainText(MOCK_JOKES[1].value);
  });

  test('button is disabled and busy while a slow mocked response is in flight', async ({ page }) => {
    await page.context().setExtraHTTPHeaders({ 'x-e2e-slow-ms': '1200' });
    await page.goto('/');
    await waitForMswResetRef(page);
    await page.evaluate(() => window.__E2E_RESET_MSW?.());
    const button = page.getByTestId('fetch-joke-button');
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(page.getByTestId('joke-list')).toContainText('No jokes yet', { timeout: 1_000 });
    await expect(button).toBeEnabled();
    await expect(page.getByTestId('joke-item')).toHaveCount(1);
  });
});
