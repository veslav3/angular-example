export interface ChuckJoke {
  icon_url: string;
  id: string;
  url: string;
  value: string;
}

export const CHUCK_NORRIS_JOKES_RANDOM = 'https://api.chucknorris.io/jokes/random';

export interface JokesStateModel {
  error: string | null;
  jokes: ChuckJoke[];
  loading: boolean;
}
