import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { OrderService } from '../../../../core/services/orders.services';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../core/models/user.model';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import emailjs from '@emailjs/browser';
import { MatSnackBar } from '@angular/material/snack-bar';

interface OrderProduct {
  id: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
  url?: string;
}

interface Order {
  _id: string;
  id: string;
  name: string;
  email: string;
  products: OrderProduct[];
  total: number;
  isOrder: boolean;
  createdAt: string;
  status: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  loadingUsers = false;
  adminForm: FormGroup;
  adminInsertSuccess: string | null = null;
  adminInsertError: string | null = null;
  orders: Order[] = [];
  loadingOrders = false;
  orderError: string | null = null;
  displayedUserColumns = ['name', 'email', 'userType'];
  displayedOrderColumns = ['name', 'email', 'products', 'total', 'status', 'createdAt', 'actions'];
  private isSending = false;
  private readonly SERVICE_ID = "service_333lljk";
  private readonly TEMPLATE_ID = "template_yqm1i0c";
  private readonly PUBLIC_KEY = "yeCDBUzX0WeaHi2nD";

  constructor(
    private authService: AuthService,
    private OrderService: OrderService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if user is admin before loading data
    if (!this.authService.isAdmin()) {
      console.log('Not an admin, redirecting to home');
      this.router.navigate(['/']);
      return;
    }

    console.log('Loading admin dashboard data...');
    this.getAllUsers();
    this.getOrders();
  }

  getAllUsers(): void {
    this.loadingUsers = true;
    this.authService.getAllUsers().subscribe({
      next: (users: User[]) => {
        console.log('Users loaded:', users);
        this.users = users;
        this.loadingUsers = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.loadingUsers = false;
      }
    });
  }

  insertAdmin(): void {
    if (this.adminForm.invalid) return;
    
    const adminData = {
      ...this.adminForm.value,
      userType: '67794d965076e772f1f5c001' // Admin userType ID
    };
    
    this.adminInsertSuccess = null;
    this.adminInsertError = null;
    
    this.http.post(`${environment.apiUrl}/user-types`, adminData).subscribe({
      next: (response) => {
        console.log('Admin inserted successfully:', response);
        this.adminInsertSuccess = 'Admin inserted successfully!';
        this.adminForm.reset();
        this.getAllUsers();
      },
      error: (err) => {
        console.error('Error inserting admin:', err);
        this.adminInsertError = err.error?.message || 'Failed to insert admin.';
      }
    });
  }

  getOrders(): void {
    this.loadingOrders = true;
    this.orderError = null;
    
    this.http.get<any>(`${environment.apiUrl}/admins/customersOrders`).subscribe({
      next: (response) => {
        console.log('Raw orders response:', response);
        // Handle different possible response structures
        if (Array.isArray(response)) {
          this.orders = response;
        } else if (response && response.data) {
          this.orders = Array.isArray(response.data) ? response.data : response.data.data || [];
        } else {
          this.orders = [];
          this.orderError = 'Invalid response format from server';
        }
        this.loadingOrders = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.orderError = err.error?.message || 'Failed to load orders.';
        this.loadingOrders = false;
        this.orders = [];
      }
    });
  }

  updateOrderStatus(orderId: string, status: string): void {
    console.log(`Updating order ${orderId} status to ${status}`);

    
    this.OrderService.updateOrderStatus(orderId, status).subscribe({
      next: (response) => {
        console.log('Order status updated successfully:', response);
        // this.getOrders(); // Refresh orders after update
      },
      error: (err) => {
        console.error('Error updating order status:', err);
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  calculateOrderTotal(products: OrderProduct[]): number {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  }

  getImageUrl(product: OrderProduct): string {
    // Use the direct URL from the response
    return product.imageUrl || product.url || 'assets/images/placeholder.png';
  }
  print(order: any): void {
    const printContent = `
      <html>
        <head>
          <title>Order #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .order-info { margin-bottom: 20px; }
            .products { margin-bottom: 30px; }
            .product { margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; text-align: right; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Order Details</h1>
            <p>Order #${order.id}</p>
          </div>
          
          <div class="order-info">
            <p><strong>Customer Name:</strong> ${order.name}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Order Date:</strong> ${this.formatDate(order.createdAt)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <div class="products">
            <h2>Products</h2>
            ${order.products.map((product: { title: any; quantity: number; price: number; }) => `
              <div class="product">
                <p><strong>${product.title}</strong></p>
                <p>Quantity: ${product.quantity} × $${product.price.toFixed(2)}</p>
                <p>Subtotal: $${(product.quantity * product.price).toFixed(2)}</p>
              </div>
            `).join('')}
          </div>

          <div class="total">
            <h3>Total: $${this.calculateOrderTotal(order.products).toFixed(2)}</h3>
          </div>

          <div class="footer">
            <p>Thank you for your order!</p>
            <p>Printed on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  }
  emailCustomer(order:Order,email: string) {
    if (this.isSending) return;
console.log(order);

    const templateParams = {
      to_email: email,
      // Add any additional template parameters here
      order_id: order.id,
      order_name: order.name,
      order_email: order.email,
      order_total: this.calculateOrderTotal(order.products).toFixed(2),
      order_status: order.status,
      order_created_at: this.formatDate(order.createdAt),

      from_name: "E-commerce Team",
    };
console.log('Sending email with params:', templateParams);

    this.isSending = true;

    emailjs
      .send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams,
        this.PUBLIC_KEY
      )
      .then((response) => {
        console.log('Email sent successfully:', response);
        
        this.snackBar.open('Email sent successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      })
      .catch((error) => {
        console.error('Email error:', error);
        this.snackBar.open('Failed to send email. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      })
      .finally(() => {
        this.isSending = false;
      });
  }
}