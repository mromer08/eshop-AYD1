import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { SellService } from '../../services/sell.service';
import { MatSnackBar } from '@angular/material/snack-bar';

type NewType = FormBuilder;

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styles: ``
})
export class ProductCardComponent {
  @Input() product!: Product;

  miFormulario: FormGroup = this.fb.group({
    existenciaLlevar: [ '0', [Validators.required, Validators.min( 1 )]]
  });

  constructor( private fb: FormBuilder,
               private snackbar: MatSnackBar,
               private productService: ProductService,
               private sellService: SellService ){}

  agregar(): void {
    const existenciaLlevar = this.miFormulario.get('existenciaLlevar')?.value;
    const subTotal = this.product.price * existenciaLlevar
    this.sellService.agregarDetalleVenta( this.product, subTotal, existenciaLlevar );
    this.showSnackbar(`${ this.product.name } agregado correctamente`)
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'ok', {
      duration: 2500,
    })
  }
}
