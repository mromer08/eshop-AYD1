import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { PermissionType } from '../../auth/interfaces/user.interface';
import { AdminService } from '../services/admin.service';

export const permissionTypeResolver: ResolveFn<PermissionType[]> = (route, state) => {
  const adminService = inject(AdminService);
  return adminService.getPermissionTypes();
};
