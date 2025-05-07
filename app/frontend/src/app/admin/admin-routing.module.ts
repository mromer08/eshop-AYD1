import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ProfilePageComponent } from '../shared/pages/profile-page/profile-page.component';
import { AddProductPageComponent } from './pages/add-product-page/add-product-page.component';
import { EditProductPageComponent } from './pages/edit-product-page/edit-product-page.component';
import { productByIdResolver } from './resolvers/product-by-id.resolver';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { AddStaffPageComponent } from './pages/add-staff-page/add-staff-page.component';
import { StaffPageComponent } from './pages/staff-page/staff-page.component';
import { permissionTypeResolver } from './resolvers/permission-type.resolver';
import { roleResolver } from './resolvers/role.resolver';
import { staffByIdResolver } from './resolvers/staff-by-id.resolver';
import { EditStaffPermissionsPageComponent } from './pages/edit-staff-permissions-page/edit-staff-permissions-page.component';
import { usersResolver } from './resolvers/users.resolver';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { reportsResolver } from './resolvers/reports.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'products',
        title: 'Productos',
        component: ProductsPageComponent
      },
      {
        path: 'add-product',
        title: 'Agregar Producto',
        component: AddProductPageComponent
      },
      {
        path: 'edit-product/:id',
        title: 'Editar Producto',
        component: EditProductPageComponent,
        resolve: { product: productByIdResolver }
      },
      {
        path: 'categories',
        title: 'Categorias',
        component: CategoriesPageComponent
      },
      {
        path: 'staff',
        title: 'Personal',
        resolve: { users: usersResolver },
        component: StaffPageComponent
      },
      {
        path: 'add-staff',
        title: 'Agregar Personal',
        resolve: { permissionType: permissionTypeResolver, role: roleResolver },
        component: AddStaffPageComponent
      },
      {
        path: 'edit-staff-permissions/:id',
        title: 'Agregar Personal',
        resolve: { permissionType: permissionTypeResolver, user: staffByIdResolver },
        component: EditStaffPermissionsPageComponent
      },
      {
        path: 'orders',
        title: 'Ordenes',
        component: OrdersPageComponent
      },
      {
        path: 'reports',
        title: 'Reportes',
        component:  ReportsPageComponent,
        resolve: { reports: reportsResolver }
      },
      {
        path: 'settings',
        title: 'Configuración',
        component: SettingsPageComponent
      },
      {
        path: 'my-account',
        component: ProfilePageComponent,
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
