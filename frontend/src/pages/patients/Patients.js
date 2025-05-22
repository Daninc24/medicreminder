import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PatientList from './PatientList';
import PatientProfile from './PatientProfile';
import AddPatient from './AddPatient';

const Patients = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<PatientList />} />
          <Route path="/new" element={<AddPatient />} />
          <Route path="/:patientId" element={<PatientProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Patients; 