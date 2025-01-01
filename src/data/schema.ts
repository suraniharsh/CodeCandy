// Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: number;
  favorites: string[]; // Array of snippet IDs
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  userId: string;
  collectionId?: string;
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
  favorites: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  userId: string;
  snippetCount: number;
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
}

// Sample Data
export const sampleUsers: User[] = [
  {
    uid: 'user1',
    email: 'john@example.com',
    displayName: 'John Doe',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    favorites: ['snippet1', 'snippet3']
  },
  {
    uid: 'user2',
    email: 'jane@example.com',
    displayName: 'Jane Smith',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    favorites: ['snippet2']
  }
];

export const sampleCollections: Collection[] = [
  {
    id: 'collection1',
    name: 'React Hooks',
    description: 'Collection of useful React hooks and patterns',
    userId: 'user1',
    snippetCount: 2,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    isPublic: true
  },
  {
    id: 'collection2',
    name: 'TypeScript Utils',
    description: 'Handy TypeScript utility functions and types',
    userId: 'user2',
    snippetCount: 1,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    isPublic: true
  }
];

export const sampleSnippets: Snippet[] = [
  {
    id: 'snippet1',
    title: 'useLocalStorage Hook',
    description: 'A custom React hook for managing localStorage state',
    code: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get stored value
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  // State to store our value
  const [value, setValue] = useState<T>(initial);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
    language: 'typescript',
    tags: ['react', 'hooks', 'typescript', 'localStorage'],
    userId: 'user1',
    collectionId: 'collection1',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    isPublic: true,
    favorites: 2
  },
  {
    id: 'snippet2',
    title: 'Deep Clone Function',
    description: 'A utility function to deep clone objects and arrays',
    code: `export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone) as unknown as T;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  ) as T;
}`,
    language: 'typescript',
    tags: ['typescript', 'utility', 'objects'],
    userId: 'user2',
    collectionId: 'collection2',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    isPublic: true,
    favorites: 1
  },
  {
    id: 'snippet3',
    title: 'useDebounce Hook',
    description: 'A React hook for debouncing values',
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    language: 'typescript',
    tags: ['react', 'hooks', 'typescript', 'debounce'],
    userId: 'user1',
    collectionId: 'collection1',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    isPublic: true,
    favorites: 1
  }
]; 