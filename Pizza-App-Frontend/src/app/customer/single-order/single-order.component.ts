import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Socket } from 'ngx-socket-io';
import { Order } from '../order.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.css'],
  providers: [DatePipe]
})
export class SingleOrderComponent implements OnInit {
  id!: string | null;

  constructor(private route: ActivatedRoute,
    private orderService: OrderService,
    private dp: DatePipe, private socket: Socket,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    if (this.id) {
      this.orderService.getOrder(this.id).subscribe(
        (order: Order) => {
          this.statusUpdate(order)
          this.socket.emit('join', `Order_${order._id}`)
          this.socket.on('OrderUpdated', (data: { id: string, status: string }) => {
            const updatedOrder = { ...order }
            let currenTime = new Date().getTime()
            updatedOrder.updatedAt = '' + currenTime
            updatedOrder.status = data.status
            this.notifierService.notify("success", "Order Status Updated")
            setTimeout(() => {
              this.notifierService.hideNewest()
            }, 1000)
            this.statusUpdate(updatedOrder)
          })
        }
      )
    }
  }

  statusUpdate(order: Order) {
    let statuses = document.querySelectorAll('.status_line')
    let time = document.createElement('small')

    statuses.forEach((status) => {
      status.classList.remove('step-completed')
      status.classList.remove('current')
    })

    let stepCompleted = true
    statuses.forEach((status) => {

      if (status instanceof HTMLElement) {
        let dataProperty = status.dataset.status

        if (stepCompleted) {
          status.classList.add('step-completed')
        }

        if (dataProperty === order.status) {
          stepCompleted = false
          time.innerText = this.dp.transform(order.updatedAt, 'mediumTime')!
          status.appendChild(time)
          if (status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
          }
        }
      }
    })
  }

}

