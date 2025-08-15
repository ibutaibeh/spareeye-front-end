import React from 'react'

const Settings = () => {
  return (
    <>
    <div className="min-h-[84vh] w-full flex flex-col items-center justify-center text-center px-6 bg-gray-900">
 <div className="w-full max-w-lg space-y-4">

    {/* Header */}
    <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>

    {/* Theme */}
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-lg">
      <span className="text-lg font-semibold text-black">Theme</span>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-black">
          <input type="radio" name="theme" value="dark" className="w-5 h-5 accent-blue-500" />
          <span className="text-lg">Dark</span>
        </label>
        <label className="flex items-center gap-2 text-black">
          <input type="radio" name="theme" value="light" className="w-5 h-5 accent-blue-500" />
          <span className="text-lg">Light</span>
        </label>
      </div>
    </div>

    {/* AI Companion Voice */}
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-lg">
      <span className="text-lg font-semibold text-black">AI Companion Voice</span>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-black">
          <input type="radio" name="voice" value="male" className="w-5 h-5 accent-blue-500" />
          <span className="text-lg">Male</span>
        </label>
        <label className="flex items-center gap-2 text-black">
          <input type="radio" name="voice" value="female" className="w-5 h-5 accent-blue-500" />
          <span className="text-lg">Female</span>
        </label>
      </div>
    </div>

    {/* Notifications */}
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-lg">
      <span className="text-lg font-semibold text-black">Notifications</span>
      <input type="checkbox" className="w-6 h-6 accent-blue-500" />
    </div>

    {/* Auto-Updates */}
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-lg">
      <span className="text-lg font-semibold text-black">Enable Auto-Updates</span>
      <input type="checkbox" className="w-6 h-6 accent-blue-500" />
    </div>

  </div>
</div>
 
    </>
  )
}

export default Settings