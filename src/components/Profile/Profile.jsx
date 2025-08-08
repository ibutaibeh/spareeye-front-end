import React, { useContext, useMemo } from 'react';
import { UserContext } from '../../contexts/UserContext';

function safeString(value, fallback) {
  if (value === undefined) return fallback;
  if (value === null) return fallback;
  if (typeof value !== 'string') return fallback;
  if (value.trim() === '') return fallback;
  return value;
}

export default function Profile() {
  const context = useContext(UserContext);

  const user = useMemo(() => {
    if (context === undefined) return null;
    if (context === null) return null;
    if (context.user === undefined) return null;
    if (context.user === null) return null;
    return context.user;
  }, [context]);

  const displayName = useMemo(() => safeString(user && user.name, 'Not specified'), [user]);
  const displayEmail = useMemo(() => safeString(user && user.email, 'Not specified'), [user]);
  const displayJoined = useMemo(() => {
    if (user === null) return 'Unavailable';
    if (user.joinedAt === undefined) return 'Unavailable';
    if (user.joinedAt === null) return 'Unavailable';
    return String(user.joinedAt);
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-gray-700">Name:</dt>
            <dd className="text-gray-900">{displayName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Email:</dt>
            <dd className="text-gray-900">{displayEmail}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Joined At:</dt>
            <dd className="text-gray-900">{displayJoined}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
