const winston = require('winston');
const { getFirestore } = require('firebase-admin/firestore');

class MonitoringService {
  constructor() {
    this.db = getFirestore();
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });
  }

  async trackMetric(metric, value, tags = {}) {
    await this.db.collection('metrics').add({
      metric,
      value,
      tags,
      timestamp: new Date()
    });
  }

  async logError(error, context = {}) {
    this.logger.error({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date()
    });

    await this.db.collection('errors').add({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date()
    });
  }

  async trackUserActivity(userId, action, metadata = {}) {
    await this.db.collection('user_activities').add({
      userId,
      action,
      metadata,
      timestamp: new Date()
    });
  }
}

module.exports = new MonitoringService();