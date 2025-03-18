import { Routes } from '@angular/router';

import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { notAuthGuard } from './features/auth/guards/not-auth.guard';

export const routes: Routes = [
  {
    path: 'post/list',
    loadComponent: () =>
      import('./features/post-management/components/post-list/post-list.component').then(
        m => m.PostListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'post/create',
    loadComponent: () =>
      import('./features/post-management/components/post-form/post-form.component').then(
        m => m.PostFormComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'post/detail/:documentId',
    loadComponent: () =>
      import('./features/post-management/components/post-detail/post-detail.component').then(
        m => m.PostDetailComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'post/edit/:documentId',
    loadComponent: () =>
      import('./features/post-management/components/post-form/post-form.component').then(
        m => m.PostFormComponent
      ),
    canActivate: [authGuard],
  },

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
    loadComponent: () =>
      import('./features/usermanagement/components/user-profile/user-profile.component').then(
        m => m.UserProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'user/profile/update/:id',
    loadComponent: () =>
      import(
        './features/usermanagement/components/edit-user-profile/edit-user-profile.component'
      ).then(m => m.EditUserProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'otheruser/profile/:id',
    loadComponent: () =>
      import(
        './features/usermanagement/components/other-user-profile/other-user-profile.component'
      ).then(m => m.OtherUserProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component').then(m => m.LoginComponent),
    canActivate: [notAuthGuard],
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component').then(
        m => m.RegisterComponent
      ),
    canActivate: [notAuthGuard],
  },
  {
    path: 'auth/update-password',
    loadComponent: () =>
      import('./features/auth/components/update-password/update-password.component').then(
        m => m.UpdatePasswordComponent
      ),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/components/forgot-password/forgot-password.component').then(
        m => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'auth/reset-password',
    loadComponent: () =>
      import('./features/auth/components/reset-password/reset-password.component').then(
        m => m.ResetPasswordComponent
      ),
  },
  { path: 'auth/logout', redirectTo: '/auth/login', pathMatch: 'full' },

  { path: 'auth/confirm-email', redirectTo: '/auth/login', pathMatch: 'full' },

  { path: '', redirectTo: '/post/list', pathMatch: 'full' },

  { path: '**', component: PageNotFoundComponent },
];
