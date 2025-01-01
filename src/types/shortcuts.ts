export interface ShortcutConfig {
  search: string;
  newSnippet: string;
  newCollection: string;
  home: string;
  showShortcuts: string;
}

export const DEFAULT_SHORTCUTS: ShortcutConfig = {
  search: 'alt+k',
  newSnippet: 'alt+n',
  newCollection: 'alt+c',
  home: 'alt+h',
  showShortcuts: 'ctrl+/',
}; 