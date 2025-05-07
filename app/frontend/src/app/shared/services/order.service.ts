import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { Order, Status } from '../interfaces/order.interface';
import { CookieService } from 'ngx-cookie-service';
import { appendTokenToHeaders } from '../../auth/utils/headers';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly orderURL: string = `${environments.API_URL}/order`;

  private httpClient = inject(HttpClient);
  private cookieService = inject(CookieService);

  private _orders = signal<Order[]>([]);

  public orders = computed(() => this._orders());

  constructor() { }

  private processRequest(request: Observable<Order[]>): Observable<boolean> {
    return request.pipe(
      map(orders => {
        this._orders.set(orders);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getOrders(): Observable<boolean> {
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    const request = this.httpClient.get<Order[]>(this.orderURL, { headers });
    return this.processRequest(request);
  }

  public updataOrderStatusById(_id: string, status: Status): Observable<boolean> {
    const url: string = `${this.orderURL}/${_id}`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpClient.put<void>(url, { status }, { headers }).pipe(
      switchMap(() => this.getOrders())
    );
  }

}
