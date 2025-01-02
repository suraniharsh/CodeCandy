import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiPlus } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 border-b bg-dark-800 border-dark-700">
      <div className="flex items-center justify-between h-full px-3 sm:px-4">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleSidebarToggle}
            className="p-2 transition-colors rounded-lg text-dark-300 hover:text-dark-100 hover:bg-dark-700/50"
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
            className="hidden text-lg font-bold sm:text-xl text-dark-100 sm:block"
          >
            CodeCandy
          </Link>
        </div>

        {/* Center section */}
        <div className="flex-1 hidden max-w-2xl mx-4 sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search snippets..."
              className="w-full px-4 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 text-sm placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            <FiSearch className="absolute -translate-y-1/2 right-3 top-1/2 text-dark-400" />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/search"
            className="p-2 transition-colors rounded-lg text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 sm:hidden"
          >
            <FiSearch className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 rounded-lg transition-colors"
          >
            <span className="text-sm">Shortcuts</span>
            <span className="text-xs text-dark-400">(Ctrl + /)</span>
          </button>

          <Link
            to="/create"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span className="text-sm">New Snippet</span>
          </Link>

          <Link
            to="/create"
            className="p-2 transition-colors rounded-lg sm:hidden text-dark-300 hover:text-dark-100 hover:bg-dark-700/50"
          >
            <FiPlus className="w-5 h-5" />
          </Link>

          {user ? (
            <div className="relative group">
              <button className="w-8 h-8 overflow-hidden transition-colors border-2 border-transparent rounded-full sm:w-9 sm:h-9 hover:border-primary-500">
                <img
                  src={user.photoURL || ''}
                  alt={user.displayName || 'User'}
                  className="object-cover w-full h-full"
                />
              </button>

              <div className="absolute right-0 invisible w-48 py-1 mt-2 transition-all border rounded-lg shadow-xl opacity-0 top-full bg-dark-800 border-dark-700 group-hover:opacity-100 group-hover:visible">
                <div className="px-4 py-2 border-b border-dark-700">
                  <p className="text-sm font-medium truncate text-dark-100">{user.displayName}</p>
                  <p className="text-xs truncate text-dark-400">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block w-full px-4 py-2 text-sm transition-colors text-dark-200 hover:bg-dark-700"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block w-full px-4 py-2 text-sm transition-colors text-dark-200 hover:bg-dark-700"
                >
                  Settings
                </Link>
                <button
                  onClick={signOut}
                  className="block w-full px-4 py-2 text-sm text-left text-red-400 transition-colors hover:bg-dark-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm text-dark-100 hover:bg-dark-700/50 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 