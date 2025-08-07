import React, { useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">

      <aside className="w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col justify-between shadow-lg fixed">
        <div className="p-6">

          {user ? (
            <div className="mb-6 text-center">
              <p className="text-xl font-bold text-blue-400">Welcome,</p>
              <p className="text-lg font-semibold text-white">{user.username}</p>
            </div>
          ) : (
            <div className="mb-6 text-center">
              <img
                src="https://picsum.photos/id/1/100"
                alt="Logo"
                className="w-20 h-20 mx-auto rounded-full shadow-md"
              />
              <p className="mt-2 text-sm text-gray-400">Guest Mode</p>
            </div>
          )}

          <nav className="flex flex-col gap-2">
            {user ? (
              <>
                <SidebarLink to="/" label="🏠 Dashboard" />
                <SidebarLink to="/profile" label="👤 Profile" />
                <SidebarLink to="/my-requests" label="📥 My Requests" />
                <SidebarLink to="/settings" label="⚙️ Settings" />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200"
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <SidebarLink to="/sign-up" label="📝 Sign Up" />
                <SidebarLink to="/sign-in" label="🔐 Sign In" />
              </>
            )}
          </nav>
        </div>

        <div className="p-4 text-xs text-gray-500 text-center border-t border-gray-800">
          Spare Eye
        </div>
      </aside>

      <main className="ml-64 flex-1 p-6">
        <div className="bg-gray-900 p-4 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <Breadcrumb />
        </div>
        <div className="bg-gray-950 p-4 rounded-lg">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

const SidebarLink = ({ to, label }) => (
  <Link
    to={to}
    className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition duration-200"
  >
    {label}
  </Link>
)

export default HomePage
