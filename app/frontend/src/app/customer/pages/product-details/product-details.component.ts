import { Component } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellService } from '../../services/sell.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styles: ``
})
export class ProductDetailsComponent {
  public product!: Product;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private sellService: SellService,
    private snackbar: MatSnackBar
  ) {}

  miFormulario: FormGroup = this.fb.group({
    existenciaLlevar: [ '0', [Validators.required, Validators.minLength( 1 )]]
  });

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.productService.getProductByID( id )),
      )
      .subscribe( product => {

        if ( !product ) return this.router.navigate([ '/customer/list' ]);

        this.product = product;

        return;
      })
  }

  goBack():void {
    this.router.navigateByUrl('user/list')
  }

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
