import { firebase } from '@nativescript/firebase-core';
import { UserSettings } from '../../models/user/user-profile.model';

export class UserPreferencesService {
  private db = firebase().firestore();

  async getUserPreferences(userId: string): Promise<UserSettings> {
    try {
      const doc = await this.db.collection('users').doc(userId).get();
      return doc.data()?.settings || this.getDefaultSettings();
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return this.getDefaultSettings();
    }
  }

  async updatePreferences(userId: string, preferences: Partial<UserSettings>): Promise<void> {
    try {
      await this.db.collection('users').doc(userId).update({
        'settings': preferences,
        'lastSettingsUpdate': firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw new Error('Failed to update preferences');
    }
  }

  private getDefaultSettings(): UserSettings {
    return {
      notifications: {
        matches: true,
        messages: true,
        likes: true,
        inAppVibration: true,
        emailNotifications: true
      },
      privacy: {
        showOnlineStatus: true,
        showDistance: true,
        showLastActive: true,
        profileVisibility: 'public'
      },
      discovery: {
        maxDistance: 50,
        ageRange: { min: 18, max: 99 },
        showMe: true
      }
    };
  }
}