import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = environments.API_URL;


  constructor( private http: HttpClient ) { }

  getProductByID( id: string ): Observable<Product> {
    return this.http.get<Product>(`${ this.baseUrl }/product//${ id }`)
      .pipe(
        catchError( error => of( error ) )
      );
  }

  getAllProuducts():Observable<Product[]> {
    return this.http.get<Product[]>(`${ this.baseUrl }/product`);
  }
}
