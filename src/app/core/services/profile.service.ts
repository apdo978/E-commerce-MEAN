import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  password?: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  updateProfile(data: ProfileUpdateData): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/users/profile`, data);
  }
}