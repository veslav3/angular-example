export interface ChuckJoke {
  icon_url: string;
  id: string;
  url: string;
  value: string;
}

export const CHUCK_NORRIS_JOKES_RANDOM = 'https://api.chucknorris.io/jokes/random';

/** Number of jokes to load in parallel on first paint (see `FetchInitialJokes`). */
export const INITIAL_JOKES_COUNT = 10;

export interface JokesStateModel {
  error: string | null;
  jokes: ChuckJoke[];
  loading: boolean;
}
