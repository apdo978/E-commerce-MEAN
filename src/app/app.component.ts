import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { CoreModule } from './core/core.module';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    CoreModule, 
    MatIconModule,
    MatBadgeModule
  ]
})
export class AppComponent {
  title = 'Ecommerce';
  isLoggedIn = false;
  username: string = '';
  imgSrc: string ='';
  cartItemsCount: number = 0;
  isMenuOpen = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private cartService: CartService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.username = user.name || user.email || 'User';
        // this.imgSrc = user.avatar || ''; // Default image if none provided
      }
    });

    this.cartService.getCartItems().subscribe(items => {
      this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMenuOpen = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle?.contains(event.target as Node) && 
        !navLinks?.contains(event.target as Node)) {
      this.isMenuOpen = false;
    }
  }
}
