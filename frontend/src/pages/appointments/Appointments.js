import React, { useState } from 'react';
import AppointmentScheduler from './AppointmentScheduler';
import AppointmentList from './AppointmentList';

function Appointments() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'schedule'

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and schedule appointments for your patients.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setActiveTab(activeTab === 'list' ? 'schedule' : 'list')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {activeTab === 'list' ? 'Schedule New' : 'View All'}
          </button>
        </div>
      </div>

      {activeTab === 'list' ? <AppointmentList /> : <AppointmentScheduler />}
    </div>
  );
}

export default Appointments; 