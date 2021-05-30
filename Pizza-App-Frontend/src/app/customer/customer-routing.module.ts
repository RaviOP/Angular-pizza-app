import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { AllOrdersComponent } from "./all-orders/all-orders.component";
import { CartComponent } from "./cart/cart.component";
import { OrdersComponent } from "./orders/orders.component";
import { SingleOrderComponent } from "./single-order/single-order.component";

const routes: Routes = [
    {
        path: 'cart',
        component: CartComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'order-confirmation',
        component: OrdersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'orders',
        component: AllOrdersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'order/:id',
        component: SingleOrderComponent,
        canActivate: [AuthGuard]
    },
]
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CustomerRoutingModule{ }