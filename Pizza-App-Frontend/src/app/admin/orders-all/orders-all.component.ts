import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Socket } from 'ngx-socket-io';
import { OrderService } from 'src/app/customer/order.service';
import { AdminOrder } from '../admin-order.model';

@Component({
  selector: 'app-orders-all',
  templateUrl: './orders-all.component.html',
  styleUrls: ['./orders-all.component.css']
})
export class OrdersAllComponent implements OnInit {
  orders: AdminOrder[] = []
  constructor(private orderService: OrderService, private notifierService: NotifierService,
  private socket: Socket) { }

  ngOnInit(): void {
    this.orderService.getOrdersForAdmin().subscribe(
      (orders: AdminOrder[]) => {
        orders.forEach((order) => {
          this.orders.push(order)
        })
      }
    )
    this.socket.emit('join', 'adminRoom')
    this.socket.on('Order-Placed', (data: AdminOrder) => {
      this.orders.unshift(data)
      this.notifierService.notify("success", "New Order")
      setTimeout(() => {
        this.notifierService.hideNewest()
      }, 1000)
    })
  }

  selectOptionChanged(event: any, id: string) {
    let body = {
      status: event.target.value,
      id: id
    }
    this.orderService.updateOrderStatus(body).subscribe(
      (order: AdminOrder) => {
        if (order.status === 'Completed') {
          const updatedOrders = this.orders.filter(order => order._id !== order._id)
          this.orders = updatedOrders
        }
        this.notifierService.notify("success", "Order Status Updated SuccessFully")
        setTimeout(() => {
          this.notifierService.hideNewest()
        }, 1000)
     }
   )
  }

}
