import React, { useEffect, useState, useContext, useCallback } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getSettings, updateSettings } from '../../services/settingsService';

const Settings = () => {
  const { user } = useContext(UserContext);
  const userId = user?._id;

  const [settings, setSettings] = useState({
    theme: 'dark',
    aiVoice: 'male',
    notifications: false,
    autoUpdates: false,
  });
  const [loading, setLoading] = useState(true);

  // Apply theme class to <html> whenever settings.theme changes
  useEffect(() => {
    if (!loading) {
      const root = document.documentElement;
      if (settings.theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
      // Optional: persist user preference locally too
      localStorage.setItem('theme', settings.theme);
    }
  }, [settings.theme, loading]);

  // Initial fetch (ensures a settings doc exists server-side)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userId) return;
      try {
        const data = await getSettings(userId);
        if (mounted && data) {
          setSettings({
            theme: data.theme ?? 'dark',
            aiVoice: data.aiVoice ?? 'male',
            notifications: !!data.notifications,
            autoUpdates: !!data.autoUpdates,
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [userId]);

  // Optimistic update helper: updates local state, then API
  const applyUpdate = useCallback(async (patch) => {
    if (!userId) return;
    // optimistic UI
    setSettings(prev => ({ ...prev, ...patch }));
    try {
      await updateSettings(userId, patch);
    } catch (err) {
      // revert on failure by refetching minimal truth
      const fresh = await getSettings(userId);
      setSettings({
        theme: fresh.theme ?? 'dark',
        aiVoice: fresh.aiVoice ?? 'male',
        notifications: !!fresh.notifications,
        autoUpdates: !!fresh.autoUpdates,
      });
      console.error('Failed to save settings:', err);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-[84vh] w-full flex items-center justify-center bg-gray-900">
        <p className="text-gray-300">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[84vh] w-full flex flex-col items-center justify-center px-6 bg-[var(--color-bg)]">
      <div className="w-full max-w-lg space-y-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Settings</h2>

        {/* Theme */}
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-lg">
          <span className="text-lg font-semibold text-black">Theme</span>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={settings.theme === 'dark'}
                onChange={() => applyUpdate({ theme: 'dark' })}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="text-lg">Dark</span>
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={settings.theme === 'light'}
                onChange={() => applyUpdate({ theme: 'light' })}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="text-lg">Light</span>
            </label>
          </div>
        </div>

        {/* AI Companion Voice */}
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-lg">
          <span className="text-lg font-semibold text-black">AI Companion Voice</span>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="aiVoice"
                value="male"
                checked={settings.aiVoice === 'male'}
                onChange={() => applyUpdate({ aiVoice: 'male' })}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="text-lg">Male</span>
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="aiVoice"
                value="female"
                checked={settings.aiVoice === 'female'}
                onChange={() => applyUpdate({ aiVoice: 'female' })}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="text-lg">Female</span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-lg">
          <span className="text-lg font-semibold text-black">Notifications</span>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={e => applyUpdate({ notifications: e.target.checked })}
            className="w-6 h-6 accent-blue-500"
          />
        </div>

        {/* Auto-Updates */}
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-lg">
          <span className="text-lg font-semibold text-black">Enable Auto-Updates</span>
          <input
            type="checkbox"
            checked={settings.autoUpdates}
            onChange={e => applyUpdate({ autoUpdates: e.target.checked })}
            className="w-6 h-6 accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
