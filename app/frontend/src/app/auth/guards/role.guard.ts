import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { navigateByRole } from '../utils/role-navigation';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const roles: number[] = route.data['roles'];
  const userRole = authService.role().code;
  if (roles.includes(userRole)) return true;
  navigateByRole(router, authService.role().code);
  return false;
};
