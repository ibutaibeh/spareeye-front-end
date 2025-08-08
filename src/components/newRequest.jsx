import React, { useState, useCallback } from 'react';
import apiClient from '../api/apiClient';

function isNonEmptyString(value) {
  if (value === undefined) return false;
  if (value === null) return false;
  if (typeof value !== 'string') return false;
  if (value.trim() === '') return false;
  return true;
}

export default function NewRequest() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const validate = useCallback(() => {
    if (isNonEmptyString(description) === false) {
      setAlert({ type: 'error', text: 'Description is required' });
      return false;
    }
    if (description.trim().length < 5) {
      setAlert({ type: 'error', text: 'Description must be at least 5 characters long' });
      return false;
    }
    return true;
  }, [description]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      clearAlert();
      if (loading === true) return;
      if (validate() === false) return;
      setLoading(true);
      try {
        const payload = { description: description.trim() };
        await apiClient.post('/requests', payload);
        setAlert({ type: 'success', text: 'Request submitted successfully' });
        setDescription('');
      } catch (err) {
        let msg = 'Failed to submit request';
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
    [description, loading, validate, clearAlert]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        noValidate
        aria-labelledby="new-request-heading"
      >
        <h2 id="new-request-heading" className="text-2xl font-bold mb-6 text-center text-gray-800">
          Submit New Request
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
        <label htmlFor="request-description" className="block text-gray-700 mb-1">
          Request Description
        </label>
        <textarea
          id="request-description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading === true}
          aria-required="true"
          rows="4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading === true}
          aria-busy={loading === true}
        >
          {loading === true ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
