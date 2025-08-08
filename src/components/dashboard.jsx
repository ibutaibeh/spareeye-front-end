import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../api/apiClient';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    clearAlert();
    try {
      const response = await apiClient.get('/requests/stats');
      if (response !== undefined && response !== null) {
        if (response.data !== undefined && response.data !== null) {
          setStats(response.data);
        }
      }
    } catch (err) {
      let msg = 'Failed to load dashboard data';
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
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Dashboard</h2>

        {alert !== null && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-4 p-3 rounded text-red-800 bg-red-100"
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
            Loading dashboard...
          </div>
        ) : stats === null ? (
          <div className="text-center text-gray-500 py-8">No data available</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-xl font-bold text-blue-800">{stats.total}</p>
              <p className="text-gray-600">Total Requests</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <p className="text-xl font-bold text-yellow-800">{stats.pending}</p>
              <p className="text-gray-600">Pending</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <p className="text-xl font-bold text-green-800">{stats.completed}</p>
              <p className="text-gray-600">Completed</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <p className="text-xl font-bold text-red-800">{stats.rejected}</p>
              <p className="text-gray-600">Rejected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
