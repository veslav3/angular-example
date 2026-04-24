import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoriteJokesService } from '../jokes/favorite-jokes.service';
import { type ChuckJoke } from '../jokes/jokes.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-favorites',
  imports: [RouterLink],
  styleUrl: './favorites.scss',
  templateUrl: './favorites.html',
})
export class Favorites {
  private readonly favoriteJokes = inject(FavoriteJokesService);

  protected readonly favorites = this.favoriteJokes.favorites;

  protected toggleFavorite(joke: ChuckJoke): void {
    this.favoriteJokes.toggleFavorite(joke);
  }
}
