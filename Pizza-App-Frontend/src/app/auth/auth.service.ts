import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CartService } from '../customer/cart.service';
import { Auth } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginError = new Subject<string>();
  private token!: string;
  private userId!: string;
  private tokenTimer!: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  readonly ROOT_URL;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {
    // this.ROOT_URL = 'https://ravi-pizza-api.herokuapp.com/api/users'
    this.ROOT_URL = 'http://localhost:3000/api/users';
  }

  public getLoginErrors(): Subject<string> {
    return this.loginError;
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }
  // ---->
  createUser(user: { name: string; email: string; password: string }) {
    this.http
      .post<{
        user: { _id: string; name: string; email: string; role: string };
        token: string;
        expiresIn: number;
      }>(`${this.ROOT_URL}/signup`, user)
      .subscribe(
        (res) => {
          this.token = res.token;

          if (res.token) {
            this.userId = res.user._id;

            const expiresInDuration = res.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.authStatusListener.next(true);
            this.isAuthenticated = true;

            const now = new Date();
            const expiration = new Date(
              now.getTime() + expiresInDuration * 1000
            );

            this.saveAuthData(res.token, expiration, res.user._id);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.loginError.next(error.error);
          this.authStatusListener.next(false);
          this.isAuthenticated = false;
        }
      );
  }

  loginUser(user: { email: string; password: string }) {
    this.http
      .post<{
        user: { _id: string; name: string; email: string; role: string };
        token: string;
        expiresIn: number;
      }>(`${this.ROOT_URL}/login`, user)
      .subscribe(
        (res) => {
          this.token = res.token;

          if (res.token) {
            this.userId = res.user._id;

            const expiresInDuration = res.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.authStatusListener.next(true);
            this.isAuthenticated = true;

            const now = new Date();
            const expiration = new Date(
              now.getTime() + expiresInDuration * 1000
            );

            this.saveAuthData(res.token, expiration, res.user._id);
            if (res.user.role === 'admin') {
              this.router.navigate(['/admin/orders']);
            } else {
              this.router.navigate(['/']);
            }
          }
        },
        (error) => {
          this.loginError.next(error.error);
          this.authStatusListener.next(false);
          this.isAuthenticated = false;
        }
      );
  }

  getUser(id: string) {
    return this.http.get<Auth>(`${this.ROOT_URL}/${id}`);
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null!;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null!;
    this.cartService.deleteCartData();
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    const expiresIn =
      authInformation?.expirationDate.getTime()! - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation?.token!;
      this.isAuthenticated = true;
      this.userId = authInformation?.userId!;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }

  duplicateEmailChecker(email: string) {
    return this.http.post(`${this.ROOT_URL}/email`, { email: email });
  }
}
