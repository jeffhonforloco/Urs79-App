import { firebase } from '@nativescript/firebase-core';

export function initializeFirebase() {
  firebase().initializeApp();
}