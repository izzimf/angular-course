import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      console.log('Starting signup process...');
      
      const result = await this.authService.signup(this.email, this.password);
      console.log('Signup successful, navigating to profile...');
      this.isLoading = false;
      await this.router.navigate(['/profile']);
    } catch (error: any) {
      console.error('Signup component error:', error);
      this.isLoading = false;
      if (typeof error === 'string') {
        this.error = error;
      } else if (error?.message) {
        this.error = error.message;
      } else if (error?.code) {
       
        this.error = error.message || 'Signup failed. Please try again.';
      } else {
        this.error = 'Signup failed. Please try again.';
      }
    }
  }
}

