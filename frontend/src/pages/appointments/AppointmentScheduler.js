import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import {
  fetchAvailability,
  createAppointment,
  clearError
} from '../../store/slices/appointmentSlice';

const validationSchema = Yup.object({
  doctor: Yup.string().required('Doctor is required'),
  patient: Yup.string().required('Patient is required'),
  date: Yup.date().required('Date is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
  type: Yup.string().required('Appointment type is required'),
  notes: Yup.string()
});

function AppointmentScheduler() {
  const dispatch = useDispatch();
  const { availability, loading, error } = useSelector((state) => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const formik = useFormik({
    initialValues: {
      doctor: '',
      patient: '',
      date: new Date(),
      startTime: '',
      endTime: '',
      type: '',
      notes: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(createAppointment(values)).unwrap();
        toast.success('Appointment scheduled successfully!');
        formik.resetForm();
      } catch (error) {
        toast.error(error.message || 'Failed to schedule appointment');
      }
    }
  });

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      dispatch(fetchAvailability({
        doctor: selectedDoctor,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [dispatch, selectedDoctor, selectedDate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    formik.setFieldValue('date', date);
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    formik.setFieldValue('doctor', e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Schedule New Appointment
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Doctor Selection */}
        <div>
          <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
            Doctor
          </label>
          <select
            id="doctor"
            name="doctor"
            value={formik.values.doctor}
            onChange={handleDoctorChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              formik.touched.doctor && formik.errors.doctor ? 'border-red-300' : ''
            }`}
          >
            <option value="">Select a doctor</option>
            {/* Add doctor options here */}
          </select>
          {formik.touched.doctor && formik.errors.doctor && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.doctor}</p>
          )}
        </div>

        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              formik.touched.date && formik.errors.date ? 'border-red-300' : ''
            }`}
          />
          {formik.touched.date && formik.errors.date && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.date}</p>
          )}
        </div>

        {/* Time Slot Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Available Time Slots
          </label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {loading ? (
              <div className="col-span-4 text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : (
              availability.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    const [hours] = slot.split(':');
                    const endHour = parseInt(hours) + 1;
                    formik.setFieldValue('startTime', slot);
                    formik.setFieldValue('endTime', `${endHour.toString().padStart(2, '0')}:00`);
                  }}
                  className={`px-3 py-2 text-sm rounded-md ${
                    formik.values.startTime === slot
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {slot}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Appointment Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Appointment Type
          </label>
          <select
            id="type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              formik.touched.type && formik.errors.type ? 'border-red-300' : ''
            }`}
          >
            <option value="">Select type</option>
            <option value="consultation">Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="emergency">Emergency</option>
            <option value="routine">Routine Check</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.type}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formik.values.notes}
            onChange={formik.handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Scheduling...' : 'Schedule Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentScheduler; 