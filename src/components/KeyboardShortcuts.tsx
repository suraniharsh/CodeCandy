import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCommand } from 'react-icons/fi';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_SHORTCUTS } from '../types/shortcuts';

const ShortcutItem = ({ combo, description }: { combo: string; description: string }) => (
  <div className="flex items-center justify-between py-2 px-3 sm:px-4 hover:bg-dark-700/50">
    <span className="text-dark-200 text-sm sm:text-base">{description}</span>
    <div className="flex items-center gap-1 ml-2">
      {combo.split('+').map((key, i) => (
        <span key={i}>
          <kbd className="min-w-[1.5rem] sm:min-w-[1.8rem] px-1.5 sm:px-2 py-0.5 sm:py-1 bg-dark-600 rounded border border-dark-500 text-[10px] sm:text-xs font-medium text-dark-100 inline-flex items-center justify-center">
            {key.toUpperCase()}
          </kbd>
          {i < combo.split('+').length - 1 && (
            <span className="mx-0.5 sm:mx-1 text-dark-400">+</span>
          )}
        </span>
      ))}
    </div>
  </div>
);

export function KeyboardShortcuts() {
  const { isModalVisible, setIsModalVisible } = useKeyboardShortcuts();
  const { user } = useAuth();

  // Load user shortcuts or defaults
  const shortcuts = user?.uid
    ? JSON.parse(localStorage.getItem(`shortcuts_${user.uid}`) || JSON.stringify(DEFAULT_SHORTCUTS))
    : DEFAULT_SHORTCUTS;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalVisible(false);
      }
    };

    if (isModalVisible) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isModalVisible, setIsModalVisible]);

  return (
    <AnimatePresence>
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalVisible(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[90vw] sm:max-w-md bg-dark-800 rounded-lg shadow-xl border border-dark-700"
          >
            <div className="p-3 sm:p-4 border-b border-dark-700 flex items-center justify-between">
              <div className="flex items-center">
                <FiCommand className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 mr-2" />
                <h2 className="text-base sm:text-lg font-semibold text-dark-100">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={() => setIsModalVisible(false)}
                className="text-dark-400 hover:text-dark-100 transition-colors p-1"
              >
                <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="py-1 sm:py-2 divide-y divide-dark-700/50">
              <ShortcutItem combo={shortcuts.search} description="Search snippets" />
              <ShortcutItem combo={shortcuts.newSnippet} description="Create new snippet" />
              <ShortcutItem combo={shortcuts.newCollection} description="Create new collection" />
              <ShortcutItem combo={shortcuts.home} description="Go to home" />
              <ShortcutItem combo={shortcuts.showShortcuts} description="Show/hide shortcuts" />
            </div>
            
            <div className="p-3 sm:p-4 bg-dark-750 border-t border-dark-700 flex items-center justify-center">
              <a
                href="/settings"
                onClick={() => setIsModalVisible(false)}
                className="text-xs sm:text-sm text-primary-400 hover:text-primary-300 flex items-center gap-2"
              >
                <FiCommand className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Customize shortcuts in Settings</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 