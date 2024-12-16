import { firebase } from '@nativescript/firebase-core';
import { Observable } from '@nativescript/core';

export class ChatService {
  private db = firebase().firestore();

  getConversation(matchId: string): Observable<any> {
    return new Observable(subscriber => {
      const unsubscribe = this.db
        .collection('conversations')
        .doc(matchId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          subscriber.next(messages);
        });

      return () => unsubscribe();
    });
  }

  async sendMessage(matchId: string, senderId: string, content: string) {
    await this.db
      .collection('conversations')
      .doc(matchId)
      .collection('messages')
      .add({
        senderId,
        content,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'sent'
      });
  }
}