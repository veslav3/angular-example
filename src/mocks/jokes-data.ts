import { type ChuckJoke } from '../app/jokes/jokes.model';

/** Ten deterministic jokes used by MSW in tests and during mocked dev. */
export const MOCK_JOKES: readonly ChuckJoke[] = [
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-1',
    url: '',
    value: 'Chuck Norris does not sleep. He waits.',
  },
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-2',
    url: '',
    value: 'Chuck Norris counted to infinity. Twice.',
  },
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-3',
    url: '',
    value: 'Chuck Norris can divide by zero.',
  },
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-4',
    url: '',
    value: 'Chuck Norris does not get frostbite. Chuck Norris bites frost.',
  },
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-5',
    url: '',
    value: 'Chuck Norris can clap with one hand.',
  },
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-6',
    url: '',
    value: 'Chuck Norris is the only person who can order at Subway without choosing ingredients.',
  },
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-7',
    url: '',
    value: "Chuck Norris' tears cure cancer. Too bad he has never cried.",
  },
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-8',
    url: '',
    value: "Chuck Norris' calendar goes straight from March 31st to April 2. Nobody fools Chuck Norris.",
  },
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-9',
    url: '',
    value: 'Chuck Norris does not do push-ups. He pushes the world down.',
  },
  {
    icon_url: 'https://api.chucknorris.io/img/avatar/chuck-norris.png',
    id: 'mock-10',
    url: '',
    value: 'The dinosaurs looked at Chuck Norris the wrong way once. You know what happened to them.',
  },
] as const;

export const RANDOM_JOKE_URL = 'https://api.chucknorris.io/jokes/random';
