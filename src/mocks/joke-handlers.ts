import { http, HttpResponse } from 'msw';

import { CHUCK_NORRIS_JOKES_RANDOM } from '../app/jokes/jokes.model';

import { MOCK_JOKES } from './jokes-data';

const SLOW_HEADER = 'x-e2e-slow-ms';

function parseSlowMs(request: Request): number {
  const raw = request.headers.get(SLOW_HEADER);
  if (!raw) {
    return 0;
  }
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * New handlers each time so sequential `callIndex` resets. Use for `resetHandlers` in Node
 * and in the browser when tests need a clean sequence.
 */
export function createJokeMockHandlers() {
  let callIndex = 0;

  return [
    http.get(CHUCK_NORRIS_JOKES_RANDOM, async ({ request }) => {
      const slowMs = parseSlowMs(request);
      if (slowMs > 0) {
        await new Promise((r) => setTimeout(r, slowMs));
      }
      const joke = MOCK_JOKES[callIndex % MOCK_JOKES.length];
      callIndex += 1;
      return HttpResponse.json({ ...joke });
    }),
  ];
}
