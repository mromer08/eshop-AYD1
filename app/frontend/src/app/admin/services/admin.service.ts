import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { appendTokenToHeaders } from '../../auth/utils/headers';
import { CookieService } from 'ngx-cookie-service';
import { CurrentPermission, PermissionType, Role, UserResponse } from '../../auth/interfaces/user.interface';
import { Staff } from '../interfaces/staff.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly permissionURL: string = `${environments.API_URL}/permission-type`;
  private readonly roleURL: string = `${environments.API_URL}/role`;
  private readonly userURL: string = `${environments.API_URL}/user`;
  private readonly reportURL: string = `${environments.API_URL}/report`;

  private cookieService = inject(CookieService);
  private httpclient = inject(HttpClient);

  constructor() { }

  public getPermissionTypes(): Observable<PermissionType[]> {
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpclient.get<PermissionType[]>(this.permissionURL, { headers }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getRoles(): Observable<Role[]> {
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpclient.get<Role[]>(this.roleURL, { headers }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public createStaff(staff: Staff): Observable<boolean> {
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpclient.post<void>(this.userURL, staff, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    )
  } 

  public getStaffById(_id: string): Observable<UserResponse> {
    const url: string = `${this.userURL}/${_id}`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpclient.get<UserResponse>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public editPermissions(_id: string, permissions: CurrentPermission[]): Observable<boolean> {
    const url: string = `${this.userURL}/permissions/${_id}`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpclient.put<void>(url, { permissions }, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getAllUsers(): Observable<UserResponse[]> {
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpclient.get<UserResponse[]>(this.userURL, { headers }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  private getReport(route: string): Observable<Report[]> {
    const url: string = `${this.reportURL}/${route}`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpclient.get<Report[]>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getTopSellingProducts(): Observable<Report[]> {
    return this.getReport('top-selling-products');
  }

  public getTopCustomers(): Observable<Report[]> {
    return this.getReport('top-active-users');
  }

  public getTopSpending(): Observable<Report[]> {
    return this.getReport('top-spending-users');
  }

  public getTopOrderShipping(): Observable<Report[]> {
    return this.getReport('order-count?groupBy=shipping_method');
  }

  public getTopOrderPayment(): Observable<Report[]> {
    return this.getReport('order-count?groupBy=payment_method');
  }

  public getTopOrderStatus(): Observable<Report[]> {
    return this.getReport('order-count?groupBy=status');
  }

}
