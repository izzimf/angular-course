import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { itemsReducer } from './items/state/items.reducer';
import { ItemsEffects } from './items/state/items.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => {
      try {
        
        return getApp();
      } catch {
        
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
    }),
    provideStore({ items: itemsReducer }),
    provideEffects([ItemsEffects]),
    provideStoreDevtools()
  ]
};