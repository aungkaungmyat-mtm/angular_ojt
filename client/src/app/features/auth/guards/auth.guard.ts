import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap, of } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  loadingService.show();
  return authService.isLoggedIn().pipe(
    tap(() => loadingService.hide()),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['auth/login']);
        return false;
      }
    })
  );
};
