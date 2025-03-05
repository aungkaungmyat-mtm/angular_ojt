import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
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
    path: 'post/list',
    loadComponent: () =>
      import('./features/post-management/components/post-list/post-list.component').then(
        m => m.PostListComponent
      ),
    canActivate: [authGuard],
  },

  { path: '', redirectTo: '/post/list', pathMatch: 'full' },
  { path: '**', redirectTo: '/post/list', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
];
