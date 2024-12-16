import { firebase } from '@nativescript/firebase-core';
import { TwoFactorAuth } from '../../utils/security/two-factor';

export class PhoneAuthService {
  private static instance: PhoneAuthService;

  private constructor() {}

  static getInstance(): PhoneAuthService {
    if (!PhoneAuthService.instance) {
      PhoneAuthService.instance = new PhoneAuthService();
    }
    return PhoneAuthService.instance;
  }

  async startPhoneVerification(phoneNumber: string): Promise<string> {
    try {
      return await TwoFactorAuth.sendVerificationCode(phoneNumber);
    } catch (error) {
      console.error('Phone verification error:', error);
      throw new Error('Failed to start phone verification');
    }
  }

  async verifyPhoneCode(verificationId: string, code: string): Promise<boolean> {
    try {
      return await TwoFactorAuth.verifyCode(verificationId, code);
    } catch (error) {
      console.error('Code verification error:', error);
      return false;
    }
  }
}