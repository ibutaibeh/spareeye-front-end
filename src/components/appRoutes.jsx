import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInForm from './sign_in_form';
import SignUpForm from './sign_up_form';
import Dashboard from './dashboard';
import Profile from './profile';
import Settings from './settings';
import MyRequests from './myRequests';
import NewRequest from './new_request';
import PrivateRoute from './private_route';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInForm />} />
      <Route path="/sign-up" element={<SignUpForm />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <PrivateRoute>
            <MyRequests />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-request"
        element={
          <PrivateRoute>
            <NewRequest />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
