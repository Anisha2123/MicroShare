import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Brand */}
        <Link
          to="/"
          className="text-sm font-semibold tracking-wide text-purple-700"
        >
          MicroShare
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link
            to="/feed"
            className="hover:text-purple-700 transition"
          >
            Feed
          </Link>
          <Link
            to="/create-tip"
            className="hover:text-purple-700 transition"
          >
            Share Tip
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-purple-700 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="hover:text-purple-700 transition"
          >
            Profile
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {!token ? (
            <>
              <Link
                to="/"
                className="text-gray-600 hover:text-purple-700 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 rounded-md
                           border border-purple-600
                           text-purple-700
                           hover:bg-purple-50
                           transition"
              >
                Create Account
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-gray-600 hover:text-purple-700 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-600 hover:text-purple-700 transition"
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-3 text-sm text-gray-600">
            <Link
              to="/feed"
              onClick={() => setOpen(false)}
              className="hover:text-purple-700"
            >
              Feed
            </Link>
            <Link
              to="/create-tip"
              onClick={() => setOpen(false)}
              className="hover:text-purple-700"
            >
              Share Tip
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="hover:text-purple-700"
            >
              Dashboard
            </Link>
            <Link
            to="/profile"
            className="hover:text-purple-700 transition"
          >
            Profile
          </Link>

            <div className="pt-3 border-t border-gray-200">
              {!token ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    className="hover:text-purple-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="hover:text-purple-700"
                  >
                    Create Account
                  </Link>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="hover:text-purple-700"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
