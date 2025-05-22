import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    push: true,
    reminderTiming: 24
  });
  const [loading, setLoading] = useState(false);
  const [pushSupported, setPushSupported] = useState('serviceWorker' in navigator);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get('/api/notifications/preferences');
      setPreferences(response.data);
    } catch (error) {
      toast.error('Failed to load notification preferences');
    }
  };

  const handleToggle = async (type) => {
    try {
      setLoading(true);
      const newPreferences = {
        ...preferences,
        [type]: !preferences[type]
      };

      await axios.patch('/api/notifications/preferences', newPreferences);
      setPreferences(newPreferences);
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleTimingChange = async (value) => {
    try {
      setLoading(true);
      const newPreferences = {
        ...preferences,
        reminderTiming: parseInt(value)
      };

      await axios.patch('/api/notifications/preferences', newPreferences);
      setPreferences(newPreferences);
      toast.success('Reminder timing updated successfully');
    } catch (error) {
      toast.error('Failed to update reminder timing');
    } finally {
      setLoading(false);
    }
  };

  const handlePushSubscription = async () => {
    try {
      setLoading(true);
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });

      await axios.post('/api/notifications/push-subscription', subscription);
      toast.success('Push notifications enabled successfully');
    } catch (error) {
      toast.error('Failed to enable push notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async (type) => {
    try {
      setLoading(true);
      await axios.post('/api/notifications/test', { type });
      toast.success(`Test ${type} notification sent successfully`);
    } catch (error) {
      toast.error(`Failed to send test ${type} notification`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage how you receive notifications about your appointments.
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                  <span className="text-sm text-gray-500">Receive notifications via email</span>
                </div>
                <Switch
                  checked={preferences.email}
                  onChange={() => handleToggle('email')}
                  disabled={loading}
                  className={classNames(
                    preferences.email ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  )}
                >
                  <span
                    className={classNames(
                      preferences.email ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">SMS Notifications</span>
                  <span className="text-sm text-gray-500">Receive notifications via SMS</span>
                </div>
                <Switch
                  checked={preferences.sms}
                  onChange={() => handleToggle('sms')}
                  disabled={loading}
                  className={classNames(
                    preferences.sms ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  )}
                >
                  <span
                    className={classNames(
                      preferences.sms ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </div>

              {/* WhatsApp Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">WhatsApp Notifications</span>
                  <span className="text-sm text-gray-500">Receive notifications via WhatsApp</span>
                </div>
                <Switch
                  checked={preferences.whatsapp}
                  onChange={() => handleToggle('whatsapp')}
                  disabled={loading}
                  className={classNames(
                    preferences.whatsapp ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  )}
                >
                  <span
                    className={classNames(
                      preferences.whatsapp ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                  <span className="text-sm text-gray-500">Receive notifications in your browser</span>
                </div>
                {pushSupported ? (
                  <Switch
                    checked={preferences.push}
                    onChange={() => handleToggle('push')}
                    disabled={loading}
                    className={classNames(
                      preferences.push ? 'bg-indigo-600' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    )}
                  >
                    <span
                      className={classNames(
                        preferences.push ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                ) : (
                  <span className="text-sm text-gray-500">Not supported in your browser</span>
                )}
              </div>

              {/* Reminder Timing */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Reminder Timing</span>
                  <span className="text-sm text-gray-500">Hours before appointment</span>
                </div>
                <select
                  value={preferences.reminderTiming}
                  onChange={(e) => handleTimingChange(e.target.value)}
                  disabled={loading}
                  className="mt-1 block w-24 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="4">4 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                  <option value="72">72 hours</option>
                </select>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => handleTestNotification('email')}
                disabled={loading || !preferences.email}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Test Email
              </button>
              <button
                type="button"
                onClick={() => handleTestNotification('sms')}
                disabled={loading || !preferences.sms}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Test SMS
              </button>
              <button
                type="button"
                onClick={() => handleTestNotification('whatsapp')}
                disabled={loading || !preferences.whatsapp}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Test WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handleTestNotification('push')}
                disabled={loading || !preferences.push || !pushSupported}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Test Push
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 