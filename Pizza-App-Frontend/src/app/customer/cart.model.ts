import { Menu } from "../home/menu/menu.model";

export interface Cart {
    items: {
        [key: string]: {
            item: Menu
            quantity: number
        }
    },
    totalQuantity: number,
    totalPrice: number,
}

