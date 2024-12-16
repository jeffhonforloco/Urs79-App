import { firebase } from '@nativescript/firebase-core';
import { UserProfile } from '../models/user.model';

export class MatchingService {
  private db = firebase().firestore();

  async getPotentialMatches(userId: string, preferences: UserProfile['preferences']) {
    const snapshot = await this.db
      .collection('users')
      .where('age', '>=', preferences.ageRange.min)
      .where('age', '<=', preferences.ageRange.max)
      .where('gender', 'in', preferences.genderPreference)
      .limit(20)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async createMatch(userId1: string, userId2: string) {
    await this.db.collection('matches').add({
      users: [userId1, userId2],
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'new'
    });
  }

  async quickMatch(userId: string) {
    // Implement "79 Seconds Match" feature
    // Add logic for quick matching algorithm
  }
}