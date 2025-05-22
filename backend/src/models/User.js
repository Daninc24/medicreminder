const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient'],
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    language: {
      type: String,
      enum: ['en', 'es', 'fr'],
      default: 'en'
    },
    reminderTiming: {
      type: Number, // Hours before appointment
      default: 24
    }
  },
  pushSubscription: {
    endpoint: String,
    keys: {
      p256dh: String,
      auth: String
    }
  },
  notificationHistory: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'push'],
      required: true
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true
    },
    error: String
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.pushSubscription;
  return userObject;
};

// Method to update notification preferences
userSchema.methods.updateNotificationPreferences = async function(preferences) {
  this.preferences.notifications = {
    ...this.preferences.notifications,
    ...preferences
  };
  return this.save();
};

// Method to update push subscription
userSchema.methods.updatePushSubscription = async function(subscription) {
  this.pushSubscription = subscription;
  return this.save();
};

// Method to add notification to history
userSchema.methods.addNotificationHistory = async function(notification) {
  this.notificationHistory.push(notification);
  if (this.notificationHistory.length > 100) {
    this.notificationHistory = this.notificationHistory.slice(-100);
  }
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User; 