import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject(0);
  totalQuantity: Subject<number> = new BehaviorSubject(0);

  storage: Storage = localStorage;

  constructor() {

    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotal();
    }
  }

  addToCart(cartItem: CartItem) {

    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(item => item.id == cartItem.id);
    }

    console.log(existingCartItem);


    if (existingCartItem == undefined) {
      this.cartItems.push(cartItem);
    } else {
      existingCartItem.quantity++;
    }
    this.computeCartTotal();
  }

  decrementQuantity(itemCart: CartItem) {
    itemCart.quantity--;

    if (itemCart.quantity === 0)
      this.remove(itemCart);
    else
      this.computeCartTotal();
  }

  remove(itemCart: CartItem) {
    const itemIndex = this.cartItems.findIndex(item => item.id == itemCart.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotal();
    }
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  computeCartTotal() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    this.cartItems.forEach(item => {
      totalPriceValue += item.quantity * item.unitPrice;
      totalQuantityValue += item.quantity;
      console.log(item);

    })

    //pusblish the new values to the subscribers (observers)

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.persistCartItems();
  }
}
