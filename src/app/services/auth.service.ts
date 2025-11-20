import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  get currentUser$(): Observable<User | null> {
    return authState(this.auth);
  }

  async signup(email: string, password: string): Promise<any> {
    try {
      if (!this.auth) {
        console.error('Auth is null!');
        throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
      }
      
      console.log('Auth instance:', this.auth);
      console.log('Auth app:', this.auth.app);
      console.log('Auth config:', {
        apiKey: this.auth.config?.apiKey?.substring(0, 10) + '...',
        authDomain: this.auth.config?.authDomain
      });
      console.log('Attempting to create user with email:', email);
      
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('User created successfully:', result.user.uid);
      return result;
    } catch (error: any) {
      console.error('Auth signup error:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      // Check if it's a network error and provide more specific guidance
      if (error?.code === 'auth/network-request-failed') {
        console.error('=== NETWORK ERROR TROUBLESHOOTING ===');
        console.error('1. Check if Email/Password is enabled in Firebase Console');
        console.error('2. Check Firebase Console → Authentication → Sign-in method');
        console.error('3. Ensure the Email/Password provider is ENABLED');
        console.error('4. Check browser console Network tab for failed requests');
      }
      
      const errorMessage = this.handleAuthError(error);
      throw new Error(errorMessage);
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  private handleAuthError(error: any): string {
    let errorMessage = 'An unknown error occurred';
    
    switch (error.code) {
      case 'auth/network-request-failed':
        errorMessage = 'Network error: Cannot connect to Firebase. Please check your internet connection and ensure Firebase Email/Password authentication is enabled in your Firebase Console.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address. Please check your email and try again.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled. Please enable Email/Password authentication in Firebase Console → Authentication → Sign-in method.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email. Please sign up first.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password. Please check your credentials.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      default:
        errorMessage = error.message || errorMessage;
    }
    
    return errorMessage;
  }
}

