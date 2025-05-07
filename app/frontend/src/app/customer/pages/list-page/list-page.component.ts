import { Component } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent {
  public products: Product[] = [];

  constructor( private productService: ProductService ) {}

  ngOnInit(): void {
    this.productService.getAllProuducts()
      .subscribe( products =>{
        this.products = products
      } );
  }
}
