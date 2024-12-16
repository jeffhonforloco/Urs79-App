import { firebase } from '@nativescript/firebase-core';

export class PremiumService {
  private db = firebase().firestore();

  async purchaseBoost(userId: string, boostType: string) {
    await this.db.collection('users').doc(userId).update({
      boosts: firebase.firestore.FieldValue.arrayUnion({
        type: boostType,
        purchasedAt: firebase.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      })
    });
  }

  async upgradeToPremiuim(userId: string) {
    await this.db.collection('users').doc(userId).update({
      isPremium: true,
      premiumSince: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  async getPremiumFeatures(userId: string) {
    const doc = await this.db.collection('users').doc(userId).get();
    return doc.data()?.premiumFeatures || [];
  }
}