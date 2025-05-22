const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'routine'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'push'],
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    scheduledFor: {
      type: Date,
      required: true
    },
    sentAt: {
      type: Date
    }
  }],
  cancellationReason: {
    type: String,
    trim: true
  },
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  rescheduledTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ status: 1 });

// Virtual for duration
appointmentSchema.virtual('duration').get(function() {
  const start = new Date(`2000-01-01T${this.startTime}`);
  const end = new Date(`2000-01-01T${this.endTime}`);
  return (end - start) / (1000 * 60); // Duration in minutes
});

// Method to check if appointment is in the past
appointmentSchema.methods.isPast = function() {
  const appointmentDateTime = new Date(this.date);
  const [hours, minutes] = this.startTime.split(':');
  appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));
  return appointmentDateTime < new Date();
};

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  const appointmentDateTime = new Date(this.date);
  const [hours, minutes] = this.startTime.split(':');
  appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));
  const hoursUntilAppointment = (appointmentDateTime - new Date()) / (1000 * 60 * 60);
  return hoursUntilAppointment >= 24; // Can be cancelled up to 24 hours before
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 