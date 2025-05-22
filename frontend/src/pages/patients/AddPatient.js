import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createPatientProfile } from '../../store/slices/patientSlice';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  bloodType: Yup.string().required('Blood type is required'),
  address: Yup.string().required('Address is required'),
  emergencyContact: Yup.object({
    name: Yup.string().required('Emergency contact name is required'),
    phone: Yup.string().required('Emergency contact phone is required'),
    relationship: Yup.string().required('Relationship is required'),
  }),
});

const AddPatient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.patients);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      address: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(createPatientProfile(values)).unwrap();
        navigate('/patients');
      } catch (err) {
        // Error is handled by the Redux state
      }
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Patient</h3>
            <p className="mt-1 text-sm text-gray-600">
              Please fill in all the required information to create a new patient profile.
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={formik.handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      {...formik.getFieldProps('firstName')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.firstName}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      {...formik.getFieldProps('lastName')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.lastName}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      {...formik.getFieldProps('email')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      {...formik.getFieldProps('phoneNumber')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      {...formik.getFieldProps('dateOfBirth')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      {...formik.getFieldProps('gender')}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {formik.touched.gender && formik.errors.gender && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.gender}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                      Blood Type
                    </label>
                    <select
                      id="bloodType"
                      name="bloodType"
                      {...formik.getFieldProps('bloodType')}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select blood type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    {formik.touched.bloodType && formik.errors.bloodType && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.bloodType}</p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      {...formik.getFieldProps('address')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {formik.touched.address && formik.errors.address && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.address}</p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Emergency Contact</h3>
                    <div className="mt-4 grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.name"
                          id="emergencyContact.name"
                          {...formik.getFieldProps('emergencyContact.name')}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {formik.touched.emergencyContact?.name && formik.errors.emergencyContact?.name && (
                          <p className="mt-2 text-sm text-red-600">{formik.errors.emergencyContact.name}</p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          id="emergencyContact.phone"
                          {...formik.getFieldProps('emergencyContact.phone')}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {formik.touched.emergencyContact?.phone && formik.errors.emergencyContact?.phone && (
                          <p className="mt-2 text-sm text-red-600">{formik.errors.emergencyContact.phone}</p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-gray-700">
                          Relationship
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.relationship"
                          id="emergencyContact.relationship"
                          {...formik.getFieldProps('emergencyContact.relationship')}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {formik.touched.emergencyContact?.relationship && formik.errors.emergencyContact?.relationship && (
                          <p className="mt-2 text-sm text-red-600">{formik.errors.emergencyContact.relationship}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate('/patients')}
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Creating...' : 'Create Patient'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient; 