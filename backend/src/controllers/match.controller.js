const { getFirestore } = require('firebase-admin/firestore');
const logger = require('../utils/logger');

const db = getFirestore();

exports.getPotentialMatches = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();
    const userPreferences = userDoc.data().preferences;

    const matches = await db.collection('users')
      .where('age', '>=', userPreferences.ageRange.min)
      .where('age', '<=', userPreferences.ageRange.max)
      .limit(20)
      .get();

    const potentialMatches = matches.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(match => match.id !== userId);

    res.json(potentialMatches);
  } catch (error) {
    logger.error('Get matches error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.createMatch = async (req, res) => {
  try {
    const { userId, matchedUserId } = req.body;

    await db.collection('matches').add({
      users: [userId, matchedUserId],
      createdAt: new Date(),
      status: 'matched'
    });

    res.status(201).json({ message: 'Match created successfully' });
  } catch (error) {
    logger.error('Create match error:', error);
    res.status(400).json({ error: error.message });
  }
};