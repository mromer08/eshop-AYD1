import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StoreSettings, UpdateSettings } from '../interfaces/store-settings.interface';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environments } from '../../../environments/environments';
import { appendTokenToHeaders } from '../../auth/utils/headers';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StoreSettingsService {

  private readonly settingsURL: string = `${environments.API_URL}/store-settings`; 

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private _settings = signal<StoreSettings|null>(null);
  public settings = computed(() => this._settings());

  constructor() { }

  private processRequest(request: Observable<StoreSettings>): Observable<boolean> {
    return request.pipe(
      map((storeSettings) => {
        this._settings.set(storeSettings);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getSettings(): Observable<boolean> {
    const request: Observable<StoreSettings> = this.http.get<StoreSettings>(this.settingsURL);
    return this.processRequest(request);
  }

  public updateSettings(newSettings: FormData): Observable<boolean> {
    const headers: HttpHeaders = appendTokenToHeaders(this.cookieService);
    const request: Observable<StoreSettings> = this.http.put<StoreSettings>(this.settingsURL, newSettings, { headers });
    return this.processRequest(request);
  }

}
