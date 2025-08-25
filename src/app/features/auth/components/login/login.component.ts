import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { OAuthService } from '../../../../core/services/oauth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ]),
    trigger('shake', [
      state('invalid', style({
        transform: 'translateX(0)'
      })),
      transition('* => invalid', [
        animate('100ms', style({ transform: 'translateX(-10px)' })),
        animate('100ms', style({ transform: 'translateX(10px)' })),
        animate('100ms', style({ transform: 'translateX(-10px)' })),
        animate('100ms', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit  {
  loginForm: FormGroup;
  loading = false;
  formState = '';
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private oauthService: OAuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    if (params['token']) {
  this.loading = true;
    }
    this.token = params['token'];
if(this.token){
      this.authService.OauthLogin(this.token);
    this.loading = false;
    this.showSuccessAnimation();
    this.snackBar.open('Login successful! Welcome ! 🎉', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000);
   
 } });
}
    

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.loading = false;
          this.showSuccessAnimation();
          this.snackBar.open('Login successful! Welcome ! 🎉', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          this.showErrorAnimation();
          this.snackBar.open(error.error?.message || 'Invalid email or password', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    } else {
      this.formState = 'invalid';
      setTimeout(() => this.formState = '', 500);
    }
  }

  private showSuccessAnimation(): void {
    this.formState = 'success';
  }

  private showErrorAnimation(): void {
    this.formState = 'invalid';
    setTimeout(() => this.formState = '', 500);
  }

  loginWithGoogle(): void {
    this.oauthService.loginWithGoogle();
  }
}