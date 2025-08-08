import React, { useCallback, useState } from 'react';
import apiClient from '../api/apiClient';

function isNonEmptyString(value) {
  if (value === undefined) return false;
  if (value === null) return false;
  if (typeof value !== 'string') return false;
  if (value.trim() === '') return false;
  return true;
}

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const validate = useCallback(() => {
    if (isNonEmptyString(email) === false) {
      setAlert({ type: 'error', text: 'Email is required' });
      return false;
    }
    if (typeof email === 'string') {
      if (emailRegex.test(email.trim()) === false) {
        setAlert({ type: 'error', text: 'Invalid email format' });
        return false;
      }
    }
    if (isNonEmptyString(password) === false) {
      setAlert({ type: 'error', text: 'Password is required' });
      return false;
    }
    return true;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      clearAlert();
      if (loading === true) return;
      if (validate() === false) return;
      setLoading(true);
      try {
        const payload = { email: email.trim(), password };
        const response = await apiClient.post('/auth/sign-in', payload);
        let token = null;
        if (response !== undefined && response !== null) {
          if (response.data !== undefined && response.data !== null) {
            if (response.data.token !== undefined && response.data.token !== null) {
              token = response.data.token;
            }
          }
        }
        if (token !== null) {
          try {
            localStorage.setItem('token', token);
          } catch {}
        }
        setAlert({ type: 'success', text: 'Signed in successfully' });
      } catch (err) {
        let msg = 'Sign in failed';
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
    [email, password, loading, validate, clearAlert]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-8 rounded-xl shadow-md w-full max-w-md"
        noValidate
        aria-labelledby="signin-heading"
      >
        <h2 id="signin-heading" className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign In
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
        <label htmlFor="signin-email" className="block text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="signin-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading === true}
          aria-required="true"
        />
        <label htmlFor="signin-password" className="block text-gray-700 mb-1">
          Password
        </label>
        <input
          id="signin-password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading === true}
          aria-required="true"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading === true}
          aria-busy={loading === true}
        >
          {loading === true ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
