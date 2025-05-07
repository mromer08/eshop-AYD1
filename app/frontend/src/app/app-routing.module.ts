import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authRoutesGuard } from './auth/guards/auth-routes.guard';
import { authGuard } from './auth/guards/auth.guard';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { roleGuard } from './auth/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [authRoutesGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: { roles: [1001, 1002] },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    data: { roles: [2000, 2001] },
    canActivate: [roleGuard]
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'customer'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
