import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/products/lastOrders`;
  private orderUrl = `${environment.apiUrl}/products/order`;
  constructor(private http: HttpClient) { }

  getLastOrders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(`${this.orderUrl}/${orderId}`, { status });
  }
}