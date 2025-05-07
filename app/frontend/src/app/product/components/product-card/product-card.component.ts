import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styles: `
    .disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  `
})
export class ProductCardComponent {

  @Input({ required: true }) public product!: Product;

}
