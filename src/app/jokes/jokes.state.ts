import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';

import { FetchInitialJokes, FetchRandomJoke } from './jokes.actions';
import {
  CHUCK_NORRIS_JOKES_RANDOM,
  INITIAL_JOKES_COUNT,
  type ChuckJoke,
  type JokesStateModel,
} from './jokes.model';

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

    const requests = Array.from({ length: INITIAL_JOKES_COUNT }, () =>
      this.http.get<ChuckJoke>(CHUCK_NORRIS_JOKES_RANDOM)
    );

    return forkJoin(requests).pipe(
      tap((batch) => {
        const seen = new Set<string>();
        const jokes = batch.filter((joke) => {
          if (seen.has(joke.id)) {
            return false;
          }
          seen.add(joke.id);
          return true;
        });
        ctx.patchState({ error: null, jokes });
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
  fetchRandomJoke(ctx: StateContext<JokesStateModel>) {
    ctx.patchState({ error: null, loading: true });

    return this.http.get<ChuckJoke>(CHUCK_NORRIS_JOKES_RANDOM).pipe(
      tap((joke) => {
        const { jokes } = ctx.getState();
        ctx.setState(
          patch({
            error: null,
            jokes: [...jokes, joke],
          })
        );
      }),
      catchError(() => {
        ctx.patchState({ error: 'Could not load a joke. Try again.' });
        return of(undefined);
      }),
      finalize(() => {
        ctx.patchState({ loading: false });
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
