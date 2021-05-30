import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Menu } from "../home/menu/menu.model";
import { Cart } from "./cart.model";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cart!: Cart
    constructor() { }
    private totalQuantity = new Subject<number>()

    addToCart(menuItem: Menu) {
        let cart = this.getCartData()
        if (!cart) {
            cart = {
                items: {},
                totalPrice: 0,
                totalQuantity: 0
            }
        }
        if (!cart.items[menuItem._id]) {
            cart.items[menuItem._id] = {
                item: menuItem,
                quantity: 1
            }
            cart.totalQuantity = cart.totalQuantity + 1
            cart.totalPrice = cart.totalPrice + menuItem.price
        } else {
            cart.items[menuItem._id].quantity = cart.items[menuItem._id].quantity + 1
            cart.totalQuantity = cart.totalQuantity + 1
            cart.totalPrice = cart.totalPrice + menuItem.price
        }
        this.totalQuantity.next(cart.totalQuantity)
        this.saveCartData(cart)
    }

    getTotalQuantityListener() {
        return this.totalQuantity.asObservable()
    }

    saveCartData(cart: Cart) {
        let items = JSON.stringify(cart)
        localStorage.setItem("items", items)
    }

    getCartData(): Cart {
        const retrievedItems = localStorage.getItem("items")
        if (retrievedItems) {
            let cart = JSON.parse(retrievedItems!)
            this.cart = cart
            this.totalQuantity.next(cart.totalQuantity)
            return cart
        } else {
            return null!
        }
    }

    deleteCartData() {
        localStorage.removeItem("items")
        this.totalQuantity.next()
    }
}