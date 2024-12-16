import { LocalNotifications } from '@nativescript/local-notifications';
import { firebase } from '@nativescript/firebase-core';

export class NotificationService {
  async registerDevice(userId: string, token: string) {
    await firebase().firestore()
      .collection('users')
      .doc(userId)
      .update({
        pushTokens: firebase.firestore.FieldValue.arrayUnion(token)
      });
  }

  async sendLocalNotification(title: string, body: string) {
    await LocalNotifications.schedule([{
      title,
      body,
      badge: 1,
      at: new Date()
    }]);
  }

  async handleNewMatch(matchData: any) {
    await this.sendLocalNotification(
      'New Match!',
      'You have a new connection waiting to chat!'
    );
  }

  async handleNewMessage(messageData: any) {
    await this.sendLocalNotification(
      'New Message',
      'Someone sent you a message!'
    );
  }
}