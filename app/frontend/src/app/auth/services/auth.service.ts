import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environments } from '../../../environments/environments';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthRespose, AuthStatus } from '../interfaces/auth.interface';
import { Permission, Role, User, UserResponse } from '../interfaces/user.interface';
import { appendTokenToHeaders } from '../utils/headers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authURL: string = `${environments.API_URL}/auth`;
  private readonly userURL: string = `${environments.API_URL}/user`;

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  private _user = signal<User|null>(null);
  private _role = signal<Role>({ name: 'VISITOR', code: 2001 });
  private _permissions = signal<Permission[]>([]);
  private _authStatus = signal<AuthStatus>(AuthStatus.Checking);

  public user = computed(() => this._user());
  public role = computed(() => this._role());
  public permissions = computed(() => this._permissions());
  public authStatus = computed(() => this._authStatus());

  constructor() { }

  private processProfileReq(request: Observable<UserResponse>): Observable<boolean> {
    return request.pipe(
      map(({role, permissions, ...user}) => {
        this._authStatus.set(AuthStatus.Authenticated);
        this._user.set(user);
        this._role.set(role);
        this._permissions.set(permissions);
        return true
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  private processRequest(request: Observable<AuthRespose>): Observable<boolean> {
    return request.pipe(
      switchMap(({ token }) => {
        this.cookieService.set('token', token);
        return this.getUserInfo();
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getUserInfo(): Observable<boolean> {
    const url: string = `${this.userURL}/profile`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.processProfileReq(this.http.get<UserResponse>(url, { headers }));
  }

  public updateUserInfo(body: FormData): Observable<boolean> {
    const url: string = `${this.userURL}/profile`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.processProfileReq(this.http.put<UserResponse>(url, body, { headers }));
  }

  public updatePswd(current_password: string, new_password: string): Observable<boolean> {
    const url: string = `${this.userURL}/pwd`;
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    return this.http.patch<void>(url, { current_password, new_password }, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public login(email: string, password: string): Observable<boolean> {
    const url: string = `${this.authURL}/login`;
    return this.processRequest(this.http.post<AuthRespose>(url, { email, password }));
  }

  public register(user: FormData): Observable<boolean> {
    const url: string = `${this.authURL}/register`;
    return this.processRequest(this.http.post<AuthRespose>(url, user));
  }

  public logout(): void {
    this.cookieService.delete('token');
    this._user.set(null);
    this._role.set({ name: 'VISITOR', code: 2001 });
    this._permissions.set([]);
    this._authStatus.set(AuthStatus.NotAuthenticated);
  }

  public checkStatus(): Observable<boolean> {
    if (this.cookieService.check('token')) {
      return this.getUserInfo();
    }
    this._authStatus.set(AuthStatus.NotAuthenticated);
    return of(false);
  }

}
