import { firebase } from '@nativescript/firebase-core';
import { Folder, File } from '@nativescript/core';

export class DataBackupService {
  private static readonly BACKUP_FOLDER = 'backups';

  static async backupUserData(userId: string): Promise<void> {
    try {
      const userData = await this.getUserData(userId);
      const backupFolder = Folder.fromPath(this.BACKUP_FOLDER);
      const backupFile = File.fromPath(
        `${backupFolder.path}/user_${userId}_${Date.now()}.json`
      );

      await backupFile.writeText(JSON.stringify(userData));
    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error('Failed to backup user data');
    }
  }

  private static async getUserData(userId: string): Promise<any> {
    const db = firebase().firestore();
    const userDoc = await db.collection('users').doc(userId).get();
    return userDoc.data();
  }
}