import React, { useCallback, useContext, useState } from 'react';
import apiClient from '../api/apiClient';
import { UserContext } from '../../contexts/UserContext';

function isNonEmptyString(value) {
  if (value === undefined) return false;
  if (value === null) return false;
  if (typeof value !== 'string') return false;
  if (value.trim() === '') return false;
  return true;
}

export default function Settings() {
  const { user, setUser } = useContext(UserContext) || { user: null, setUser: () => {} };
  const [name, setName] = useState(isNonEmptyString(user && user.name) ? user.name : '');
  const [email, setEmail] = useState(isNonEmptyString(user && user.email) ? user.email : '');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const validate = useCallback(() => {
    if (isNonEmptyString(name) === false) {
      setAlert({ type: 'error', text: 'Name is required' });
      return false;
    }
    if (isNonEmptyString(email) === false) {
      setAlert({ type: 'error', text: 'Email is required' });
      return false;
    }
    if (emailRegex.test(email.trim()) === false) {
      setAlert({ type: 'error', text: 'Invalid email format' });
      return false;
    }
    return true;
  }, [name, email]);

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      clearAlert();
      if (loading === true) return;
      if (validate() === false) return;
      setLoading(true);
      try {
        const payload = { name: name.trim(), email: email.trim() };
        const response = await apiClient.put('/user/settings', payload);
        if (response && response.data) {
          setUser(response.data);
        }
        setAlert({ type: 'success', text: 'Settings updated successfully' });
      } catch (err) {
        let msg = 'Update failed';
        if (err !== undefined && err !== null) {
          if (err.message !== undefined && err.message !== null) {
            msg = String(err.message);
          }
        }
        setAlert({ type: 'error', text: msg });
      } finally {
        setLoading(false);
      }
    },
    [name, email, loading, validate, clearAlert, setUser]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSave}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        noValidate
        aria-labelledby="settings-heading"
      >
        <h2 id="settings-heading" className="text-2xl font-bold mb-6 text-center text-gray-800">
          Settings
        </h2>
        {alert !== null && (
          <div
            role="alert"
            aria-live="assertive"
            className={
              alert.type === 'success'
                ? 'mb-4 p-3 rounded text-green-800 bg-green-100'
                : 'mb-4 p-3 rounded text-red-800 bg-red-100'
            }
          >
            <div className="flex items-start justify-between">
              <div>{alert.text}</div>
              <button
                type="button"
                aria-label="Dismiss message"
                onClick={clearAlert}
                className="ml-3 text-sm font-medium underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <label htmlFor="settings-name" className="block text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="settings-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-4 py-2 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading === true}
          aria-required="true"
        />
        <label htmlFor="settings-email" className="block text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="settings-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading === true}
          aria-required="true"
        />
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-700 transition disabled:opacity-60"
          disabled={loading === true}
          aria-busy={loading === true}
        >
          {loading === true ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
