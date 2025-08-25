import { Component, Input } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: false
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  addToCart(): void {
    console.log('Adding product to cart:', this.product);
    if (this.authService.isAuthenticated()){
    this.cartService.addToCart(this.product).subscribe({
      next: () => {
        this.snackBar.open('Product added to cart', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to add product to cart', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        console.error('Error adding to cart:', error);
      }
    });}
    else {
      this.snackBar.open('Please log in to add products to the cart', 'close',  {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }

  getRatingStars(rating: number): string[] {
    if (!rating) return Array(5).fill('star_border');
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    if (hasHalfStar) {
      stars.push('star_half');
    }
    while (stars.length < 5) {
      stars.push('star_border');
    }

    return stars;
  }
} 