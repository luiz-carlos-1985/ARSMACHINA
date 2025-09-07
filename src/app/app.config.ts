import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import { Amplify } from 'aws-amplify';

import { routes } from './app.routes';

// Register locales
registerLocaleData(localePt);
registerLocaleData(localeEn);

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_EXAMPLE123',
      userPoolClientId: 'EXAMPLE_CLIENT_ID',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
      },
    }
  }
});

// TODO: Replace the above configuration with your actual AWS Cognito User Pool details
// You can find these values in your AWS Cognito console or in amplify_outputs.json after running 'amplify push'
// Example:
// Amplify.configure({
//   Auth: {
//     Cognito: {
//       userPoolId: 'us-east-1_YourActualUserPoolId',
//       userPoolClientId: 'YourActualUserPoolClientId',
//       signUpVerificationMethod: 'code',
//       loginWith: {
//         email: true,
//       },
//     }
//   }
// });

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'pt-BR' } // Default to Portuguese
  ]
};
