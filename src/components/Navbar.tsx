import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiPlus } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

interface NavbarProps {
  onSidebarToggle: (isOpen: boolean) => void;
}

export function Navbar({ onSidebarToggle }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setIsModalVisible: setIsShortcutsOpen } = useKeyboardShortcuts();

  const handleSidebarToggle = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    onSidebarToggle(newState);
  };

  const renderShortcuts = () => {
    return (
      <button
        onClick={() => setIsShortcutsOpen(true)}
        type="button"
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 rounded-lg transition-colors w-max"
      >
        <span className="text-sm">Shortcuts</span>
        <span className="text-xs text-dark-400">(Ctrl + /)</span>
      </button>
    );
  };

  const rightSection = () => {
    return (
      <div className="flex flex-col items-center gap-2 p-2 ml-auto md:flex-row sm:gap-3">
        <div className="hidden md:block">
          {renderShortcuts()}
        </div>
        <Link
          to="/create"
          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex-shrink-0 w-full md:w-max text-center"
          rel="noopener noreferrer"
        >
          <FiPlus className="w-4 h-4" />
          <span className="text-sm">New Snippet</span>
        </Link>

        {user ? (
          <div className="relative group">
            <button
              className="w-8 h-8 overflow-hidden transition-colors border-2 border-transparent rounded-full sm:w-9 sm:h-9 hover:border-primary-500"
              type="button"
              aria-label="User Avatar"
            >
              <img
                src={user.photoURL || ""}
                alt={user.displayName || "User"}
                className="object-cover w-full h-full"
              />
            </button>

            <div className="absolute right-0 invisible w-48 py-1 mt-2 transition-all border rounded-lg shadow-xl opacity-0 top-full bg-dark-800 border-dark-700 group-hover:opacity-100 group-hover:visible">
              <div className="px-4 py-2 border-b border-dark-700">
                <p className="text-sm font-medium truncate text-dark-100">
                  {user.displayName}
                </p>
                <p className="text-xs truncate text-dark-400">{user.email}</p>
              </div>
              <Link
                to="/profile"
                className="block w-full px-4 py-2 text-sm transition-colors text-dark-200 hover:bg-dark-700"
                aria-label="Profile"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block w-full px-4 py-2 text-sm transition-colors text-dark-200 hover:bg-dark-700"
                aria-label="Settings"
              >
                Settings
              </Link>
              <button
                onClick={signOut}
                className="block w-full px-4 py-2 text-sm text-left text-red-400 transition-colors hover:bg-dark-700"
                type="button"
                aria-label="Sign Out"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="md:px-3 py-1.5 text-sm text-dark-100 hover:bg-dark-700/50 rounded-lg transition-colors w-full text-center bg-dark-500"
            rel="noopener noreferrer"
            aria-label="Sign In"
          >
            Sign In
          </Link>
        )}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-screen h-16 border-b bg-dark-800 border-dark-700">
      <nav className="fixed top-0 left-0 right-0 z-40 w-full h-16 border-b bg-dark-800 border-dark-700">
        <div className="max-w-[100rem] flex items-center justify-between h-full px-3 sm:px-4">
          {/* Left section */}
          <div className="flex items-center gap-2 mr-auto sm:gap-4">
            <button
              onClick={handleSidebarToggle}
              className="p-2 transition-colors rounded-lg text-dark-300 hover:text-dark-100 hover:bg-dark-700/50"
              type="button"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? (
                <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>

            <Link
              to="/"
              className="hidden text-lg font-bold sm:text-xl text-dark-100 md:block"
              rel="noopener noreferrer"
              aria-label="CodeCandy"
            >
              CodeCandy
            </Link>
          </div>

          {/* Center section */}
          <div className="flex-1 hidden max-w-2xl mx-4 md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search snippets!!..."
                className="w-full px-4 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 text-sm placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <FiSearch className="absolute -translate-y-1/2 right-3 top-1/2 text-dark-400" />
            </div>
          </div>

          {/* Right section desktop */}
          <div className="hidden md:block">{rightSection()}</div>

          {/* Right section mobile */}
          <div className="absolute right-0 flex items-center justify-end w-full ml-auto md:hidden">
            <div className="flex items-center justify-end w-full ml-auto md:hidden">
              <Link
                to="/search"
                className="p-2 transition-colors rounded-lg text-dark-300 hover:text-dark-100 hover:bg-dark-700/50"
                rel="noopener noreferrer"
              >
                <FiSearch className="w-5 h-5" />
              </Link>
              {renderShortcuts()}
            </div>

            <div className="relative group">
              <div
                className="w-full p-2 text-center transition-colors border rounded-lg text-dark-300 hover:text-dark-100 hover:bg-dark-700/50"
                title="Mouse over to see menu"
              >
                MENU
              </div>
              <div className="right-0 hidden w-48 py-1 rounded-lg bg-white/10 -top-13 border-dark-700 group-hover:block group-hover:absolute">
                {rightSection()}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
