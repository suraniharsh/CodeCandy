import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShortcutSettings } from '../components/ShortcutSettings';
import { ShortcutConfig, DEFAULT_SHORTCUTS } from '../types/shortcuts';
import { useAuth } from '../contexts/AuthContext';

function Settings() {
  const { user } = useAuth();
  const [shortcuts, setShortcuts] = useState<ShortcutConfig>(() => {
    const savedShortcuts = localStorage.getItem(`shortcuts_${user?.uid}`);
    return savedShortcuts ? JSON.parse(savedShortcuts) : DEFAULT_SHORTCUTS;
  });

  const handleSaveShortcuts = (newShortcuts: ShortcutConfig) => {
    setShortcuts(newShortcuts);
    localStorage.setItem(`shortcuts_${user?.uid}`, JSON.stringify(newShortcuts));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-dark-100 mb-6">Settings</h1>
      
      <div className="space-y-6">
        <section>
          <ShortcutSettings
            shortcuts={shortcuts}
            onSave={handleSaveShortcuts}
          />
        </section>
      </div>
    </motion.div>
  );
}

export default Settings; 