import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

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
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/components/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
];
