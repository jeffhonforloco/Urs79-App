const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const db = getFirestore();

exports.signup = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;

    // Create user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password: await bcrypt.hash(password, 10),
      phoneNumber
    });

    // Create user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      phoneNumber,
      createdAt: new Date(),
      isVerified: false,
      isPremium: false
    });

    const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    logger.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userRecord = await getAuth().getUserByEmail(email);
    const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET);
    
    res.json({ token });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
};