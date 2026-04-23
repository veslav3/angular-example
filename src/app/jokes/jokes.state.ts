import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { catchError, finalize, of, tap } from 'rxjs';

import { FetchRandomJoke } from './jokes.actions';
import { CHUCK_NORRIS_JOKES_RANDOM, type ChuckJoke, type JokesStateModel } from './jokes.model';

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
