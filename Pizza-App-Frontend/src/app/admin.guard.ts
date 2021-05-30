import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Auth } from "./auth/auth.model";
import { AuthService } from "./auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return new Promise((resolve, reject) => {
            const isAuth = this.authService.getIsAuth()
            const id = this.authService.getUserId()
            if (isAuth) {
                this.authService.getUser(id).subscribe(
                    (user: Auth) => {
                        if (user.role === 'admin') {
                            resolve(true)
                        } else {
                            this.router.navigate(['/'])
                            resolve(false)
                        }

                    }
                )
            }
        })
    }
}