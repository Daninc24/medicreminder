import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentReducer from './slices/appointmentSlice';
import patientReducer from './slices/patientSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentReducer,
    patients: patientReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.user.pushSubscription'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user.pushSubscription']
      }
    })
});

export default store; 