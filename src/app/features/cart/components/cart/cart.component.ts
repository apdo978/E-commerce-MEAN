import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCartItems(): void {
    this.isLoading = true;
    const cartSub = this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        this.isLoading = false;
        this.showError('Error loading cart items');
      }
    });
    this.subscriptions.push(cartSub);

    const priceSub = this.cartService.getTotalPrice().subscribe({
      next: (price) => {
        this.totalPrice = price;
      },
      error: (error) => {
        console.error('Error loading total price:', error);
        this.showError('Error loading total price');
      }
    });
    this.subscriptions.push(priceSub);
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(item.id);
      return;
    }
    
    this.isLoading = true;
    this.cartService.updateQuantity(item.id, quantity).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.isLoading = false;
        this.showError('Error updating quantity');
      }
    });
  }

  removeItem(productId: string): void {
    this.isLoading = true;
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.isLoading = false;
        this.showError('Error removing item');
      }
    });
  }

  clearCart(): void {
    this.isLoading = true;
    this.cartService.clearCart().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.isLoading = false;
        this.showError('Error clearing cart');
      }
    });
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.showError('Your cart is empty');
      return;
    }

    this.isLoading = true;
    const orderData = {
      items: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    this.cartService.checkout(orderData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccess('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Error during checkout:', error);
        this.isLoading = false;
        this.showError('Error processing your order');
      }
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
} 