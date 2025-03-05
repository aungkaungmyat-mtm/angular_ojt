import { Routes, CanActivateFn } from '@angular/router';
import { UserlistsComponent } from './features/usermanagement/components/userlists/userlists.component';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  // { path: 'auth/login', component: LoginComponent },

  {
    path: 'user/list',
    loadComponent: () =>
      import('./features/usermanagement/components/userlists/userlists.component').then(
        m => m.UserlistsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'user/profile',
    loadComponent: () => import('./features/usermanagement/components/user-profile/user-profile.component').then
    (m=>m.UserProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'user/profile/update/:id',
    loadComponent: () => import('./features/usermanagement/components/edit-user-profile/edit-user-profile.component').then
    (m=>m.EditUserProfileComponent),
    canActivate: [authGuard],
  },
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
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/components/forgot-password/forgot-password.component').then(m=> m.ForgotPasswordComponent)
  },
  {
    path: 'auth/resetPassword',
    loadComponent: () =>
      import('./features/auth/components/reset-password/reset-password.component').then(m=>m.ResetPasswordComponent)
  },
  { path: 'auth/logout', redirectTo: '/auth/login', pathMatch: 'full' },

  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
];
