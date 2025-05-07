import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { forkJoin, Observable } from 'rxjs';

interface JoinReports {
  topSellingProducts: Report[];
  topCustomers: Report[];
  topSpending: Report[];
  topShipping: Report[];
  topPayment: Report[];
  topStatus: Report[];
}

export const reportsResolver: ResolveFn<Observable<JoinReports>> = (route, state) => {
  const adminService = inject(AdminService);
  return forkJoin({
    topSellingProducts: adminService.getTopSellingProducts(),
    topCustomers: adminService.getTopCustomers(),
    topSpending: adminService.getTopSpending(),
    topShipping:  adminService.getTopOrderShipping(),
    topPayment: adminService.getTopOrderPayment(),
    topStatus: adminService.getTopOrderStatus()
  });
};
