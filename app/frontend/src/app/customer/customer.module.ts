import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { SharedModule } from '../shared/shared.module';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CustomerToolBarComponent } from './components/customer-tool-bar/customer-tool-bar.component';
import { MaterialModule } from '../material/material.module';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ProductImagePipe } from './pipes/product-image.pipe';
import { CartCardComponent } from './components/cart-card/cart-card.component';


@NgModule({
  declarations: [
    CustomerLayoutComponent,
    ShoppingCartComponent,
    CustomerToolBarComponent,
    ProductCardComponent,
    ProductDetailsComponent,
    ListPageComponent,
    ProductImagePipe,
    CartCardComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class CustomerModule { }
