import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { of } from 'rxjs';
import { UserResponse } from '../../auth/interfaces/user.interface';

export const staffByIdResolver: ResolveFn<UserResponse|null> = (route, state) => {
  const router = inject(Router);
  if (!route.params['id']) {
    router.navigateByUrl('/admin');
    return of(null);
  } else {
    const adminService = inject(AdminService);
    return adminService.getStaffById(route.params['id']);
  }
};
