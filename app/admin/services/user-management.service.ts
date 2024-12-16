import { firebase } from '@nativescript/firebase-core';
import { UserProfile } from '../../models/user/user-profile.model';

export class UserManagementService {
  private db = firebase().firestore();

  async getAllUsers(page: number = 1, limit: number = 20): Promise<UserProfile[]> {
    try {
      const snapshot = await this.db.collection('users')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset((page - 1) * limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserProfile));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async suspendUser(userId: string, reason: string): Promise<void> {
    try {
      await this.db.collection('users').doc(userId).update({
        status: 'suspended',
        suspensionReason: reason,
        suspendedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error suspending user:', error);
      throw new Error('Failed to suspend user');
    }
  }

  async verifyUser(userId: string): Promise<void> {
    try {
      await this.db.collection('users').doc(userId).update({
        isVerified: true,
        verifiedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error verifying user:', error);
      throw new Error('Failed to verify user');
    }
  }
}