import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => {
      try {
        // Try to get existing app first
        return getApp();
      } catch {
        // If no app exists, initialize a new one
        console.log('Initializing Firebase with config:', environment.firebase);
        const app = initializeApp(environment.firebase);
        console.log('Firebase app initialized:', app);
        return app;
      }
    }),
    provideAuth(() => {
      const app = getApp();
      const auth = getAuth(app);
      console.log('Firebase Auth initialized:', auth);
      return auth;
    })
  ]
};