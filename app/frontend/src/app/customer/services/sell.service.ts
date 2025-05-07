import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Product } from '../interfaces/product.interface';
import { DetalleVenta, Order } from '../interfaces/orders.interface';
import { appendTokenToHeaders } from '../../auth/utils/headers';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SellService {

  private _baseUrl: string = environments.API_URL;
  public get baseUrl(): string {
    return this._baseUrl;
  }
  public set baseUrl(value: string) {
    this._baseUrl = value;
  }
  private _detalleVenta: DetalleVenta[] = [];

  private _total: number = 0;
  private _cantidad: number = 0;


  constructor( private http: HttpClient,
               private coockieService: CookieService
  ) { }



  get total(){
    this._total = 0;
    this.detalleVenta.forEach( (detalle )=> {
      this._total += detalle.sub_total
    })
    return this._total;
  }

  get cantidad(){
    this._cantidad = this.detalleVenta.length;
    return this._cantidad;
  }

  get detalleVenta() {
    return this._detalleVenta;
  }

  agregarDetalleVenta(product: Product, subTotal: number, cantidad: number) {
    const detalleExistente = this.detalleVenta.find(detalle => detalle.product._id === product._id);

    if ( detalleExistente ) {
      detalleExistente.sub_total = subTotal;
      detalleExistente.quantity = cantidad;
    } else {
      const detalleVentaAsignado: DetalleVenta = { product, sub_total: subTotal, quantity: cantidad };
      this.detalleVenta.push(detalleVentaAsignado);
    }
  }

  eliminarDetalleVenta(detalle: DetalleVenta) {
    const index = this._detalleVenta.findIndex(d => d === detalle);
    if (index !== -1) {
      this.detalleVenta.splice(index, 1);
    }

  }

  vaciarCarrito(){
    this.detalleVenta.splice(0, this.detalleVenta.length);

  }

  postVenta( ){
    const headers: HttpHeaders = appendTokenToHeaders( this.coockieService )
    const order: Order  = {
      payment_method: 'Cash',
      shipping_method: 'Store Pickup',
      products: this.detalleVenta
    }
    return this.http.post(`${ this.baseUrl }/order`, order, { headers} );
  }

  reiniciarVariables(){
    this._total = 0;
    this._cantidad = 0;
    this._detalleVenta = []
  }

}