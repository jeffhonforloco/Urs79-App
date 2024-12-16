import { firebase } from '@nativescript/firebase-core';
import { SecureStorage } from '@nativescript/core';

export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly secureStorage = new SecureStorage();

  static async generateToken(): Promise<string> {
    const user = firebase().auth().currentUser;
    if (!user) throw new Error('No authenticated user');
    return await user.getIdToken();
  }

  static async storeToken(token: string): Promise<void> {
    await this.secureStorage.set(this.TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return await this.secureStorage.get(this.TOKEN_KEY);
  }

  static async removeToken(): Promise<void> {
    await this.secureStorage.remove(this.TOKEN_KEY);
  }
}