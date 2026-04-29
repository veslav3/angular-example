import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import { chuckRandomJokeUrl, type ChuckJoke } from './jokes.model';

@Injectable({ providedIn: 'root' })
export class JokesService {
  private readonly http = inject(HttpClient);

  fetchInitialJokes(count: number) {
    // Exactly one GET per slot. Distinct URLs avoid cache reusing one response.
    const requests = Array.from({ length: count }, (_, i) =>
      this.http.get<ChuckJoke>(chuckRandomJokeUrl(`${globalThis.crypto?.randomUUID?.() ?? i}-${i}`))
    );
    return forkJoin(requests);
  }
}
