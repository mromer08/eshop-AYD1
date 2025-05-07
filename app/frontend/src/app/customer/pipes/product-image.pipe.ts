import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Pipe({
  name: 'productImage',
  pure: false
})
export class ProductImagePipe implements PipeTransform {

  transform( product: Product  ): string {

    if ( product.image_url ) {

      return product.image_url;
    }

    return `https://ih1.redbubble.net/image.4905811447.8675/flat,750x,075,f-pad,750x1000,f8f8f8.jpg`;
  }
}
