import React from 'react';
import { Navigate } from 'react-router-dom';

function hasValidToken() {
  try {
    const token = localStorage.getItem('token');
    if (token === undefined) return false;
    if (token === null) return false;
    if (typeof token !== 'string') return false;
    if (token.trim() === '') return false;
    return true;
  } catch {
    return false;
  }
}

export default function PrivateRoute({ children }) {
  if (hasValidToken() === false) {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
}
