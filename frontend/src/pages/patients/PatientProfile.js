import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPatientProfile, addMedicalHistory, addAllergy, addMedication } from '../../store/slices/patientSlice';
import { format } from 'date-fns';

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { patientId } = useParams();
  const { currentPatient: patient, loading, error } = useSelector((state) => state.patients);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchPatientProfile(patientId));
  }, [dispatch, patientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Error loading patient profile: {error}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center text-gray-600">
        <p>Patient not found</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
          <div>
            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {patient.user.firstName} {patient.user.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Age</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.getAge()} years</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Gender</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.gender}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.bloodType}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.user.phoneNumber}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {patient.emergencyContact.name} - {patient.emergencyContact.phone}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Medical History</h3>
        <button
          onClick={() => {/* TODO: Implement add medical history modal */}}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Record
        </button>
      </div>
      <div className="space-y-6">
        {patient.medicalHistory.map((record) => (
          <div key={record._id} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{record.condition}</h4>
                <p className="mt-1 text-sm text-gray-500">{record.description}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {record.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Diagnosed on {format(new Date(record.diagnosisDate), 'MMMM d, yyyy')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAllergies = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Allergies</h3>
        <button
          onClick={() => {/* TODO: Implement add allergy modal */}}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Allergy
        </button>
      </div>
      <div className="space-y-4">
        {patient.allergies.map((allergy) => (
          <div key={allergy._id} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{allergy.name}</h4>
              <p className="mt-1 text-sm text-gray-500">{allergy.severity}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {allergy.reaction}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedications = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
        <button
          onClick={() => {/* TODO: Implement add medication modal */}}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Medication
        </button>
      </div>
      <div className="space-y-6">
        {patient.medications.map((medication) => (
          <div key={medication._id} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{medication.name}</h4>
                <p className="mt-1 text-sm text-gray-500">
                  {medication.dosage} - {medication.frequency}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {medication.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Started on {format(new Date(medication.startDate), 'MMMM d, yyyy')}
              {medication.endDate && ` - Ended on ${format(new Date(medication.endDate), 'MMMM d, yyyy')}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {patient.user.firstName} {patient.user.lastName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">Patient ID: {patient._id}</p>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          {['overview', 'medical-history', 'allergies', 'medications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'medical-history' && renderMedicalHistory()}
        {activeTab === 'allergies' && renderAllergies()}
        {activeTab === 'medications' && renderMedications()}
      </div>
    </div>
  );
};

export default PatientProfile; 