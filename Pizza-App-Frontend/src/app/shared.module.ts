import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NotifierModule } from "angular-notifier";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NotifierModule.withConfig({
            position: {

                horizontal: {
                    position: 'right',
                    distance: 10

                },

                vertical: {
                    position: 'top',
                    distance: 30,
                    gap: 10
                }
            }
        })
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        NotifierModule
    ]
})
export class SharedModule{ }