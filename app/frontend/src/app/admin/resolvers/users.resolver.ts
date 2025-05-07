import { ResolveFn } from '@angular/router';
import { UserResponse } from '../../auth/interfaces/user.interface';
import { AdminService } from '../services/admin.service';
import { inject } from '@angular/core';

export const usersResolver: ResolveFn<UserResponse[]> = (route, state) => {
  const adminService = inject(AdminService);
  return adminService.getAllUsers();
};
