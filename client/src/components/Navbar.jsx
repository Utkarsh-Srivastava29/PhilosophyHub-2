import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getProfileRoute = () => {
    if (user?.userType === "philosopher") {
      return "/philosopher-profile";
    }
    return "/profile";
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Website Name/Logo */}
          <div className="flex-shrink-0">
            <NavLink
              to="/"
              className="text-2xl font-bold text-white hover:text-gray-300"
            >
              PhilosophyHub
            </NavLink>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-gray-300 transition-colors duration-200 ${
                  isActive ? "text-blue-400 border-b-2 border-blue-400" : ""
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/content"
              className={({ isActive }) =>
                `hover:text-gray-300 transition-colors duration-200 ${
                  isActive ? "text-blue-400 border-b-2 border-blue-400" : ""
                }`
              }
            >
              Content
            </NavLink>

            <NavLink
              to="/doubts"
              className={({ isActive }) =>
                `hover:text-gray-300 transition-colors duration-200 ${
                  isActive ? "text-blue-400 border-b-2 border-blue-400" : ""
                }`
              }
            >
              Doubts
            </NavLink>

            <NavLink
              to="/seminars"
              className={({ isActive }) =>
                `hover:text-gray-300 transition-colors duration-200 ${
                  isActive ? "text-blue-400 border-b-2 border-blue-400" : ""
                }`
              }
            >
              Seminars
            </NavLink>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <NavLink
                  to={getProfileRoute()}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-white border border-white hover:bg-white hover:text-gray-900"
                    }`
                  }
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{user?.name || "My Profile"}</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white border border-white rounded-md hover:bg-white hover:text-gray-900 transition-colors duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
