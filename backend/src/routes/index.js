const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const matchRoutes = require('./match.routes');
const chatRoutes = require('./chat.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/matches', matchRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);

module.exports = router;