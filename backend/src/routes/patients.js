const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Get all patients (for doctors)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patients = await Patient.find()
      .populate('user', 'firstName lastName email phoneNumber')
      .select('-medicalHistory -documents');

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient profile
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.id })
      .populate('user', 'firstName lastName email phoneNumber')
      .populate('preferredDoctors', 'firstName lastName email');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if the requesting user is the patient or their doctor
    if (req.user.role !== 'doctor' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create patient profile
router.post('/', [
  auth,
  body('dateOfBirth').isISO8601(),
  body('gender').isIn(['male', 'female', 'other']),
  body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  body('address').optional().isObject(),
  body('emergencyContact').optional().isObject(),
  body('insurance').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if patient profile already exists
    const existingPatient = await Patient.findOne({ user: req.user.id });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient profile already exists' });
    }

    const patient = new Patient({
      user: req.user.id,
      ...req.body
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.patch('/:id', [
  auth,
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  body('address').optional().isObject(),
  body('emergencyContact').optional().isObject(),
  body('insurance').optional().isObject(),
  body('communicationPreferences').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await Patient.findOne({ user: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if the requesting user is the patient or their doctor
    if (req.user.role !== 'doctor' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(patient, req.body);
    await patient.save();

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add medical history
router.post('/:id/medical-history', [
  auth,
  body('condition').isString(),
  body('diagnosis').isString(),
  body('diagnosedAt').isISO8601(),
  body('status').isIn(['active', 'resolved', 'chronic']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findOne({ user: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.medicalHistory.push({
      ...req.body,
      addedBy: req.user.id
    });

    await patient.save();
    res.json(patient.medicalHistory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add allergy
router.post('/:id/allergies', [
  auth,
  body('name').isString(),
  body('severity').isIn(['mild', 'moderate', 'severe']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findOne({ user: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.allergies.push({
      ...req.body,
      addedBy: req.user.id
    });

    await patient.save();
    res.json(patient.allergies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add medication
router.post('/:id/medications', [
  auth,
  body('name').isString(),
  body('dosage').isString(),
  body('frequency').isString(),
  body('startDate').isISO8601(),
  body('endDate').optional().isISO8601(),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findOne({ user: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.medications.push({
      ...req.body,
      prescribedBy: req.user.id
    });

    await patient.save();
    res.json(patient.medications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document
router.post('/:id/documents', [
  auth,
  body('type').isIn(['lab_result', 'prescription', 'imaging', 'other']),
  body('name').isString(),
  body('url').isURL(),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findOne({ user: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.documents.push({
      ...req.body,
      uploadedBy: req.user.id
    });

    await patient.save();
    res.json(patient.documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 