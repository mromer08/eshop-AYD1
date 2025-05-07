import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Product } from '../../product/interfaces/product.interface';
import { of } from 'rxjs';
import { ProductService } from '../../product/services/product.service';

export const productByIdResolver: ResolveFn<Product|null> = (route, state) => {
  const router = inject(Router);
  if (!route.params['id']) {
    router.navigateByUrl('/admin');
    return of(null);
  } else {
    const productService = inject(ProductService);
    return productService.getProductById(route.params['id']);
  }
};
