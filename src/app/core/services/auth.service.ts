import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

interface ApiResponse<T> {
  status: string;
  data: {
    data: T;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      const user = this.decodeToken(token);
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<ApiResponse<string>>(`${environment.apiUrl}/users/login`, { email, password })
      .pipe(
        tap(response => {
          const token = response.data.data;
          if (token) {
            localStorage.setItem(this.TOKEN_KEY, token);
            const user = this.decodeToken(token);
            this.currentUserSubject.next(user);
          }
        }),
        map(response => {
          return { token: response.data.data };
        })
      );
  }

  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/users/InsertUserS`, userData)
      .pipe(
        map(response => response.data.data)
      );
  }

  getAllUsers(): Observable<User[]> {
    const currentUser = this.currentUserSubject.value;
    const userTypeString = typeof currentUser?.userType === 'object' 
      ? currentUser?.userType?._id 
      : currentUser?.userType?.toString() || '';
      
    const params = { ObjectId: userTypeString };
    
    return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/users/GetAllUserS`, { params }).pipe(
      tap(response => console.log('API Response:', response)),
      map(response => response.data.data)
    );
  }

  editUser( userData: Partial<User>): Observable<User> {
   
    
    return this.http.patch<ApiResponse<User>>(`${environment.apiUrl}/users/EditUsers`, { ...userData })
      .pipe(
        map(response => response.data.data)
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private decodeToken(token: string): User {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decodedToken = JSON.parse(jsonPayload);
      
 

      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return {} as User;
    }
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    
    if (!user) {
      return false;
    }
    
    if (!user.userType) {
      return false;
    }
    if (user.userType) {
      return true;
    }else{
      return false;
    }

  }

  updateUserData(response: any) {
    if (response.data?.token) {
  
   
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Store new token
        localStorage.setItem(this.TOKEN_KEY, response.data.token);
        
        // Decode and update user from new token
        const user = this.decodeToken(response.data.token);
        this.currentUserSubject.next(user);
    }
}
OauthLogin(token: string): void {
  if (token) {
    localStorage.setItem(this.TOKEN_KEY, token);
    const user = this.decodeToken(token);
     this.currentUserSubject.next(user);
  }
}
}