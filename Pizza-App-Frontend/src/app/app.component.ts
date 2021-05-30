import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { CartService } from './customer/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private authService: AuthService, private cartService: CartService) {}
  
  ngOnInit() {
    this.authService.autoAuthUser()
    this.cartService.getCartData()
  }
}
