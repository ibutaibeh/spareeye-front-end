import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getUser, updateUser, changePassword } from '../../services/userService';

const Profile = () => {
  const { user } = useContext(UserContext); // expects { _id, ... }
  const userId = user?._id;

  const [form, setForm] = useState({ username: '', email: '' });
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getUser(userId); // { user: {...} }
        const me = data?.user || {};
        if (mounted) {
          const snapshot = {
            username: me.username || '',
            email: me.email || '',
          };
          setForm(snapshot);
          setInitial(snapshot);
        }
      } catch (e) {
        if (mounted) setError('Failed to load profile.');
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [userId]);

  const onProfileChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setOk('');
    setError('');
  };

  const onSaveProfile = async () => {
    if (!userId) return;
    setSavingProfile(true);
    setOk('');
    setError('');
    try {
      const patch = { username: form.username, email: form.email };
      const updated = await updateUser(userId, patch);
      const me = updated?.user || updated || {};
      const snapshot = {
        username: me.username ?? form.username,
        email: me.email ?? form.email,
      };
      setInitial(snapshot);
      setForm(snapshot);
      setOk('Profile updated.');
    } catch (e) {
      setError('Failed to update profile.');
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  const onSavePassword = async () => {
    if (!userId) return;
    setOk('');
    setError('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill all password fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(userId, {
        currentPassword,
        newPassword,
      });
      setOk('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (e) {
      setError('Failed to update password.');
      console.error(e);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[84vh] w-full flex items-center justify-center bg-gray-900">
        <p className="text-gray-300">Loading profile…</p>
      </div>
    );
  }

  return (
   <div className="min-h-[84vh] w-full flex flex-col items-center px-6 bg-[var(--color-bg)] dark:bg-[var(--color-bg)]">
  <div className="w-full max-w-3xl py-10 space-y-6">
    <h2 className="text-3xl font-bold text-[var(--color-header)] dark:text-[var(--color-header)]">User Profile</h2>

    {error && (
      <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-lg">
        {error}
      </div>
    )}
    {ok && (
      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-lg">
        {ok}
      </div>
    )}

    {/* Profile Card */}
    <div className="bg-[var(--color-card)] dark:bg-[var(--color-card)] rounded-xl shadow-lg p-6 space-y-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[var(--color-text)]">Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={onProfileChange}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)] bg-transparent"
          autoComplete="username"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[var(--color-text)]">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onProfileChange}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)] bg-transparent"
          autoComplete="email"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSaveProfile}
          disabled={savingProfile}
          className="px-4 py-2 rounded-xl font-semibold text-white bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-60"
        >
          {savingProfile ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </div>

    {/* Change Password Card */}
    <div className="bg-[var(--color-card)] dark:bg-[var(--color-card)] rounded-xl shadow-lg p-6 space-y-5">
      <h3 className="text-lg font-semibold text-[var(--color-text)]">Change Password</h3>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[var(--color-text)]">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)] bg-transparent"
          autoComplete="current-password"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[var(--color-text)]">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)] bg-transparent"
          autoComplete="new-password"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[var(--color-text)]">Confirm New Password</label>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)] bg-transparent"
          autoComplete="new-password"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSavePassword}
          disabled={savingPassword}
          className="px-4 py-2 rounded-xl font-semibold text-white bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-60"
        >
          {savingPassword ? 'Saving…' : 'Update Password'}
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default Profile;