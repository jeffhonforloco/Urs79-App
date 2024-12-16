import { firebase } from '@nativescript/firebase-core';
import { logger } from '../utils/logger';

export class ErrorTracker {
  static trackError(error: Error, context: any = {}): void {
    // Log to local logger
    logger.error('Application error:', {
      message: error.message,
      stack: error.stack,
      context
    });

    // Report to Firebase Crashlytics
    firebase().crashlytics().recordError(error);

    // Log to Analytics
    firebase().analytics().logEvent('app_error', {
      error_type: error.name,
      error_message: error.message,
      ...context
    });
  }
}