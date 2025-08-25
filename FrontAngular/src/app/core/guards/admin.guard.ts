import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AdminGuard: Starting guard check...');
    console.log('AdminGuard: Current URL:', state.url);
    
    // First check if there's a token
    const token = this.authService.getToken();
    if (!token) {
      console.log('AdminGuard: No token found, redirecting to home');
      this.router.navigate(['/']);
      return false;
    }
    console.log('AdminGuard: Token found');

    // Then check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.log('AdminGuard: User not authenticated, redirecting to home');
      this.router.navigate(['/']);
      return false;
    }
    console.log('AdminGuard: User is authenticated');

    // Finally check if user is admin
    const isAdmin = this.authService.isAdmin();
    console.log('AdminGuard: Is user admin?', isAdmin);

    if (!isAdmin) {
      console.log('AdminGuard: User is not admin, redirecting to home');
      this.router.navigate(['/']);
      return false;
    }

    console.log('AdminGuard: Access granted to admin dashboard');
    return true;
  }
} 