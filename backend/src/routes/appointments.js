const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

// Validation middleware
const validateAppointment = [
  body('doctor').isMongoId(),
  body('patient').isMongoId(),
  body('date').isISO8601(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('type').isIn(['consultation', 'follow-up', 'emergency', 'routine']),
  body('notes').optional().trim()
];

// Get all appointments (filtered by role)
router.get('/', auth, async (req, res) => {
  try {
    const query = {};
    
    // Filter based on user role
    if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    } else if (req.user.role === 'patient') {
      query.patient = req.user._id;
    }

    // Add date filter if provided
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'firstName lastName')
      .populate('patient', 'firstName lastName')
      .sort({ date: 1, startTime: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

// Create new appointment
router.post('/', auth, validateAppointment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctor, patient, date, startTime, endTime, type, notes } = req.body;

    // Check for scheduling conflicts
    const conflict = await Appointment.findOne({
      doctor,
      date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflict) {
      return res.status(400).json({ error: 'Time slot is already booked' });
    }

    const appointment = new Appointment({
      doctor,
      patient,
      date,
      startTime,
      endTime,
      type,
      notes,
      reminders: [
        {
          type: 'email',
          scheduledFor: new Date(new Date(date).setHours(parseInt(startTime.split(':')[0]) - 24, 0, 0, 0))
        },
        {
          type: 'sms',
          scheduledFor: new Date(new Date(date).setHours(parseInt(startTime.split(':')[0]) - 2, 0, 0, 0))
        }
      ]
    });

    await appointment.save();

    // Populate doctor and patient details
    await appointment.populate('doctor', 'firstName lastName');
    await appointment.populate('patient', 'firstName lastName');

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating appointment' });
  }
});

// Update appointment
router.patch('/:id', auth, validateAppointment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        req.user._id.toString() !== appointment.doctor.toString() && 
        req.user._id.toString() !== appointment.patient.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this appointment' });
    }

    // Check if appointment can be modified
    if (!appointment.canBeCancelled()) {
      return res.status(400).json({ error: 'Appointment cannot be modified within 24 hours' });
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => appointment[update] = req.body[update]);
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating appointment' });
  }
});

// Cancel appointment
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        req.user._id.toString() !== appointment.doctor.toString() && 
        req.user._id.toString() !== appointment.patient.toString()) {
      return res.status(403).json({ error: 'Not authorized to cancel this appointment' });
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      return res.status(400).json({ error: 'Appointment cannot be cancelled within 24 hours' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = req.body.reason;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error cancelling appointment' });
  }
});

// Get appointment availability
router.get('/availability', auth, async (req, res) => {
  try {
    const { doctor, date } = req.query;
    if (!doctor || !date) {
      return res.status(400).json({ error: 'Doctor and date are required' });
    }

    const appointments = await Appointment.find({
      doctor,
      date: new Date(date),
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('startTime endTime');

    // Define working hours (9 AM to 5 PM)
    const workingHours = Array.from({ length: 17 }, (_, i) => i + 8)
      .map(hour => `${hour.toString().padStart(2, '0')}:00`);

    // Filter out booked slots
    const availableSlots = workingHours.filter(slot => {
      return !appointments.some(apt => {
        const slotHour = parseInt(slot.split(':')[0]);
        const aptStart = parseInt(apt.startTime.split(':')[0]);
        const aptEnd = parseInt(apt.endTime.split(':')[0]);
        return slotHour >= aptStart && slotHour < aptEnd;
      });
    });

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching availability' });
  }
});

module.exports = router; 