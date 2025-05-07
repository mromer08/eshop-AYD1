import { ResolveFn } from '@angular/router';
import { Role } from '../../auth/interfaces/user.interface';
import { AdminService } from '../services/admin.service';
import { inject } from '@angular/core';

export const roleResolver: ResolveFn<Role[]> = (route, state) => {
  const adminService = inject(AdminService);
  return adminService.getRoles();
};
