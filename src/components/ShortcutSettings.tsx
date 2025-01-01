import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiKey, FiRefreshCw } from 'react-icons/fi';
import { ShortcutConfig, DEFAULT_SHORTCUTS } from '../types/shortcuts';
import toast from 'react-hot-toast';

interface ShortcutSettingProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ShortcutSetting = ({ label, value, onChange }: ShortcutSettingProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault();
    
    const keys: string[] = [];
    if (event.ctrlKey) keys.push('ctrl');
    if (event.altKey) keys.push('alt');
    if (event.shiftKey) keys.push('shift');
    if (event.metaKey) keys.push('cmd');

    const key = event.key.toLowerCase();
    if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
      keys.push(key === ' ' ? 'space' : key);
      onChange(keys.join('+'));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 gap-2 sm:gap-4">
      <span className="text-dark-200 text-sm sm:text-base">{label}</span>
      <div className="flex items-center">
        <div
          className={`px-2 sm:px-3 py-1.5 bg-dark-700 border ${
            isFocused ? 'border-primary-500 ring-1 ring-primary-500' : 'border-dark-600'
          } rounded text-xs sm:text-sm text-dark-100 w-full sm:w-48 flex items-center justify-center cursor-pointer`}
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        >
          {value.split('+').map((key, i) => (
            <span key={i} className="first:ml-0 ml-1">
              <kbd className="px-1 sm:px-1.5 py-0.5 bg-dark-600 rounded border border-dark-500 text-[10px] sm:text-xs uppercase">
                {key}
              </kbd>
              {i < value.split('+').length - 1 && <span className="ml-1">+</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ShortcutSettingsProps {
  shortcuts: ShortcutConfig;
  onSave: (shortcuts: ShortcutConfig) => void;
}

export function ShortcutSettings({ shortcuts: initialShortcuts, onSave }: ShortcutSettingsProps) {
  const [shortcuts, setShortcuts] = useState<ShortcutConfig>(initialShortcuts);

  const handleSave = () => {
    // Check for duplicate shortcuts
    const values = Object.values(shortcuts);
    const hasDuplicates = values.some((value, index) => values.indexOf(value) !== index);
    
    if (hasDuplicates) {
      toast.error('Duplicate shortcuts detected. Please use unique combinations.');
      return;
    }

    onSave(shortcuts);
    toast.success('Keyboard shortcuts updated successfully');
  };

  const handleReset = () => {
    setShortcuts(DEFAULT_SHORTCUTS);
    toast.success('Keyboard shortcuts reset to defaults');
  };

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden w-full max-w-full sm:max-w-2xl mx-auto">
      <div className="p-3 sm:p-4 border-b border-dark-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-dark-100 flex items-center">
            <FiKey className="mr-2" />
            Keyboard Shortcuts
          </h2>
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-1.5 text-xs sm:text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-700 rounded transition-colors"
          >
            <FiRefreshCw className="mr-2" />
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-1">
        <ShortcutSetting
          label="Search"
          value={shortcuts.search}
          onChange={(value) => setShortcuts(prev => ({ ...prev, search: value }))}
        />
        <ShortcutSetting
          label="New Snippet"
          value={shortcuts.newSnippet}
          onChange={(value) => setShortcuts(prev => ({ ...prev, newSnippet: value }))}
        />
        <ShortcutSetting
          label="New Collection"
          value={shortcuts.newCollection}
          onChange={(value) => setShortcuts(prev => ({ ...prev, newCollection: value }))}
        />
        <ShortcutSetting
          label="Go Home"
          value={shortcuts.home}
          onChange={(value) => setShortcuts(prev => ({ ...prev, home: value }))}
        />
        <ShortcutSetting
          label="Show Shortcuts"
          value={shortcuts.showShortcuts}
          onChange={(value) => setShortcuts(prev => ({ ...prev, showShortcuts: value }))}
        />
      </div>

      <div className="p-3 sm:p-4 bg-dark-750 border-t border-dark-700">
        <button
          onClick={handleSave}
          className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm sm:text-base"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
} 