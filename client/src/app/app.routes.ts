import { Routes } from '@angular/router';

export const routes: Routes = [
  // { path: 'auth/login', component: LoginComponent },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component').then(
        m => m.RegisterComponent
      ),
  },
  { path: 'auth/logout', redirectTo: '/auth/login', pathMatch: 'full' },

  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
];
