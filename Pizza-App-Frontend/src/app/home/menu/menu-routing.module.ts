import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "src/app/admin.guard";
import { AuthGuard } from "src/app/auth/auth.guard";
import { MenuEditComponent } from "./menu-edit/menu-edit.component";
import { NewMenuComponent } from "./new-menu/new-menu.component";

const routes: Routes = [
    {
        path: 'new-item',
        component: NewMenuComponent,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'edit-item/:id',
        component: MenuEditComponent,
        canActivate: [AuthGuard, AdminGuard]
    },
]
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class MenuRoutingModule{ }