import { firebase } from '@nativescript/firebase-core';
import { Encryption } from '../../utils/security/encryption';
import { TokenManager } from '../../utils/security/token-manager';
import { TwoFactorAuth } from '../../utils/security/two-factor';

export class AuthService {
  async signUp(email: string, password: string, phoneNumber?: string): Promise<void> {
    try {
      const hashedPassword = Encryption.hashPassword(password);
      const userCredential = await firebase().auth()
        .createUserWithEmailAndPassword(email, hashedPassword);

      if (phoneNumber) {
        await TwoFactorAuth.sendVerificationCode(phoneNumber);
      }

      const token = await TokenManager.generateToken();
      await TokenManager.storeToken(token);

      await this.createUserProfile(userCredential.user.uid, {
        email,
        phoneNumber,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        twoFactorEnabled: !!phoneNumber
      });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  private async createUserProfile(userId: string, data: any): Promise<void> {
    await firebase().firestore()
      .collection('users')
      .doc(userId)
      .set({
        ...data,
        isVerified: false,
        isPremium: false,
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
}