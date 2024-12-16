import { firebase } from '@nativescript/firebase-core';
import { Observable } from '@nativescript/core';

export class UserActivityService {
  private db = firebase().firestore();

  updateLastActive(userId: string): void {
    this.db.collection('users').doc(userId).update({
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(error => {
      console.error('Error updating last active:', error);
    });
  }

  trackUserAction(userId: string, action: string, metadata: any = {}): void {
    this.db.collection('user_activities').add({
      userId,
      action,
      metadata,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(error => {
      console.error('Error tracking user action:', error);
    });
  }

  getUserOnlineStatus(userId: string): Observable<boolean> {
    return new Observable(subscriber => {
      const unsubscribe = this.db.collection('users')
        .doc(userId)
        .onSnapshot(doc => {
          const lastActive = doc.data()?.lastActive?.toDate();
          const isOnline = lastActive && 
            (new Date().getTime() - lastActive.getTime()) < 5 * 60 * 1000; // 5 minutes
          subscriber.next(isOnline);
        });

      return () => unsubscribe();
    });
  }
}