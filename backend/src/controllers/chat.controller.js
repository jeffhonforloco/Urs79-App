const { getFirestore } = require('firebase-admin/firestore');
const logger = require('../utils/logger');

const db = getFirestore();

exports.sendMessage = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { senderId, content } = req.body;

    await db.collection('conversations')
      .doc(matchId)
      .collection('messages')
      .add({
        senderId,
        content,
        timestamp: new Date(),
        status: 'sent'
      });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { limit = 50 } = req.query;

    const messages = await db.collection('conversations')
      .doc(matchId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .get();

    res.json(messages.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(400).json({ error: error.message });
  }
};