import { firebase } from '@nativescript/firebase-core';
import { UserProfile } from '../../models/user/user-profile.model';

export class AnalyticsTracker {
  static trackUserAction(action: string, userId: string, metadata: any = {}): void {
    firebase().analytics().logEvent(action, {
      userId,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }

  static trackMatchEvent(userId: string, matchId: string, matchType: string): void {
    this.trackUserAction('match_created', userId, {
      matchId,
      matchType,
      timestamp: new Date().toISOString()
    });
  }

  static trackProfileUpdate(userId: string, updatedFields: Partial<UserProfile>): void {
    this.trackUserAction('profile_updated', userId, {
      fields: Object.keys(updatedFields),
      timestamp: new Date().toISOString()
    });
  }
}