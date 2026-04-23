import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { createJokeMockHandlers } from '../mocks/joke-handlers';

const server = setupServer(...createJokeMockHandlers());

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});
afterEach(() => {
  server.resetHandlers(...createJokeMockHandlers());
});
afterAll(() => {
  server.close();
});
