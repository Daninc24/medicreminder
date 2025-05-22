import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { registerServiceWorker } from './utils/serviceWorker';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Appointments from './pages/appointments/Appointments';
import Patients from './pages/patients/Patients';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';
import NotificationSettings from './pages/settings/NotificationSettings';

// Components
import PrivateRoute from './components/PrivateRoute';
import store from './store';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const initializeServiceWorker = async () => {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.error('Service Worker initialization failed:', error);
      }
    };

    initializeServiceWorker();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings/notifications" element={<NotificationSettings />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App; 