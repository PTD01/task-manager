import { provideRouter } from '@angular/router';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { appRouter } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    appRouter,
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(FormsModule), // Required for ngModel to work
  ],
};
