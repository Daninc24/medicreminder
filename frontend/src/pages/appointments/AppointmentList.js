import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  fetchAppointments,
  cancelAppointment,
  clearError
} from '../../store/slices/appointmentSlice';

function AppointmentList() {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.appointments);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCancel = async (id) => {
    const reason = window.prompt('Please provide a reason for cancellation:');
    if (reason) {
      try {
        await dispatch(cancelAppointment({ id, reason })).unwrap();
        toast.success('Appointment cancelled successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to cancel appointment');
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    const appointmentTime = appointment.startTime.split(':');
    appointmentDate.setHours(parseInt(appointmentTime[0]), parseInt(appointmentTime[1]));

    switch (filter) {
      case 'upcoming':
        return appointmentDate > now && appointment.status !== 'cancelled';
      case 'past':
        return appointmentDate < now && appointment.status !== 'cancelled';
      case 'cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-md ${
            filter === 'upcoming'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-md ${
            filter === 'past'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Past
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-md ${
            filter === 'cancelled'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredAppointments.map((appointment) => (
            <li key={appointment._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${appointment.patient.firstName}+${appointment.patient.lastName}`}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      {format(new Date(appointment.date), 'MMM d, yyyy')} at{' '}
                      {appointment.startTime}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                      <button
                        onClick={() => handleCancel(appointment._id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-2 text-sm text-gray-500">{appointment.notes}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AppointmentList; 