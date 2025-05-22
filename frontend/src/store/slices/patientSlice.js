import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async () => {
    const response = await axios.get('/api/patients');
    return response.data;
  }
);

export const fetchPatientProfile = createAsyncThunk(
  'patients/fetchPatientProfile',
  async (id) => {
    const response = await axios.get(`/api/patients/${id}`);
    return response.data;
  }
);

export const createPatientProfile = createAsyncThunk(
  'patients/createPatientProfile',
  async (patientData) => {
    const response = await axios.post('/api/patients', patientData);
    return response.data;
  }
);

export const updatePatientProfile = createAsyncThunk(
  'patients/updatePatientProfile',
  async ({ id, patientData }) => {
    const response = await axios.patch(`/api/patients/${id}`, patientData);
    return response.data;
  }
);

export const addMedicalHistory = createAsyncThunk(
  'patients/addMedicalHistory',
  async ({ id, historyData }) => {
    const response = await axios.post(`/api/patients/${id}/medical-history`, historyData);
    return response.data;
  }
);

export const addAllergy = createAsyncThunk(
  'patients/addAllergy',
  async ({ id, allergyData }) => {
    const response = await axios.post(`/api/patients/${id}/allergies`, allergyData);
    return response.data;
  }
);

export const addMedication = createAsyncThunk(
  'patients/addMedication',
  async ({ id, medicationData }) => {
    const response = await axios.post(`/api/patients/${id}/medications`, medicationData);
    return response.data;
  }
);

export const uploadDocument = createAsyncThunk(
  'patients/uploadDocument',
  async ({ id, documentData }) => {
    const response = await axios.post(`/api/patients/${id}/documents`, documentData);
    return response.data;
  }
);

const initialState = {
  patients: [],
  currentPatient: null,
  loading: false,
  error: null
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch patient profile
      .addCase(fetchPatientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
      })
      .addCase(fetchPatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create patient profile
      .addCase(createPatientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
      })
      .addCase(createPatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update patient profile
      .addCase(updatePatientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add medical history
      .addCase(addMedicalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMedicalHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPatient) {
          state.currentPatient.medicalHistory = action.payload;
        }
      })
      .addCase(addMedicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add allergy
      .addCase(addAllergy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAllergy.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPatient) {
          state.currentPatient.allergies = action.payload;
        }
      })
      .addCase(addAllergy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add medication
      .addCase(addMedication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMedication.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPatient) {
          state.currentPatient.medications = action.payload;
        }
      })
      .addCase(addMedication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPatient) {
          state.currentPatient.documents = action.payload;
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, clearCurrentPatient } = patientSlice.actions;
export default patientSlice.reducer; 