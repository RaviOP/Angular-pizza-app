import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService: AuthService) { }
    
    intercept(req: HttpRequest<any>,next: HttpHandler) {
        const authToken = this.authService.getToken()
        if (authToken) {
            const authRequest = req.clone({
                headers: req.headers.set("Authorization", authToken)
            })
            return next.handle(authRequest)
        } else {
            const newRequest = req.clone({ setHeaders: { 'Authorization': 'Bearer fakeToken' } });
            return next.handle(newRequest);
        }
    }
}