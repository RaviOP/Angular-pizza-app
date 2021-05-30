import { Component, OnInit } from '@angular/core';
import { Order } from '../order.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  orders: Order[] = []
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(
      (recievedOrders: Order[]) => {
        recievedOrders.forEach((order) => {
          this.orders.push(order)
        })
      },
      (error) => {
        console.log(error)
      }
    )
  }

}
