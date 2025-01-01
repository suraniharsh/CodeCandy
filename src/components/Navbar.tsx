import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiPlus} from 'react-icons/fi';
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
    <nav className="fixed top-0 left-0 right-0 h-16 bg-dark-800 border-b border-dark-700 z-40">
      <div className="h-full px-3 sm:px-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleSidebarToggle}
            className="p-2 text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 rounded-lg transition-colors"
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
            className="text-lg sm:text-xl font-bold text-dark-100 hidden sm:block"
          >
            CodeCandy
          </Link>
        </div>

        {/* Center section */}
        <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search snippets..."
              className="w-full px-4 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 text-sm placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400" />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/search"
            className="p-2 text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 rounded-lg transition-colors sm:hidden"
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
            className="sm:hidden p-2 text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 rounded-lg transition-colors"
          >
            <FiPlus className="w-5 h-5" />
          </Link>

          {user ? (
            <div className="relative group">
              <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-primary-500 transition-colors">
                <img
                  src={user.photoURL || ''}
                  alt={user.displayName || 'User'}
                  className="w-full h-full object-cover"
                />
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-dark-800 rounded-lg border border-dark-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-4 py-2 border-b border-dark-700">
                  <p className="text-sm font-medium text-dark-100 truncate">{user.displayName}</p>
                  <p className="text-xs text-dark-400 truncate">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block w-full px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block w-full px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={signOut}
                  className="block w-full px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors text-left"
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