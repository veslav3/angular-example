import { expect, test, type Page } from '@playwright/test';

const jokeA = {
  icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
  id: 'e2e-joke-a',
  url: '',
  value: 'E2E mocked joke A — roundhouse for testing.',
} as const;

const jokeB = {
  icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
  id: 'e2e-joke-b',
  url: '',
  value: 'E2E mocked joke B — the sequel.',
} as const;

async function mockJokesApi(page: Page) {
  await page.route('**/jokes/random**', (route) => {
    return route.fulfill({
      body: JSON.stringify(jokeA),
      contentType: 'application/json',
      status: 200,
    });
  });
}

test('first fetch appends one joke to the list', async ({ page }) => {
  await mockJokesApi(page);
  await page.goto('/');

  await page.getByTestId('fetch-joke-button').click();
  const items = page.getByTestId('joke-item');
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText(jokeA.value);
});

test('second fetch appends another joke in order', async ({ page }) => {
  let call = 0;
  await page.route('**/jokes/random**', (route) => {
    call += 1;
    const body = call === 1 ? jokeA : jokeB;
    return route.fulfill({
      body: JSON.stringify(body),
      contentType: 'application/json',
      status: 200,
    });
  });

  await page.goto('/');
  await page.getByTestId('fetch-joke-button').click();
  await expect(page.getByTestId('joke-item')).toHaveCount(1);
  await page.getByTestId('fetch-joke-button').click();

  const items = page.getByTestId('joke-item');
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText(jokeA.value);
  await expect(items.nth(1)).toContainText(jokeB.value);
});

test('button shows loading and avoids double submit', async ({ page }) => {
  let resolveRequest!: (value: void) => void;
  const firstResponse = new Promise<void>((r) => {
    resolveRequest = r;
  });

  await page.route('**/jokes/random**', async (route) => {
    await firstResponse;
    await route.fulfill({
      body: JSON.stringify(jokeA),
      contentType: 'application/json',
      status: 200,
    });
  });

  await page.goto('/');
  const button = page.getByTestId('fetch-joke-button');
  await expect(button).toBeEnabled();

  await button.click();
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByTestId('joke-list')).toContainText('No jokes yet', {
    timeout: 2_000,
  });

  resolveRequest();
  await expect(button).toBeEnabled();
  await expect(page.getByTestId('joke-item')).toHaveCount(1);
});
