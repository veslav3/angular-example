import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { type ChuckJoke } from './jokes.model';

const STORAGE_KEY = 'angular-example.chuck-favorites';

function isChuckJokeArray(value: unknown): value is ChuckJoke[] {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      typeof (item as ChuckJoke).id === 'string' &&
      'value' in item &&
      typeof (item as ChuckJoke).value === 'string'
  );
}

@Injectable({ providedIn: 'root' })
export class FavoriteJokesService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _favorites = signal<ChuckJoke[]>([]);

  /** Stored jokes (order preserved; duplicates by `id` are avoided on toggle). */
  readonly favorites = this._favorites.asReadonly();

  readonly favoriteIdSet = computed(() => new Set(this._favorites().map((j) => j.id)));

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._favorites.set(this.readStorage());
    }
  }

  toggleFavorite(joke: ChuckJoke): void {
    const id = joke.id;
    this._favorites.update((list) => {
      const i = list.findIndex((j) => j.id === id);
      if (i === -1) {
        return [...list, joke];
      }
      return list.filter((_, idx) => idx !== i);
    });
    this.writeStorage();
  }

  private readStorage(): ChuckJoke[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      return isChuckJokeArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._favorites()));
    } catch {
      // Quota or private mode — keep in-memory favorites only.
    }
  }
}
