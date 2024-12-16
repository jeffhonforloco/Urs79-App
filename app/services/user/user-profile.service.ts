import { firebase } from '@nativescript/firebase-core';
import { UserProfile, UserSettings } from '../../models/user/user-profile.model';
import { ImageOptimizer } from '../../utils/performance/image-optimizer';
import { ProfileValidatorService } from './profile-validator.service';

export class UserProfileService {
  private db = firebase().firestore();
  private storage = firebase().storage();

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const doc = await this.db.collection('users').doc(userId).get();
      return doc.exists ? (doc.data() as UserProfile) : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      const errors = ProfileValidatorService.validateProfile(profile);
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      await this.db.collection('users').doc(userId).update({
        ...profile,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async uploadProfilePhoto(userId: string, photoPath: string): Promise<string> {
    try {
      const optimizedImage = await ImageOptimizer.optimizeForUpload(photoPath);
      const ref = this.storage.ref(`users/${userId}/photos/${Date.now()}`);
      await ref.putFile(optimizedImage.android || optimizedImage.ios);
      return await ref.getDownloadURL();
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw new Error('Failed to upload profile photo');
    }
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    try {
      await this.db.collection('users').doc(userId).update({
        settings: settings,
        lastSettingsUpdate: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update user settings');
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      // Delete user photos
      const photoRefs = await this.storage.ref(`users/${userId}/photos`).listAll();
      await Promise.all(photoRefs.items.map(ref => ref.delete()));

      // Delete user data
      await this.db.collection('users').doc(userId).delete();
      
      // Delete user auth
      const user = firebase().auth().currentUser;
      if (user) {
        await user.delete();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new Error('Failed to delete account');
    }
  }
}