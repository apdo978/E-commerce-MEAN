import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuth();
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  handleAuthCallback(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticated.next(true);
    // this.http.get(`${this.apiUrl}/auth/verify`)
   
  }

  private checkAuth(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated.next(!!token);
  }
}