const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

const initializeFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
};

module.exports = { initializeFirebase };