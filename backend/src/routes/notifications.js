const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get notification preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.preferences.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notification preferences
router.patch('/preferences', [
  auth,
  body('email').optional().isBoolean(),
  body('sms').optional().isBoolean(),
  body('whatsapp').optional().isBoolean(),
  body('push').optional().isBoolean(),
  body('reminderTiming').optional().isInt({ min: 1, max: 72 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    await user.updateNotificationPreferences(req.body);
    res.json(user.preferences.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update push subscription
router.post('/push-subscription', [
  auth,
  body('endpoint').isURL(),
  body('keys.p256dh').isString(),
  body('keys.auth').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    await user.updatePushSubscription(req.body);
    res.json({ message: 'Push subscription updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notification history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('notificationHistory')
      .populate('notificationHistory.appointment', 'date startTime endTime type');
    
    res.json(user.notificationHistory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Test notification
router.post('/test', [
  auth,
  body('type').isIn(['email', 'sms', 'whatsapp', 'push'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    const { type } = req.body;

    // Check if notification type is enabled
    if (!user.preferences.notifications[type]) {
      return res.status(400).json({ message: `${type} notifications are disabled` });
    }

    // Send test notification
    const reminderService = require('../services/reminderService');
    await reminderService.sendTestNotification(user, type);

    res.json({ message: 'Test notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 