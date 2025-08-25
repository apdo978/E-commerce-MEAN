import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.quantityChange.emit(this.item.quantity - 1);
    }
  }

  increaseQuantity(): void {
    this.quantityChange.emit(this.item.quantity + 1);
  }

  removeItem(): void {
    this.remove.emit();
  }
} 