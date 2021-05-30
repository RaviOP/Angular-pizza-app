import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Cart } from '../cart.model';
import { CartService } from '../cart.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderForm!: FormGroup
  cartItems!: Cart;

  constructor(private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
  private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      'phone': new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      'address': new FormControl(null,[Validators.required])
    })
    this.cartItems = this.cartService.getCartData()
  }

  onSubmit() {
    if (!this.orderForm.valid) {
      return
    }
    const order = {
      items: this.cartItems,
      phone: this.orderForm.value.phone,
      address: this.orderForm.value.address
    }
    this.orderService.postOrders(order)
    this.cartService.deleteCartData()
    this.notifierService.notify("success", "Ordered Placed SuccessFully")
    setTimeout(() => {
      this.notifierService.hideNewest()
    }, 1000)
  }
}
