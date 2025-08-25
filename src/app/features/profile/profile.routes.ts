import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

export const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }
]; 