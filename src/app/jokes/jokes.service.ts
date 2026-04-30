import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, mergeMap, toArray } from 'rxjs';

import { chuckRandomJokeUrl, type ChuckJoke } from './jokes.model';

@Injectable({ providedIn: 'root' })
export class JokesService {
  private readonly http = inject(HttpClient);

  fetchInitialJokes(count: number) {
    // Exactly one GET per slot. Distinct URLs avoid cache reusing one response.
    const batchNonce = Date.now();
    return from(Array.from({ length: count }, (_, i) => i)).pipe(
      mergeMap((i) =>
        this.http.get<ChuckJoke>(chuckRandomJokeUrl(`${batchNonce}-${i}`))
      ),
      toArray()
    );
  }
}
