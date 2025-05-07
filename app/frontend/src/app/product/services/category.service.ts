import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { Category } from '../interfaces/product.interface';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { appendTokenToHeaders } from '../../auth/utils/headers';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly categoryURL: string = `${environments.API_URL}/category`;
  
  private httpClient = inject(HttpClient);
  private cookieService = inject(CookieService);

  private _categories = signal<Category[]>([]);

  public categories = computed(() => this._categories());

  constructor() { }

  private processRequest(request: Observable<Category[]>): Observable<boolean> {
    return request.pipe(
      map(categories => {
        this._categories.set(categories);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getCategories(): Observable<boolean> {
    const request = this.httpClient.get<Category[]>(this.categoryURL);
    return this.processRequest(request);
  }

  public createCategory(name: string): Observable<boolean> {
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpClient.post<void>(this.categoryURL, { name }, { headers }).pipe(
      switchMap(() => this.getCategories())
    );
  }

  public editCategory(_id: string, name: string): Observable<boolean> {
    const url: string = `${this.categoryURL}/${_id}`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpClient.put<void>(url, { name }, { headers }).pipe(
      switchMap(() => this.getCategories())
    );
  }

  public deleteCategory(_id: string): Observable<boolean> {
    const url: string = `${this.categoryURL}/${_id}`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.httpClient.delete<void>(url, { headers }).pipe(
      switchMap(() => this.getCategories())
    );
  }

}
