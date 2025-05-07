import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../product/services/product.service';
import { Product } from '../../../product/interfaces/product.interface';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styles: ``
})
export class ProductsPageComponent implements OnInit {

  private productService = inject(ProductService);
  private snackBarService = inject(SnackBarService);

  public products: Product[] = [];

  ngOnInit(): void {
    this.products = this.productService.products();
  }

  public returnLink(_id: string): string {
    return `/admin/edit-product/${_id}`;
  }

  public deleteProduct(_id: string): void {
    this.productService.removeProduct(_id).subscribe({
      next: () => this.snackBarService.showSuccess('Producto removido del inventario actual.'),
      error: () => this.snackBarService.showError('No se pudo remover le producto.')
    });
  }

  public updateProduct(_id: string): void {
    const formdata = new FormData();
    formdata.append('availability', 'true');
    this.productService.editProduct(_id, formdata).subscribe({
      next: () => this.snackBarService.showSuccess('El producto vuelve a estar disponible.'),
      error: () => this.snackBarService.showError('Ocurrio un error.')
    });
  }

}
