import { NgModule } from "@angular/core";
import { SharedModule } from "../shared.module";
import { AllOrdersComponent } from "./all-orders/all-orders.component";
import { CartComponent } from "./cart/cart.component";
import { CustomerRoutingModule } from "./customer-routing.module";
import { OrdersComponent } from "./orders/orders.component";
import { SingleOrderComponent } from "./single-order/single-order.component";

@NgModule({
    declarations: [
        CartComponent,
        OrdersComponent,
        SingleOrderComponent,
        AllOrdersComponent
    ],
    imports: [
        CustomerRoutingModule,
        SharedModule
    ]
})
export class CustomerModule{}