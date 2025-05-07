import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { ProfilePageComponent } from '../shared/pages/profile-page/profile-page.component';
import { roleGuard } from '../auth/guards/role.guard';
import { authGuard } from '../auth/guards/auth.guard';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      {
        path: 'list',
        component: ListPageComponent
      },
      {
        path: 'product/:id',
        component: ProductDetailsComponent
      },
      {
        path: 'my-account',
        component: ProfilePageComponent,
        canActivate: [authGuard]
      },
      {
        path: '**',
        redirectTo: 'list'
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
