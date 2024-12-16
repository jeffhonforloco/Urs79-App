import { firebase } from '@nativescript/firebase-core';

export class ModerationService {
  private db = firebase().firestore();

  async getReportedContent(page: number = 1, limit: number = 20) {
    try {
      const snapshot = await this.db.collection('reports')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .offset((page - 1) * limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching reported content:', error);
      throw new Error('Failed to fetch reported content');
    }
  }

  async reviewReport(reportId: string, action: 'approve' | 'reject', notes: string) {
    try {
      await this.db.collection('reports').doc(reportId).update({
        status: action,
        reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
        reviewNotes: notes
      });
    } catch (error) {
      console.error('Error reviewing report:', error);
      throw new Error('Failed to review report');
    }
  }

  async removeContent(contentId: string, contentType: string, reason: string) {
    try {
      await this.db.collection(contentType).doc(contentId).update({
        status: 'removed',
        removedAt: firebase.firestore.FieldValue.serverTimestamp(),
        removalReason: reason
      });
    } catch (error) {
      console.error('Error removing content:', error);
      throw new Error('Failed to remove content');
    }
  }
}