import { Routes } from '@angular/router';

import { Favorites } from './pages/favorites';
import { Home } from './pages/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'favorites', component: Favorites },
];
