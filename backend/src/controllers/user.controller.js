const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const logger = require('../utils/logger');

const db = getFirestore();
const storage = getStorage();

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    await db.collection('users').doc(userId).update({
      ...profileData,
      updatedAt: new Date()
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    const { photo } = req.files;

    const bucket = storage.bucket();
    const filename = `users/${userId}/photos/${Date.now()}-${photo.name}`;
    
    await bucket.upload(photo.tempFilePath, {
      destination: filename,
      metadata: {
        contentType: photo.mimetype
      }
    });

    const photoUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    
    await db.collection('users').doc(userId).update({
      photos: getFirestore.FieldValue.arrayUnion(photoUrl)
    });

    res.json({ photoUrl });
  } catch (error) {
    logger.error('Photo upload error:', error);
    res.status(400).json({ error: error.message });
  }
};