const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { initializeFirebase } = require('./config/firebase.config');
const { configureSecurityMiddleware } = require('./middleware/security');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const monitoring = require('./utils/monitoring');
const backup = require('./utils/backup');
const analytics = require('./utils/analytics');

// Initialize Firebase
initializeFirebase();

const app = express();

// Security Middleware Configuration
configureSecurityMiddleware(app);

// Basic Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  next();
});

// Performance Monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    monitoring.trackMetric('request_duration', duration, {
      path: req.path,
      method: req.method,
      status: res.statusCode
    });
  });
  next();
});

// Routes
app.use('/api', routes);

// Error Handling
app.use(errorHandler);

// Scheduled Tasks
const BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
setInterval(async () => {
  try {
    await backup.backupDatabase();
    logger.info('Database backup completed successfully');
  } catch (error) {
    logger.error('Database backup failed:', error);
  }
}, BACKUP_INTERVAL);

// Analytics Collection
const ANALYTICS_INTERVAL = 60 * 60 * 1000; // 1 hour
setInterval(async () => {
  try {
    const [userMetrics, matchMetrics] = await Promise.all([
      analytics.getUserMetrics(),
      analytics.getMatchMetrics()
    ]);
    
    await monitoring.trackMetric('user_metrics', userMetrics);
    await monitoring.trackMetric('match_metrics', matchMetrics);
  } catch (error) {
    logger.error('Analytics collection failed:', error);
  }
}, ANALYTICS_INTERVAL);

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  
  // Close server
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = server; // For testing purposes