import { firebase } from '@nativescript/firebase-core';
import { ImageSource } from '@nativescript/core';

export class UserVerificationService {
  private db = firebase().firestore();
  private storage = firebase().storage();

  async submitVerification(userId: string, selfiePhoto: ImageSource, idPhoto: ImageSource): Promise<void> {
    try {
      // Upload verification photos
      const selfieRef = this.storage.ref(`verifications/${userId}/selfie`);
      const idRef = this.storage.ref(`verifications/${userId}/id`);

      await Promise.all([
        selfieRef.putFile(selfiePhoto.android || selfiePhoto.ios),
        idRef.putFile(idPhoto.android || idPhoto.ios)
      ]);

      const [selfieUrl, idUrl] = await Promise.all([
        selfieRef.getDownloadURL(),
        idRef.getDownloadURL()
      ]);

      // Create verification request
      await this.db.collection('verifications').doc(userId).set({
        userId,
        selfieUrl,
        idUrl,
        status: 'pending',
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        reviewedAt: null,
        reviewNotes: null
      });

      // Update user profile
      await this.db.collection('users').doc(userId).update({
        verificationStatus: 'pending'
      });
    } catch (error) {
      console.error('Error submitting verification:', error);
      throw new Error('Failed to submit verification');
    }
  }

  async getVerificationStatus(userId: string): Promise<string> {
    try {
      const doc = await this.db.collection('verifications').doc(userId).get();
      return doc.exists ? doc.data()?.status : 'not_submitted';
    } catch (error) {
      console.error('Error getting verification status:', error);
      throw new Error('Failed to get verification status');
    }
  }
}