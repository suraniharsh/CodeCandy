import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiFolder, FiSearch, FiHeart, FiLogOut, FiInfo } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

const textSpringTransition = {
  type: "spring",
  stiffness: 500,
  damping: 35,
  mass: 0.2,
  restDelta: 0.01
};

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const links = [
    { to: '/', icon: FiHome, label: 'Home' },
    { to: '/collections', icon: FiFolder, label: 'Collections' },
    { to: '/search', icon: FiSearch, label: 'Search' },
    { to: '/favorites', icon: FiHeart, label: 'Favorites' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isOpen ? 240 : 72,
      }}
      transition={springTransition}
      className="fixed left-0 top-0 h-screen bg-dark-800 border-r border-dark-700 z-30 pt-16 flex flex-col overflow-hidden"
    >
      <nav className="p-3 flex-1">
        <ul className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === to
                    ? 'bg-primary-900/20 text-primary-400'
                    : 'text-dark-300 hover:bg-dark-700/50 hover:text-dark-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <motion.div
                  initial={false}
                  animate={{
                    width: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                    x: isOpen ? 0 : -10,
                  }}
                  transition={textSpringTransition}
                  className="overflow-hidden ml-3"
                >
                  <span className="text-sm whitespace-nowrap">
                    {label}
                  </span>
                </motion.div>
              </Link>
            </li>
          ))}
          
          <li>
            <Link
              to="/about"
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/about'
                  ? 'bg-primary-900/20 text-primary-400'
                  : 'text-dark-300 hover:bg-dark-700/50 hover:text-dark-100'
              }`}
            >
              <FiInfo className="w-5 h-5 flex-shrink-0" />
              <motion.div
                initial={false}
                animate={{
                  width: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                  x: isOpen ? 0 : -10,
                }}
                transition={textSpringTransition}
                className="overflow-hidden ml-3"
              >
                <span className="text-sm whitespace-nowrap">
                  About
                </span>
              </motion.div>
            </Link>
          </li>
        </ul>
      </nav>
      
      {user && (
        <div className="p-3 border-t border-dark-700">
          <button
            onClick={signOut}
            className="w-full flex items-center px-3 py-2 rounded-lg text-red-400 hover:bg-dark-700/50 transition-colors"
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            <motion.div
              initial={false}
              animate={{
                width: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -10,
              }}
              transition={textSpringTransition}
              className="overflow-hidden ml-3"
            >
              <span className="text-sm whitespace-nowrap">
                Sign Out
              </span>
            </motion.div>
          </button>
        </div>
      )}
    </motion.aside>
  );
} 