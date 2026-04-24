export class FetchRandomJoke {
  static readonly type = '[Jokes] Fetch random';

  /**
   * When true, no `loading` flag (for the 5s timer so the main button stays usable).
   */
  constructor(public readonly silent = false) {}
}

export class FetchInitialJokes {
  static readonly type = '[Jokes] Fetch initial batch';
}
