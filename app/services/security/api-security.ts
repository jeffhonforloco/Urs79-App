import { firebase } from '@nativescript/firebase-core';
import { rateLimiter } from './rate-limiter';
import { ErrorTracker } from '../monitoring/error-tracker';

export class ApiSecurity {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  static async secureApiCall<T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> {
    if (!rateLimiter.checkLimit(endpoint)) {
      throw new Error('Rate limit exceeded');
    }

    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        const result = await apiCall();
        return result;
      } catch (error) {
        retries++;
        if (retries === this.MAX_RETRIES) {
          ErrorTracker.trackError(error as Error, { endpoint });
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
      }
    }

    throw new Error('API call failed after retries');
  }
}