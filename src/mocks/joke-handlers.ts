import { http, HttpResponse } from 'msw';

import { MOCK_JOKES } from './jokes-data';

function isChuckRandomJokeRequest({ request }: { request: Request }): boolean {
  try {
    const u = new URL(request.url);
    return u.hostname === 'api.chucknorris.io' && u.pathname === '/jokes/random';
  } catch {
    return false;
  }
}

const SLOW_HEADER = 'x-e2e-slow-ms';
const FAIL_AT_INDEX_HEADER = 'x-e2e-fail-at-index';

function parseSlowMs(request: Request): number {
  const raw = request.headers.get(SLOW_HEADER);
  if (!raw) {
    return 0;
  }
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function parseFailAtIndex(request: Request): number {
  const raw = request.headers.get(FAIL_AT_INDEX_HEADER);
  if (!raw) {
    return -1;
  }
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : -1;
}

/**
 * New handlers each time so sequential `callIndex` resets. Use for `resetHandlers` in Node
 * and in the browser when tests need a clean sequence.
 */
export function createJokeMockHandlers() {
  let callIndex = 0;
  /** Serialize mock index so parallel /jokes/random requests stay deterministic. */
  let queue = Promise.resolve();

  return [
    http.get(isChuckRandomJokeRequest, ({ request }) => {
      const run = queue.then(async () => {
        const slowMs = parseSlowMs(request);
        const failAtIndex = parseFailAtIndex(request);
        if (slowMs > 0) {
          await new Promise((r) => setTimeout(r, slowMs));
        }
        const shouldFail = callIndex === failAtIndex;
        if (shouldFail) {
          callIndex += 1;
          return HttpResponse.json({ message: 'forced e2e failure' }, { status: 500 });
        }
        const joke = MOCK_JOKES[callIndex % MOCK_JOKES.length];
        callIndex += 1;
        return HttpResponse.json({ ...joke });
      });
      queue = run.then(
        () => undefined,
        () => undefined
      );
      return run;
    }),
  ];
}
