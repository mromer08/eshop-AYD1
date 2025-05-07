import { Component, Input } from '@angular/core';
import { DetalleVenta } from '../../interfaces/orders.interface';
import { ProductService } from '../../services/product.service';
import { SellService } from '../../services/sell.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-card',
  templateUrl: './cart-card.component.html',
  styles: `
    .input-small {
      width: 100%; /* Ajusta al 100% del contenedor */
      max-width: 50px; /* Limita el ancho máximo */
}
  `
})
export class CartCardComponent {
  @Input() detalle!: DetalleVenta;

  miFormulario: FormGroup = this.fb.group({
    existenciaLlevar: [ '0',[Validators.required, Validators.min(1)]],

  });

  constructor( private productService: ProductService,
               private fb: FormBuilder,
               private snackbar: MatSnackBar,
               private sellService: SellService,
               private router: Router ){}



  agregadosMap = {
    '=1'    : 'Unidad',
    'other' : 'Unidades'
  }

  delete():void {
    this.sellService.eliminarDetalleVenta( this.detalle );
  }

  modificarPrecio(): void {
    const existenciaLlevar = this.miFormulario.get('existenciaLlevar')?.value;
    const subTotal = this.detalle.product.price * existenciaLlevar
    this.sellService.agregarDetalleVenta( this.detalle.product, subTotal, existenciaLlevar );
    this.showSnackbar(`${ this.detalle.product.name } agregado correctamente`)
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'ok', {
      duration: 2500,
    })
  }
}
