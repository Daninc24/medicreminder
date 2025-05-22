const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    expiryDate: Date
  },
  medicalHistory: [{
    condition: String,
    diagnosis: String,
    diagnosedAt: Date,
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic'],
      default: 'active'
    },
    notes: String
  }],
  allergies: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'moderate'
    },
    notes: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  documents: [{
    type: {
      type: String,
      enum: ['lab_result', 'prescription', 'imaging', 'other'],
      required: true
    },
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  preferredDoctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  communicationPreferences: {
    preferredLanguage: {
      type: String,
      enum: ['en', 'es', 'fr'],
      default: 'en'
    },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'phone'],
      default: 'email'
    },
    preferredContactTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      default: 'morning'
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
patientSchema.index({ user: 1 });
patientSchema.index({ 'medicalHistory.condition': 1 });
patientSchema.index({ 'allergies.name': 1 });
patientSchema.index({ 'medications.name': 1 });

// Method to get patient's age
patientSchema.methods.getAge = function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Method to get active medications
patientSchema.methods.getActiveMedications = function() {
  const today = new Date();
  return this.medications.filter(med => {
    return (!med.endDate || new Date(med.endDate) > today) && new Date(med.startDate) <= today;
  });
};

// Method to get active medical conditions
patientSchema.methods.getActiveConditions = function() {
  return this.medicalHistory.filter(condition => 
    condition.status === 'active' || condition.status === 'chronic'
  );
};

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient; 