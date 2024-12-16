import { firebase } from '@nativescript/firebase-core';
import { Encryption } from '../../utils/security/encryption';
import { TokenManager } from '../../utils/security/token-manager';

export class AdminAuthService {
  private db = firebase().firestore();

  async adminLogin(email: string, password: string): Promise<boolean> {
    try {
      const adminDoc = await this.db.collection('admin_users')
        .where('email', '==', email)
        .where('status', '==', 'active')
        .get();

      if (adminDoc.empty) {
        throw new Error('Admin user not found or inactive');
      }

      const adminData = adminDoc.docs[0].data();
      const hashedPassword = Encryption.hashPassword(password);

      if (hashedPassword !== adminData.password) {
        throw new Error('Invalid credentials');
      }

      const token = await TokenManager.generateToken();
      await TokenManager.storeToken(token);

      await this.logAdminActivity(adminDoc.docs[0].id, 'login');
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  }

  private async logAdminActivity(adminId: string, action: string, metadata: any = {}) {
    await this.db.collection('admin_activities').add({
      adminId,
      action,
      metadata,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      ipAddress: 'system' // In a real app, get actual IP
    });
  }
}