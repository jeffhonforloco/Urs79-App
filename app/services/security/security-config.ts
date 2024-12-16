import { firebase } from '@nativescript/firebase-core';

export const securityConfig = {
  apiKeys: {
    firebase: process.env.FIREBASE_API_KEY,
    googleMaps: process.env.GOOGLE_MAPS_API_KEY
  },
  encryption: {
    algorithm: 'AES-256-GCM',
    keyLength: 256,
    saltRounds: 12
  },
  auth: {
    tokenExpiration: '24h',
    refreshTokenExpiration: '7d',
    maxLoginAttempts: 5,
    lockoutDuration: 15 // minutes
  }
};

export const initializeSecurity = () => {
  // Configure Firebase Security Rules
  firebase().firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    persistence: true,
    ssl: true
  });

  // Enable offline persistence
  firebase().firestore().enablePersistence({
    synchronizeTabs: true
  }).catch(err => {
    console.error('Persistence error:', err);
  });
};