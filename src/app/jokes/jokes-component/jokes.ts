import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { interval, Subscription } from 'rxjs';

import { FavoriteJokesService } from '../favorite-jokes.service';
import { FetchInitialJokes, FetchRandomJoke } from '../jokes.actions';
import { type ChuckJoke, JOKE_TIMER_INTERVAL_MS } from '../jokes.model';
import { JokesState } from '../jokes.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-jokes',
  styleUrl: './jokes.scss',
  templateUrl: './jokes.html',
})
export class Jokes implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly favoriteJokes = inject(FavoriteJokesService);
  private timerSub: Subscription | null = null;

  protected readonly error = this.store.selectSignal(JokesState.getError);
  protected readonly loading = this.store.selectSignal(JokesState.isLoading);
  protected readonly jokes = this.store.selectSignal(JokesState.getJokes);
  protected readonly timerOn = signal(false);
  protected readonly favoriteIdSet = this.favoriteJokes.favoriteIdSet;
  protected readonly atFavoriteLimit = this.favoriteJokes.atFavoriteLimit;

  constructor() {
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  ngOnInit(): void {
    this.store.dispatch(new FetchInitialJokes());
  }

  protected getNewJoke() {
    this.store.dispatch(new FetchRandomJoke());
  }

  protected toggleFavorite(joke: ChuckJoke, event: Event): void {
    event.stopPropagation();
    this.favoriteJokes.toggleFavorite(joke);
  }

  protected toggleTimer(): void {
    if (this.timerSub) {
      this.stopTimer();
      return;
    }
    this.timerOn.set(true);
    this.timerSub = interval(JOKE_TIMER_INTERVAL_MS).subscribe(() => {
      this.store.dispatch(new FetchRandomJoke(true));
    });
  }

  private stopTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = null;
    this.timerOn.set(false);
  }
}
