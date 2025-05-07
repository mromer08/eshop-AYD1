import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminToolBarComponent } from './components/admin-tool-bar/admin-tool-bar.component';
import { SharedModule } from '../shared/shared.module';
import { ProductModule } from '../product/product.module';
import { AddProductPageComponent } from './pages/add-product-page/add-product-page.component';
import { EditProductPageComponent } from './pages/edit-product-page/edit-product-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddStaffPageComponent } from './pages/add-staff-page/add-staff-page.component';
import { StaffPageComponent } from './pages/staff-page/staff-page.component';
import { StaffPermissionsComponent } from './components/staff-permissions/staff-permissions.component';
import { EditStaffPermissionsPageComponent } from './pages/edit-staff-permissions-page/edit-staff-permissions-page.component';
import { StaffCardComponent } from './components/staff-card/staff-card.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminToolBarComponent,
    AddProductPageComponent,
    EditProductPageComponent,
    CategoriesPageComponent,
    AddStaffPageComponent,
    StaffPageComponent,
    StaffPermissionsComponent,
    EditStaffPermissionsPageComponent,
    StaffCardComponent,
    OrdersPageComponent,
    SettingsPageComponent,
    ProductsPageComponent,
    ReportsPageComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ProductModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxChartsModule
  ]
})
export class AdminModule { }
