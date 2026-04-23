import { setupWorker } from 'msw/browser';

import { createJokeMockHandlers } from './joke-handlers';

declare global {
  interface Window {
    __E2E_RESET_MSW?: () => void;
  }
}

export async function startMsw() {
  const worker = setupWorker(...createJokeMockHandlers());
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
  window.__E2E_RESET_MSW = () => {
    worker.resetHandlers(...createJokeMockHandlers());
  };
}
