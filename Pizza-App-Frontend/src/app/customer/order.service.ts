import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AdminOrder } from '../admin/admin-order.model';
import { Cart } from './cart.model';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  order!: Order;
  readonly ROOT_URL;

  constructor(private http: HttpClient, private router: Router) {
    // this.ROOT_URL = `https://ravi-pizza-api.herokuapp.com/api/orders`
    // this.ROOT_URL = 'http://localhost:3000/api/orders';
    this.ROOT_URL = '/api/orders';
  }

  getOrder(id: string) {
    return this.http.get<Order>(`${this.ROOT_URL}/${id}`);
  }

  getOrders() {
    return this.http.get<Order[]>(this.ROOT_URL);
  }

  postOrders(order: { items: Cart; phone: number; address: string }) {
    this.http.post<Order>(this.ROOT_URL, order).subscribe((order) => {
      this.router.navigate(['/customer/order/', order._id]);
    });
  }

  getOrdersForAdmin() {
    return this.http.get<AdminOrder[]>(
      `http://localhost:3000/api/admin/orders`
    );
  }

  updateOrderStatus(body: { id: string; status: string }) {
    return this.http.post<AdminOrder>(`${this.ROOT_URL}/status`, body);
  }
}
