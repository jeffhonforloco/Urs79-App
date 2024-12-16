const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const fs = require('fs');
const path = require('path');

class BackupService {
  constructor() {
    this.db = getFirestore();
    this.storage = getStorage();
    this.backupPath = path.join(__dirname, '../backups');
  }

  async backupDatabase() {
    const timestamp = new Date().toISOString();
    const collections = ['users', 'matches', 'conversations', 'verifications'];
    
    for (const collection of collections) {
      const snapshot = await this.db.collection(collection).get();
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const backupFile = path.join(
        this.backupPath,
        `${collection}_${timestamp}.json`
      );

      fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    }
  }

  async backupUserData(userId) {
    const userDoc = await this.db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // Backup user profile data
    const userBackupFile = path.join(
      this.backupPath,
      `user_${userId}_${new Date().toISOString()}.json`
    );

    fs.writeFileSync(userBackupFile, JSON.stringify(userData, null, 2));

    // Backup user photos
    const bucket = this.storage.bucket();
    const [files] = await bucket.getFiles({ prefix: `users/${userId}/` });

    for (const file of files) {
      const destination = path.join(this.backupPath, 'photos', file.name);
      await file.download({ destination });
    }
  }

  async exportUserData(userId) {
    const userData = {
      profile: null,
      matches: [],
      conversations: [],
      photos: []
    };

    // Get user profile
    const userDoc = await this.db.collection('users').doc(userId).get();
    userData.profile = userDoc.data();

    // Get user matches
    const matches = await this.db.collection('matches')
      .where('users', 'array-contains', userId)
      .get();
    userData.matches = matches.docs.map(doc => doc.data());

    // Get conversations
    const conversations = await this.db.collection('conversations')
      .where('participants', 'array-contains', userId)
      .get();
    userData.conversations = conversations.docs.map(doc => doc.data());

    return userData;
  }
}

module.exports = new BackupService();