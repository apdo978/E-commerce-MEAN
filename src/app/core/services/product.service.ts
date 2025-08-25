import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

interface ApiResponse<T> {
  status: string;
  data: {
    data: T;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${environment.apiUrl}/products/getAllProducts`)
      .pipe(
        map(response => response.data.data)
      );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${environment.apiUrl}/products/${id}`)
      .pipe(
        map(response => response.data.data)
      );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(`${environment.apiUrl}/products/insertProduct`, product)
      .pipe(
        map(response => response.data.data)
      );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.patch<ApiResponse<Product>>(`${environment.apiUrl}/products/${id}`, product)
      .pipe(
        map(response => response.data.data)
      );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/products/${id}`)
      .pipe(
        map(response => response.data.data)
      );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${environment.apiUrl}/products/category/${category}`)
      .pipe(
        map(response => response.data.data)
      );
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/products/order`, orderData)
      .pipe(
        map(response => response.data.data)
      );
  }

  getLastOrders(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrl}/products/lastOrders`)
      .pipe(
        map(response => response.data.data)
      );
  }
} 