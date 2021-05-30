import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "../admin.guard";
import { AuthGuard } from "../auth/auth.guard";
import { SharedModule } from "../shared.module";
import { OrdersAllComponent } from "./orders-all/orders-all.component";


const routes: Routes = [
    {
        path: 'orders',
        component: OrdersAllComponent,
        canActivate: [AuthGuard, AdminGuard]
    }
]
@NgModule({
    declarations: [
        OrdersAllComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class AdminModule{

}