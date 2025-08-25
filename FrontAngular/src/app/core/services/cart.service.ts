import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, map, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

interface ApiResponse<T> {
  status: string;
  data: {
    data: T;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartTotalSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    this.http.get<ApiResponse<CartItem[]>>(`${environment.apiUrl}/cart`).subscribe({
      next: (response) => {
        const items = response.data.data || [];
        this.cartItemsSubject.next(items);
        this.updateTotal(items);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.cartItemsSubject.next([]);
        this.cartTotalSubject.next(0);
      }
    });
  }

  private updateTotal(items: CartItem[]): void {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cartTotalSubject.next(total);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(product: Product): Observable<CartItem[]> {
    const productId = product._id || product.id;
    
    if (!productId) {
      console.error('Cannot add product without ID:', product);
      return of([]);
    }

    return this.http.post<ApiResponse<CartItem[]>>(
      `${environment.apiUrl}/cart`, 
      { productId, quantity: 1 }
    ).pipe(
      tap(response => {
        const items = response.data.data || [];
        this.cartItemsSubject.next(items);
        this.updateTotal(items);
      }),
      map(response => response.data.data || []),
      catchError(error => {
        console.error('Error in cart request:', error);
        return of([]);
      })
    );
  }

  removeFromCart(productId: string): Observable<CartItem[]> {
    return this.http.delete<ApiResponse<CartItem[]>>(`${environment.apiUrl}/cart/${productId}`).pipe(
      tap(response => {
        const items = response.data.data || [];
        this.cartItemsSubject.next(items);
        this.updateTotal(items);
      }),
        map(response => response.data.data || [])
      );
  }

  updateQuantity(productId: string, quantity: number): Observable<CartItem[]> {
    return this.http.patch<ApiResponse<CartItem[]>>(
      `${environment.apiUrl}/cart/${productId}`, 
      { quantity }
    ).pipe(
      tap(response => {
        const items = response.data.data || [];
        this.cartItemsSubject.next(items);
        this.updateTotal(items);
      }),
      map(response => response.data.data || [])
    );
  }

  clearCart(): Observable<CartItem[]> {
    return this.http.delete<ApiResponse<CartItem[]>>(`${environment.apiUrl}/cart`).pipe(
      tap(response => {
        this.cartItemsSubject.next([]);
        this.cartTotalSubject.next(0);
      }),
        map(response => response.data.data || [])
      );
  }

  getTotalPrice(): Observable<number> {
    return this.cartTotalSubject.asObservable();
  }

  checkout(orderData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/products/order`, orderData).pipe(
      tap(response => {
        // Clear cart after successful checkout
        this.cartItemsSubject.next([]);
        this.cartTotalSubject.next(0);
      }),
      map(response => response.data.data)
      );
  }
} 