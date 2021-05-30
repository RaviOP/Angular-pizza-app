import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared.module";

import { MenuEditComponent } from "./menu-edit/menu-edit.component";
import { MenuRoutingModule } from "./menu-routing.module";
import { MenuComponent } from "./menu.component";
import { NewMenuComponent } from "./new-menu/new-menu.component";

@NgModule({
    declarations: [
        MenuEditComponent,
        NewMenuComponent,
        MenuComponent
    ],
    imports: [
        MenuRoutingModule,
        SharedModule
    ],
    exports: [
        MenuComponent
    ]
})
export class MenuModule{ }