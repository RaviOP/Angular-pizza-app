import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../customer/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  userIsAuthenticated: boolean = false
  private authListenerSubs!: Subscription
  userIsAdmin: boolean = false
  totalQuantity!: Number;
  totalQuantityListener!: Subscription

  constructor(private authService: AuthService, private cartService: CartService) {
    this.totalQuantityListener = this.cartService.getTotalQuantityListener().subscribe(
      (quantity: number) => {
        this.totalQuantity = quantity
      }
    )
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated
      }
    )
    if (this.userIsAuthenticated) {
      const id = this.authService.getUserId()
      this.authService.getUser(id).subscribe(
        (user) => {
          if (user.role === 'admin') {
            this.userIsAdmin = true
          }
        }
      )
    }
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
    this.totalQuantityListener.unsubscribe()
  }

  logout() {
    this.authService.logout()
  }

}
