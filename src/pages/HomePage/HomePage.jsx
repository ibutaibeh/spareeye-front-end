import React, { useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import AddNewRequest from "../../components/AddNewRequest/AddNewRequest";

const HomePage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    // Lock the page to viewport height and prevent document scrolling
    <div className="h-screen w-full overflow-hidden text-gray-100">
      {/* Fixed, full-height sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 shadow-lg">
        <div className="h-full flex flex-col justify-between">
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
                  <SidebarLink to="/requests" label="📥 My Requests" />
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
        </div>
      </aside>

      {/* Main area — occupies the rest of the viewport, internal scroll only */}
      <main className="ml-64 h-screen">
        {/* Single scroll container for the main area */}
        <div className="h-full overflow-y-auto">
          {/* Fixed (sticky) header */}
          <div className="sticky top-0 z-10 bg-gray-900/95 border-b border-gray-800">
            <div className="p-4">
              <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
              <Breadcrumb />
            </div>
          </div>

          {/* Scrollable content (Outlet) */}
          <div className="p-6">
            <div className="p-4 rounded-lg shadow">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ to, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      [
        "px-4 py-2 rounded-md transition duration-200",
        isActive
          ? "bg-gray-800 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white",
      ].join(" ")
    }
  >
    {label}
  </NavLink>
);

export default HomePage;