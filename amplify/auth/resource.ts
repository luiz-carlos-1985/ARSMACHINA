import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
        clientSecret: 'GOCSPX-abcdefghijklmnopqrstuvwxyz123456',
      },
      facebook: {
        clientId: '1234567890123456',
        clientSecret: 'abcdefghijklmnopqrstuvwxyz123456',
      },
      callbackUrls: ['http://localhost:4200/'],
      logoutUrls: ['http://localhost:4200/'],
    },
  },
});
