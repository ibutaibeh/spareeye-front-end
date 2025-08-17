import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import logo from '../../assets/SpareEye.jpg'

const HomePage = ({user, setUser}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="h-screen w-full overflow-hidden text-gray-100">
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

      <main className="ml-64 h-screen">
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-gray-900/95 border-b border-gray-800">
            <div className="p-4">
              <h1 className="text-2xl font-semibold text-white">SpareEye ⚙️</h1>
              <Breadcrumb />
            </div>
          </div>

          <div className="p-6">
            {location.pathname === '/' && (
              <div className="min-h-[84vh] w-full flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-gray-900">
                <div className="relative w-80 h-80 mb-8">
                  <img
                    src={logo}
                    alt="SpareEye Logo"
                    className="w-full h-full object-contain rounded-full shadow-2xl"
                  />
                </div>

                <h1 className="text-6xl font-extrabold  mb-4 animate-slide-fade text-red-700 dark:text-yellow-100">
                  Welcome to SpareEye
                </h1>
                <p className="text-xl text-[var(--color-header)] dark:text-[var(--color-header)] mb-10 animate-slide-fade animate-delay-200 max-w-2xl">
                  Whenever your car breaks, snap a photo and get instant diagnostics, recommendations, and support—all in one app!
                </p>

                <div className="flex gap-6 flex-wrap justify-center">
                  {user ? (<div>

                    <div className="flex justify-end mt-1 mb-6">
                      <Link
                        to="/requests/addnewrequest"
                        className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Add New Request
                      </Link>
                      
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 mt-4 bg-gray-600 hover:bg-red-700 text-white rounded-md transition duration-200"
                    >
                      🚪 Sign Out
                    </button>


                  </div>

                  ) : (
                    <div className="flex gap-6 flex-wrap justify-center">
                      <button
                        onClick={() => navigate("/sign-in")}
                        className="px-8 py-4 bg-gray-800 hover:bg-red-800 text-white rounded-full font-bold shadow-lg transition transform hover:scale-105 hover:shadow-2xl"
                      >
                        🔐 Sign In
                      </button>
                      <button
                        onClick={() => navigate("/sign-up")}
                        className="px-8 py-4 bg-gray-800 hover:bg-green-800 text-white rounded-full font-bold shadow-lg transition transform hover:scale-105 hover:shadow-2xl"
                      >
                        📝 Sign Up
                      </button>

                    </div>
                  )}

                </div>
              </div>
            )}
            <div>

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