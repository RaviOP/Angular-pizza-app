import { Cart } from "../customer/cart.model";

export interface AdminOrder {
    _id: string,
    customerId: {
        email: string,
        name: string,
        role: string,
        _id: string
    },
    items: Cart,
    phone: number,
    address: string,
    paymentType: string,
    status: string,
    createdAt: string,
    updatedAt: string
}