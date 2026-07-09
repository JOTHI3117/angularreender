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
  { path: '**', redirectTo: 'persons' },
   {
    path: 'cart',
    loadComponent: () => import('./features/signals/signals').then((m) => m.Signals),
    canActivate: [authGuard],
  }
];
