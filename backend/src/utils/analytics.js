const { getFirestore } = require('firebase-admin/firestore');

class AnalyticsService {
  constructor() {
    this.db = getFirestore();
  }

  async trackEvent(eventName, data = {}) {
    await this.db.collection('analytics_events').add({
      event: eventName,
      data,
      timestamp: new Date()
    });
  }

  async getUserMetrics() {
    const snapshot = await this.db.collection('users').get();
    const totalUsers = snapshot.size;
    
    const activeUsers = await this.db.collection('users')
      .where('lastActive', '>', new Date(Date.now() - 24 * 60 * 60 * 1000))
      .get();

    return {
      totalUsers,
      activeUsers: activeUsers.size,
      timestamp: new Date()
    };
  }

  async getMatchMetrics() {
    const snapshot = await this.db.collection('matches')
      .where('status', '==', 'matched')
      .get();

    return {
      totalMatches: snapshot.size,
      timestamp: new Date()
    };
  }
}

module.exports = new AnalyticsService();