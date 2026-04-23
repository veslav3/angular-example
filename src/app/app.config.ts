import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore, withNgxsPendingTasks } from '@ngxs/store';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { JokesState } from './jokes/jokes.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideStore([JokesState], withNgxsPendingTasks()),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ],
};
