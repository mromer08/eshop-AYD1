import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DetalleVenta } from '../../interfaces/orders.interface';
import { SellService } from '../../services/sell.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'customer-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styles: ``
})
export class ShoppingCartComponent {

  @Input({ required: true }) public sidenav!: MatSidenav;


  public detalles: DetalleVenta[] = [];

  constructor(private sellService: SellService,
              private snackbar: MatSnackBar,
              private router: Router ) {}

  ngOnInit(): void {
    this.detalles = this.sellService.detalleVenta;
  }

  vaciarCarrito(): void{
    this.sellService.vaciarCarrito();
    this.showSnackbar('Carrito vaciado correctamente!')
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'ok', {
      duration: 2500,
    })
  }

  validarBotones(): boolean {
    if( this.sellService.detalleVenta.length > 0 ){
      return false;
    }
    return true;
  }

  get total(): number {
    return this.sellService.total;
  }

  get cantidad(): number {
    return this.sellService.cantidad;
  }

  comprar(): void {
    this.sellService.postVenta().subscribe( res => {
      this.sellService.vaciarCarrito();
      this.showSnackbar("Compra realizada correctamente")
      // window.location.href = `http://localhost:3500/api/bill/${(res as { _id: string })._id}`;
    })
    //this.router.navigate(['/user/shop']);
  }

}