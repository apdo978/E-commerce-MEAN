import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { User, UserType } from '../../../../core/models/user.model';
import { ProfileService } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  loading = false;
  isEditing = false;
  hidePassword = true;
  hideNewPassword = true;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      newPassword: ['', [Validators.minLength(6)]]
    }, {
      validators: this.passwordValidator
    });
  }

  ngOnInit(): void {
   
    
    this.loading = true;
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.profileForm.patchValue({
          name: user.name || '',
          email: user.email || '', 
          password: '',
          newPassword: ''
        });
      }
      this.loading = false;
    });
    
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      // Reset form when canceling edit
      this.profileForm.patchValue({
        name: this.user.name || '',
        email: this.user.email || '',
         password: '',
          newPassword: ''
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      if (this.profileForm.errors?.['passwordRequired']) {
        this.snackBar.open('Current password is required to make changes', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      } else {
        this.snackBar.open('Please fill in all required fields correctly', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
      return;
    }

    const changes = {
      name: this.profileForm.get('name')?.value,
      email: this.profileForm.get('email')?.value,
      password: this.profileForm.get('password')?.value,
      newPassword: this.profileForm.get('newPassword')?.value
    };

    this.loading = true;
    this.profileService.updateProfile(changes).subscribe({
      next: (response) => {
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.isEditing = false;
        this.loading = false;
        // Update user data in auth service
        if (response.data?.user&&this.user) {
          this.user.name = response.data.user.name || this.user.name;
          this.user.email = response.data.user.email || this.user.email;
          console.log(response);
          
          this.authService.updateUserData(response);
        }
      },
      error: (error) => {
        this.snackBar.open(error.error?.data.message || 'Failed to update profile', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility(field: 'password' | 'newPassword'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideNewPassword = !this.hideNewPassword;
    }
  }

  private passwordValidator(group: AbstractControl): ValidationErrors | null {
    const currentPassword = group.get('password')?.value;
    const newPassword = group.get('newPassword')?.value;
    const name = group.get('name')?.value;
    const email = group.get('email')?.value;
    
    // Get the original values from the user object
    const originalName = (group as FormGroup)?.parent?.get('user')?.value?.name;
    const originalEmail = (group as FormGroup)?.parent?.get('user')?.value?.email;

    // Check if any field has changed
    const hasChanges = name !== originalName || 
                      email !== originalEmail || 
                      newPassword;

    // Require password if there are any changes
    if (hasChanges && !currentPassword) {
      group.get('password')?.setErrors({ required: true });
      return { passwordRequired: true };
    }

    return null;
  }

  getUserTypeName(userType: string | UserType | undefined): string {
    if (!userType) return 'Standard';
    if (typeof userType === 'string') return 'Standard';
    return userType.name || 'Standard';
  }
}