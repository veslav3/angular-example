import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';

import { FetchRandomJoke } from '../jokes.actions';
import { JokesState } from '../jokes.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-jokes',
  styleUrl: './jokes.scss',
  templateUrl: './jokes.html',
})
export class Jokes {
  private readonly store = inject(Store);

  protected readonly error = this.store.selectSignal(JokesState.getError);
  protected readonly loading = this.store.selectSignal(JokesState.isLoading);
  protected readonly jokes = this.store.selectSignal(JokesState.getJokes);

  protected getNewJoke() {
    this.store.dispatch(new FetchRandomJoke());
  }
}
