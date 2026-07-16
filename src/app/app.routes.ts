import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'persons' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'persons',
    loadComponent: () => import('./features/persons/persons').then((m) => m.Persons),
    canActivate: [authGuard],
  },
  {
    path: 'mentors',
    loadComponent: () => import('./features/mentors/mentors').then((m) => m.Mentors),
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/signals/signals').then((m) => m.Signals),
    canActivate: [authGuard],
  },
  {
    path: 'rxjs-subjects',
    loadComponent: () =>
      import('./features/rxjs-subjects/rxjs-subjects').then((m) => m.RxjsSubjects),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'persons' },
];
