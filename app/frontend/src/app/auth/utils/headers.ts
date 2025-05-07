import { HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

export const appendTokenToHeaders = (cookieService: CookieService): HttpHeaders => {
    const token: string = cookieService.get('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
}