export interface ChuckJoke {
  icon_url: string;
  id: string;
  url: string;
  value: string;
}

export const CHUCK_NORRIS_JOKES_RANDOM = 'https://api.chucknorris.io/jokes/random';

/**
 * Same endpoint, unique URL per request so the browser (and `fetch`) does not reuse one
 * cached `GET /jokes/random` body for every parallel initial load.
 */
export function chuckRandomJokeUrl(nonce: string): string {
  const u = new URL(CHUCK_NORRIS_JOKES_RANDOM);
  u.searchParams.set('_cb', nonce);
  return u.toString();
}

/** Max jokes shown; oldest in list order is dropped when a new one arrives (API has no created_at). */
export const MAX_VISIBLE_JOKES = 10;

/** Number of jokes to load in parallel on first paint (see `FetchInitialJokes`). */
export const INITIAL_JOKES_COUNT = MAX_VISIBLE_JOKES;

/** Interval for the optional auto-refresh timer (ms). */
export const JOKE_TIMER_INTERVAL_MS = 5000;

export interface JokesStateModel {
  error: string | null;
  jokes: ChuckJoke[];
  loading: boolean;
}
