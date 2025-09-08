import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

import { routes } from './app.routes';

// Register locales
registerLocaleData(localePt);
registerLocaleData(localeEn);

// Configure Amplify with outputs
Amplify.configure(outputs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'pt-BR' } // Default to Portuguese
  ]
};
