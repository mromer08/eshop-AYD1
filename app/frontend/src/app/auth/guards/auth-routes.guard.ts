import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth.interface';
import { navigateByRole } from '../utils/role-navigation';


export const authRoutesGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (authService.authStatus() === AuthStatus.NotAuthenticated) return true;
      navigateByRole(router, authService.role().code);
  return false;
};

