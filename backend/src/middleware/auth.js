const jwt = require('jsonwebtoken');
const { getAuth } = require('firebase-admin/auth');
const logger = require('../utils/logger');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRecord = await getAuth().getUser(decoded.uid);
    
    req.user = userRecord;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};