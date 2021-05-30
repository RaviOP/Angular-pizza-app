import { Cart } from "./cart.model";

export interface Order {
    _id: string,
    customerId: string,
    items: Cart,
    phone: number,
    address: string,
    paymentType: string,
    status: string,
    createdAt: string,
    updatedAt: string
}