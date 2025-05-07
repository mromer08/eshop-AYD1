import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { appendTokenToHeaders } from '../../auth/utils/headers';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly productURL: string = `${environments.API_URL}/product`;

  private httpClient = inject(HttpClient);
  private cookieService = inject(CookieService);

  private _products = signal<Product[]>([]);

  public products = computed(() => this._products());

  constructor() { }

  private processRequest(request: Observable<Product[]>): Observable<boolean> {
    return request.pipe(
      map(products => {
        this._products.set(products);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getProducts(): Observable<boolean> {
    const request = this.httpClient.get<Product[]>(this.productURL);
    return this.processRequest(request);
  }

  public addProduct(formdata: FormData): Observable<boolean> {
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpClient.post<Product>(this.productURL, formdata, { headers }).pipe(
      switchMap(() => this.getProducts())
    );
  }

  public editProduct(_id: string, formdata: FormData): Observable<boolean> {
    const url: string = `${this.productURL}/${_id}`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpClient.put<Product>(url, formdata, { headers }).pipe(
      switchMap(() => this.getProducts())
    );
  }

  public removeProduct(_id: string): Observable<boolean> {
    const url: string = `${this.productURL}/${_id}`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpClient.patch<void>(url, { headers }).pipe(
      switchMap(() => this.getProducts())
    );
  }

  public getProductById(_id: string): Observable<Product> {
    const url: string = `${this.productURL}/${_id}`;
    return this.httpClient.get<Product>(url).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    )
  }

}
