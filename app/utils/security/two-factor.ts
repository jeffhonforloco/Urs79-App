import { firebase } from '@nativescript/firebase-core';
import { LocalNotifications } from '@nativescript/local-notifications';

export class TwoFactorAuth {
  static async sendVerificationCode(phoneNumber: string): Promise<string> {
    try {
      const provider = new firebase.auth.PhoneAuthProvider();
      return await provider.verifyPhoneNumber(phoneNumber);
    } catch (error) {
      console.error('2FA error:', error);
      throw new Error('Failed to send verification code');
    }
  }

  static async verifyCode(verificationId: string, code: string): Promise<boolean> {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      await firebase().auth().signInWithCredential(credential);
      return true;
    } catch (error) {
      console.error('Code verification error:', error);
      return false;
    }
  }

  static async enableTwoFactor(userId: string): Promise<void> {
    await firebase().firestore()
      .collection('users')
      .doc(userId)
      .update({
        twoFactorEnabled: true,
        twoFactorEnabledAt: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
}