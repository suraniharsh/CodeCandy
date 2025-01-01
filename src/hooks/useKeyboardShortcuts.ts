import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_SHORTCUTS } from '../types/shortcuts';
import { useAuth } from '../contexts/AuthContext';

function parseShortcut(shortcut: string): { modifiers: string[], key: string } {
  const parts = shortcut.toLowerCase().split('+');
  const key = parts[parts.length - 1];
  const modifiers = parts.slice(0, -1);
  return { modifiers, key };
}

function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const { modifiers, key } = parseShortcut(shortcut);
  
  // Check if the key matches (handle special cases)
  const eventKey = event.key.toLowerCase();
  const matchesKey = eventKey === key || 
    (eventKey === 'escape' && key === 'esc') ||
    (eventKey === ' ' && key === 'space');
  
  if (!matchesKey) return false;

  // Check modifiers
  const hasCtrl = modifiers.includes('ctrl');
  const hasAlt = modifiers.includes('alt');
  const hasShift = modifiers.includes('shift');

  return event.ctrlKey === hasCtrl && 
         event.altKey === hasAlt && 
         event.shiftKey === hasShift;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Load user-specific shortcuts or defaults
    const loadShortcuts = () => {
      if (user?.uid) {
        const savedShortcuts = localStorage.getItem(`shortcuts_${user.uid}`);
        return savedShortcuts ? JSON.parse(savedShortcuts) : DEFAULT_SHORTCUTS;
      }
      return DEFAULT_SHORTCUTS;
    };

    const shortcuts = loadShortcuts();

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Handle shortcuts
      if (matchesShortcut(event, shortcuts.search)) {
        event.preventDefault();
        navigate('/search');
      }
      else if (matchesShortcut(event, shortcuts.newSnippet)) {
        event.preventDefault();
        navigate('/create');
      }
      else if (matchesShortcut(event, shortcuts.newCollection)) {
        event.preventDefault();
        navigate('/collections/create');
      }
      else if (matchesShortcut(event, shortcuts.home)) {
        event.preventDefault();
        navigate('/');
      }
      else if (matchesShortcut(event, shortcuts.showShortcuts)) {
        event.preventDefault();
        setIsModalVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, user]);

  return { isModalVisible, setIsModalVisible };
} 