import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';

import { FetchInitialJokes, FetchRandomJoke } from './jokes.actions';
import {
  chuckRandomJokeUrl,
  INITIAL_JOKES_COUNT,
  MAX_VISIBLE_JOKES,
  type ChuckJoke,
  type JokesStateModel,
} from './jokes.model';

/** Newest at end; drop from the front when over the cap (FIFO, not API timestamps). */
function appendFifoCapped(jokes: ChuckJoke[], joke: ChuckJoke, max: number): ChuckJoke[] {
  const next = [...jokes, joke];
  return next.length > max ? next.slice(-max) : next;
}

const DEFAULTS: JokesStateModel = {
  error: null,
  jokes: [],
  loading: false,
};

@State<JokesStateModel>({
  name: 'jokes',
  defaults: DEFAULTS,
})
@Injectable()
export class JokesState {
  private readonly http = inject(HttpClient);

  @Action(FetchInitialJokes)
  fetchInitialJokes(ctx: StateContext<JokesStateModel>) {
    ctx.patchState({ error: null, loading: true, jokes: [] });

    // Exactly one `GET` per initial slot (parallel). Each URL must differ or HTTP cache
    // can return a single joke for every parallel request.
    const requests = Array.from({ length: INITIAL_JOKES_COUNT }, (_, i) =>
      this.http.get<ChuckJoke>(chuckRandomJokeUrl(`${globalThis.crypto?.randomUUID?.() ?? i}-${i}`))
    );

    return forkJoin(requests).pipe(
      tap((batch) => {
        ctx.patchState({
          error: null,
          jokes: batch.slice(0, MAX_VISIBLE_JOKES),
        });
      }),
      catchError(() => {
        ctx.patchState({ error: 'Could not load jokes. Try reloading the page.' });
        return of(undefined);
      }),
      finalize(() => {
        ctx.patchState({ loading: false });
      })
    );
  }

  @Action(FetchRandomJoke)
  fetchRandomJoke(ctx: StateContext<JokesStateModel>, action: FetchRandomJoke) {
    const silent = action.silent;
    ctx.patchState({ error: null, ...(silent ? {} : { loading: true }) });

    return this.http
      .get<ChuckJoke>(
        chuckRandomJokeUrl(
          globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
        )
      )
      .pipe(
      tap((joke) => {
        const { jokes } = ctx.getState();
        ctx.setState(
          patch({
            error: null,
            jokes: appendFifoCapped(jokes, joke, MAX_VISIBLE_JOKES),
          })
        );
      }),
      catchError(() => {
        ctx.patchState({ error: 'Could not load a joke. Try again.' });
        return of(undefined);
      }),
      finalize(() => {
        if (!silent) {
          ctx.patchState({ loading: false });
        }
      })
    );
  }

  @Selector()
  static getError(state: JokesStateModel) {
    return state.error;
  }

  @Selector()
  static getJokes(state: JokesStateModel) {
    return state.jokes;
  }

  @Selector()
  static isLoading(state: JokesStateModel) {
    return state.loading;
  }
}
