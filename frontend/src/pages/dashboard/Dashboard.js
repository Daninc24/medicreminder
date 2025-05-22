import React from 'react';
import { useSelector } from 'react-redux';
import {
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';

const stats = [
  { name: 'Total Appointments', value: '12', icon: CalendarIcon },
  { name: 'Active Patients', value: '24', icon: UserGroupIcon },
  { name: 'Today\'s Appointments', value: '4', icon: ClockIcon },
  { name: 'Completed Appointments', value: '8', icon: CheckCircleIcon }
];

const upcomingAppointments = [
  {
    id: 1,
    patientName: 'John Doe',
    time: '10:00 AM',
    type: 'Consultation',
    status: 'Confirmed'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    time: '11:30 AM',
    type: 'Follow-up',
    status: 'Scheduled'
  },
  {
    id: 3,
    patientName: 'Mike Johnson',
    time: '2:00 PM',
    type: 'Routine Check',
    status: 'Confirmed'
  }
];

function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your appointments today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Upcoming Appointments
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {upcomingAppointments.map((appointment) => (
              <li key={appointment.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${appointment.patientName}`}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patientName}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                    <span
                      className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        appointment.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 