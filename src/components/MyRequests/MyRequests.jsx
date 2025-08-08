import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../api/apiClient';

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    clearAlert();
    try {
      const response = await apiClient.get('/requests/my');
      if (response !== undefined && response !== null) {
        if (response.data !== undefined && response.data !== null) {
          if (Array.isArray(response.data)) {
            setRequests(response.data);
          }
        }
      }
    } catch (err) {
      let msg = 'Failed to load requests';
      if (err !== undefined && err !== null) {
        if (err.message !== undefined && err.message !== null) {
          msg = String(err.message);
        }
      }
      setAlert({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  }, [clearAlert]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Requests</h2>
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
        {loading === true ? (
          <div role="status" aria-live="polite" className="text-center py-8">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No requests found</div>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li key={req._id} className="border p-4 rounded-lg shadow-sm">
                <p className="font-semibold">Request ID: {req._id}</p>
                <p>Status: {req.status}</p>
                <p>Created At: {req.createdAt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyRequests;
